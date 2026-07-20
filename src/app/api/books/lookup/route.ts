import { NextResponse } from "next/server";

interface BookResult {
  title: string;
  author: string;
  publishedDate: string;
  coverUrl: string;
}

interface OpenLibraryBook {
  title?: string;
  authors?: { name: string }[];
  publish_date?: string;
  cover?: { small?: string; medium?: string; large?: string };
}

async function lookupOpenLibrary(isbn: string): Promise<BookResult | null> {
  const res = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&jscmd=data&format=json`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) return null;

  const data = await res.json();
  const book: OpenLibraryBook | undefined = data[`ISBN:${isbn}`];
  if (!book) return null;

  return {
    title: book.title ?? "",
    author: book.authors?.map((a) => a.name).join(", ") ?? "",
    publishedDate: book.publish_date ?? "",
    coverUrl: book.cover?.medium ?? book.cover?.large ?? book.cover?.small ?? "",
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: {
    volumeInfo?: {
      title?: string;
      authors?: string[];
      publishedDate?: string;
      imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    };
  }[];
}

async function lookupGoogleBooks(isbn: string): Promise<BookResult | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", `isbn:${isbn}`);
  if (apiKey) url.searchParams.set("key", apiKey);

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;

  const data: GoogleBooksResponse = await res.json();
  const info = data.items?.[0]?.volumeInfo;
  if (!info) return null;

  const cover = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? "";

  return {
    title: info.title ?? "",
    author: info.authors?.join(", ") ?? "",
    publishedDate: info.publishedDate ?? "",
    coverUrl: cover.replace(/^http:/, "https:"),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawIsbn = searchParams.get("isbn") ?? "";
  const isbn = rawIsbn.replace(/[^0-9Xx]/g, "");

  if (!isbn) {
    return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
  }

  const book = (await lookupOpenLibrary(isbn).catch(() => null)) ?? (await lookupGoogleBooks(isbn).catch(() => null));

  if (!book) {
    return NextResponse.json({ error: "No book found for that ISBN" }, { status: 404 });
  }

  return NextResponse.json(book);
}
