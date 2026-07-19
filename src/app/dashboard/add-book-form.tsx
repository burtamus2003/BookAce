"use client";

import { useState } from "react";
import { addBook } from "./actions";

export function AddBookForm() {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
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
    setLookupError(null);
  }

  return (
    <form action={addBook} onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 rounded border p-4">
      <h2 className="font-medium">Add a book</h2>

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

      <button type="submit" className="self-start rounded bg-black px-3 py-2 text-white">
        Add book
      </button>
    </form>
  );
}
