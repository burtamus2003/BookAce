import { NextResponse } from "next/server";

interface OpenLibraryBook {
  title?: string;
  authors?: { name: string }[];
  publish_date?: string;
  cover?: { small?: string; medium?: string; large?: string };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawIsbn = searchParams.get("isbn") ?? "";
  const isbn = rawIsbn.replace(/[^0-9Xx]/g, "");

  if (!isbn) {
    return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&jscmd=data&format=json`,
    { headers: { Accept: "application/json" } },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Lookup service unavailable" }, { status: 502 });
  }

  const data = await res.json();
  const book: OpenLibraryBook | undefined = data[`ISBN:${isbn}`];

  if (!book) {
    return NextResponse.json({ error: "No book found for that ISBN" }, { status: 404 });
  }

  return NextResponse.json({
    title: book.title ?? "",
    author: book.authors?.map((a) => a.name).join(", ") ?? "",
    publishedDate: book.publish_date ?? "",
    coverUrl: book.cover?.medium ?? book.cover?.large ?? book.cover?.small ?? "",
  });
}
