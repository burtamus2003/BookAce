"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { books } from "@/db/schema";
import { loanBook, returnBook, deleteBook, sendLoanReminder } from "./actions";

type Book = typeof books.$inferSelect;

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
        <path
          d="M4 5v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      Loaned
    </span>
  );
}

export function BookList({ books }: { books: Book[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = books.find((b) => b.id === selectedId) ?? null;

  if (books.length === 0) {
    return <p className="text-sm text-gray-500">No books yet — add your first one above.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {books.map((book) => (
          <li key={book.id}>
            <button
              type="button"
              onClick={() => setSelectedId(book.id)}
              className="flex w-full items-center gap-3 rounded border px-4 py-3 text-left hover:bg-gray-50"
            >
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  width={40}
                  height={60}
                  unoptimized
                  className="rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="flex items-center gap-2 font-medium">
                  {book.title}
                  {book.loanedAt && <LoanedBadge />}
                </p>
                <p className="text-sm text-gray-500">
                  {[book.author, book.publishedDate, book.isbn].filter(Boolean).join(" · ") ||
                    "—"}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {selected && <BookDetailsPanel book={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}

function BookDetailsPanel({ book, onClose }: { book: Book; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col gap-6 overflow-y-auto border-l bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            {book.coverUrl && (
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={64}
                height={96}
                unoptimized
                className="rounded object-cover"
              />
            )}
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
            className="text-xl leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="border-t pt-6">
          {book.loanedAt ? (
            <LoanedSection book={book} />
          ) : (
            <LoanForm bookId={book.id} />
          )}
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

function LoanForm({ bookId }: { bookId: string }) {
  return (
    <form action={loanBook} className="flex flex-col gap-3">
      <h3 className="font-medium">Loan this book</h3>
      <input
        name="bookId"
        type="hidden"
        value={bookId}
      />
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
      <button type="submit" className="self-start rounded bg-black px-3 py-2 text-sm text-white">
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
      <p className="text-sm text-gray-500">
        Since {book.loanedAt!.toLocaleDateString()}
      </p>

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
