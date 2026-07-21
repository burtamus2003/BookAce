"use client";

import { useState } from "react";
import { addBook } from "./actions";
import { CONDITIONS, FORMATS } from "./book-constants";
import { StarRating } from "./star-rating";

export function AddBookForm({ onAdded }: { onAdded: () => void }) {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [condition, setCondition] = useState("");
  const [format, setFormat] = useState("");
  const [edition, setEdition] = useState("");
  const [signed, setSigned] = useState(false);
  const [rating, setRating] = useState(0);
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  async function handleLookup() {
    const trimmed = isbn.trim();
    if (!trimmed) return;

    setLooking(true);
    setLookupError(null);

    try {
      const res = await fetch(`/api/books/lookup?isbn=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setLookupError(data.error ?? "Lookup failed");
        return;
      }

      setTitle(data.title ?? "");
      setAuthor(data.author ?? "");
      setPublishedDate(data.publishedDate ?? "");
      setCoverUrl(data.coverUrl ?? "");
    } catch {
      setLookupError("Lookup failed — check your connection and try again.");
    } finally {
      setLooking(false);
    }
  }

  function handleSubmit() {
    setTitle("");
    setAuthor("");
    setIsbn("");
    setPublishedDate("");
    setCoverUrl("");
    setNotes("");
    setCondition("");
    setFormat("");
    setEdition("");
    setSigned(false);
    setRating(0);
    setLookupError(null);
    onAdded();
  }

  return (
    <form action={addBook} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          name="isbn"
          placeholder="ISBN"
          required
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="button"
          onClick={handleLookup}
          disabled={looking || !isbn.trim()}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          {looking ? "Looking up..." : "Look up"}
        </button>
      </div>
      {lookupError && <p className="text-sm text-red-600">{lookupError}</p>}

      <input
        name="title"
        placeholder="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <input
        name="author"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <input
        name="publishedDate"
        placeholder="Published date"
        value={publishedDate}
        onChange={(e) => setPublishedDate(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <input type="hidden" name="coverUrl" value={coverUrl} />

      <textarea
        name="notes"
        placeholder="Synopsis / notes"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="rounded border px-3 py-2"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          name="condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="rounded border px-3 py-2"
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
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="rounded border px-3 py-2"
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
        placeholder="Edition / printing (e.g. 1st Edition)"
        value={edition}
        onChange={(e) => setEdition(e.target.value)}
        className="rounded border px-3 py-2"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="signed"
            checked={signed}
            onChange={(e) => setSigned(e.target.checked)}
          />
          Signed copy
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Your rating</span>
          <StarRating value={rating} onChange={setRating} />
          <input type="hidden" name="rating" value={rating} />
        </div>
      </div>

      <button
        type="submit"
        className="self-start rounded bg-accent px-4 py-2 text-sm text-accent-foreground"
      >
        Add book
      </button>
    </form>
  );
}
