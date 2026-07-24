"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import type { books } from "@/db/schema";
import {
  loanBook,
  returnBook,
  deleteBook,
  sendLoanReminder,
  updateBookDetails,
  uploadBookCover,
} from "./actions";
import { AddBookForm } from "./add-book-form";
import {
  CONDITIONS,
  FORMATS,
  READING_STATUSES,
  READING_STATUS_LABELS,
} from "./book-constants";
import { StarRating } from "./star-rating";

type Book = typeof books.$inferSelect;

function Modal({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded border bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-gray-500 hover:text-foreground"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LoanedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
      <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" aria-hidden="true">
        <path
          d="M4 10h9m0 0-3-3m3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M4 5v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Loaned
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "unread") return null;
  const label = READING_STATUS_LABELS[status as keyof typeof READING_STATUS_LABELS] ?? status;
  return (
    <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
      {label}
    </span>
  );
}

export function BookList({ books }: { books: Book[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) =>
      [book.title, book.author, book.isbn]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q)),
    );
  }, [books, query]);

  const selected = books.find((b) => b.id === selectedId) ?? null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search your library..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[200px] flex-1 rounded border px-3 py-2"
        />
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          + Add a book
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-sm text-gray-500">No books yet — add your first one above.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No books match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedId(book.id)}
              className="flex flex-col gap-2 rounded border p-3 text-left hover:bg-accent/5"
            >
              <div className="aspect-[2/3] w-full overflow-hidden rounded bg-gray-100">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    width={300}
                    height={450}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No cover
                  </div>
                )}
              </div>
              <p className="line-clamp-2 font-medium">{book.title}</p>
              {book.author && (
                <p className="line-clamp-1 text-sm text-gray-500">{book.author}</p>
              )}
              {(book.loanedAt || book.readingStatus !== "unread") && (
                <div className="flex flex-wrap items-center gap-1">
                  {book.loanedAt && <LoanedBadge />}
                  <StatusBadge status={book.readingStatus} />
                </div>
              )}
              <StarRating value={book.rating ?? 0} />
            </button>
          ))}
        </div>
      )}

      {selected && <BookDetailsPanel book={selected} onClose={() => setSelectedId(null)} />}

      {isAdding && (
        <Modal title="Add a book" onClose={() => setIsAdding(false)}>
          <AddBookForm onAdded={() => setIsAdding(false)} />
        </Modal>
      )}
    </>
  );
}

function BookDetailsPanel({ book, onClose }: { book: Book; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col gap-6 overflow-y-auto border-l bg-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  width={64}
                  height={96}
                  unoptimized
                  className="rounded object-cover"
                />
              ) : (
                <div className="flex h-24 w-16 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">
                  No cover
                </div>
              )}
              <CoverUploadButton bookId={book.id} />
            </div>
            <div>
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-500">
                {[book.author, book.publishedDate, book.isbn].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-gray-500 hover:text-foreground"
          >
            ×
          </button>
        </div>

        <DetailsForm
          key={`${book.condition}-${book.format}-${book.edition}-${book.readingStatus}-${book.rating}-${book.signed}-${book.notes}`}
          book={book}
        />

        <div className="border-t pt-6">
          {book.loanedAt ? <LoanedSection book={book} /> : <LoanForm bookId={book.id} />}
        </div>

        <form action={deleteBook} className="mt-auto border-t pt-6">
          <input type="hidden" name="bookId" value={book.id} />
          <button type="submit" className="text-sm text-red-600 underline">
            Remove from library
          </button>
        </form>
      </div>
    </div>
  );
}

function CoverUploadButton({ bookId }: { bookId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("bookId", bookId);
      formData.set("file", file);
      try {
        const result = await uploadBookCover(formData);
        if (result?.error) setError(result.error);
      } catch {
        setError("Upload failed — please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <label className="cursor-pointer text-xs underline">
        {isPending ? "Uploading..." : "Change cover"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={handleChange}
          disabled={isPending}
          className="hidden"
        />
      </label>
      {error && <span className="max-w-[80px] text-center text-xs text-red-600">{error}</span>}
    </div>
  );
}

function DetailsForm({ book }: { book: Book }) {
  const [rating, setRating] = useState(book.rating ?? 0);

  return (
    <form action={updateBookDetails} className="flex flex-col gap-3 border-t pt-6">
      <h3 className="font-medium">Details</h3>
      <input type="hidden" name="bookId" value={book.id} />

      <textarea
        name="notes"
        placeholder="Synopsis / notes"
        rows={3}
        defaultValue={book.notes ?? ""}
        className="rounded border px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          name="condition"
          defaultValue={book.condition ?? ""}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">Condition</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="format"
          defaultValue={book.format ?? ""}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">Format</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <input
        name="edition"
        placeholder="Edition / printing"
        defaultValue={book.edition ?? ""}
        className="rounded border px-3 py-2 text-sm"
      />

      <select
        name="readingStatus"
        defaultValue={book.readingStatus}
        className="rounded border px-3 py-2 text-sm"
      >
        {READING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {READING_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="signed" defaultChecked={book.signed} />
          Signed copy
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Your rating</span>
          <StarRating value={rating} onChange={setRating} />
          <input type="hidden" name="rating" value={rating} />
        </div>
      </div>

      <button type="submit" className="self-start rounded border px-3 py-2 text-sm">
        Save details
      </button>
    </form>
  );
}

function LoanForm({ bookId }: { bookId: string }) {
  return (
    <form action={loanBook} className="flex flex-col gap-3">
      <h3 className="font-medium">Loan this book</h3>
      <input name="bookId" type="hidden" value={bookId} />
      <input
        name="borrowerName"
        placeholder="Borrower's name"
        required
        className="rounded border px-3 py-2"
      />
      <input
        name="borrowerEmail"
        type="email"
        placeholder="Borrower's email (optional)"
        className="rounded border px-3 py-2"
      />
      <button type="submit" className="self-start rounded bg-accent px-3 py-2 text-sm text-accent-foreground">
        Mark as loaned
      </button>
    </form>
  );
}

function LoanedSection({ book }: { book: Book }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-medium">Loaned out</h3>
      <p className="text-sm">
        Loaned to <span className="font-medium">{book.loanedToName}</span>
        {book.loanedToEmail && <> ({book.loanedToEmail})</>}
      </p>
      <p className="text-sm text-gray-500">Since {book.loanedAt!.toLocaleDateString()}</p>

      <div className="flex flex-wrap gap-2">
        {book.loanedToEmail && <SendReminderButton bookId={book.id} />}
        <form action={returnBook}>
          <input type="hidden" name="bookId" value={book.id} />
          <button type="submit" className="rounded border px-3 py-2 text-sm">
            Mark as returned
          </button>
        </form>
      </div>
    </div>
  );
}

function SendReminderButton({ bookId }: { bookId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  function handleClick() {
    setStatus("idle");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("bookId", bookId);
      try {
        await sendLoanReminder(formData);
        setStatus("sent");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send reminder email"}
      </button>
      {status === "sent" && <span className="text-sm text-green-700">Sent!</span>}
      {status === "error" && <span className="text-sm text-red-600">Failed to send</span>}
    </div>
  );
}
