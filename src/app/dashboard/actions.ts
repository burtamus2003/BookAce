"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { sendLoanReminderEmail } from "@/lib/email";
import { detectImageType } from "@/lib/image-type";
import { saveCoverFile, MAX_COVER_BYTES } from "@/lib/cover-storage";
import { CONDITIONS, FORMATS, READING_STATUSES } from "./book-constants";

export async function addBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const isbn = String(formData.get("isbn") ?? "").trim();
  const publishedDate = String(formData.get("publishedDate") ?? "").trim();
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();
  const edition = String(formData.get("edition") ?? "").trim();
  const signed = formData.get("signed") === "on";
  const rating = Number(formData.get("rating") ?? 0);

  if (!isbn) throw new Error("ISBN is required");
  if (!title) throw new Error("Title is required");

  await db.insert(books).values({
    userId: session.user.id,
    title,
    author: author || null,
    isbn,
    publishedDate: publishedDate || null,
    coverUrl: coverUrl || null,
    notes: notes || null,
    condition: CONDITIONS.includes(condition as (typeof CONDITIONS)[number]) ? condition : null,
    format: FORMATS.includes(format as (typeof FORMATS)[number]) ? format : null,
    edition: edition || null,
    signed,
    rating: rating >= 1 && rating <= 5 ? rating : null,
  });

  revalidatePath("/dashboard");
}

export async function updateBookDetails(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  const notes = String(formData.get("notes") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();
  const edition = String(formData.get("edition") ?? "").trim();
  const signed = formData.get("signed") === "on";
  const readingStatus = String(formData.get("readingStatus") ?? "unread").trim();
  const rating = Number(formData.get("rating") ?? 0);

  await db
    .update(books)
    .set({
      notes: notes || null,
      condition: CONDITIONS.includes(condition as (typeof CONDITIONS)[number]) ? condition : null,
      format: FORMATS.includes(format as (typeof FORMATS)[number]) ? format : null,
      edition: edition || null,
      signed,
      readingStatus: READING_STATUSES.includes(readingStatus as (typeof READING_STATUSES)[number])
        ? readingStatus
        : "unread",
      rating: rating >= 1 && rating <= 5 ? rating : null,
    })
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function uploadBookCover(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");
  if (file.size === 0) throw new Error("No file provided");
  if (file.size > MAX_COVER_BYTES) throw new Error("Image must be 5MB or smaller");

  const bytes = Buffer.from(await file.arrayBuffer());
  const detected = detectImageType(bytes);
  if (!detected) throw new Error("File must be a JPEG, PNG, or WebP image");

  const [book] = await db
    .select({ id: books.id })
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));
  if (!book) throw new Error("Book not found");

  const filename = await saveCoverFile(bytes, detected.ext);

  await db
    .update(books)
    .set({ coverUrl: `/api/uploads/${filename}` })
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function deleteBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await db
    .delete(books)
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function loanBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const bookId = String(formData.get("bookId") ?? "");
  const borrowerName = String(formData.get("borrowerName") ?? "").trim();
  const borrowerEmail = String(formData.get("borrowerEmail") ?? "").trim();

  if (!bookId) return;
  if (!borrowerName) throw new Error("A borrower name is required");

  await db
    .update(books)
    .set({
      loanedToName: borrowerName,
      loanedToEmail: borrowerEmail || null,
      loanedAt: new Date(),
    })
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function returnBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await db
    .update(books)
    .set({ loanedToName: null, loanedToEmail: null, loanedAt: null })
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function sendLoanReminder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  const [book] = await db
    .select()
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.userId, session.user.id)));

  if (!book || !book.loanedToEmail) {
    throw new Error("This book has no borrower email on file");
  }

  await sendLoanReminderEmail(
    book.loanedToEmail,
    book.title,
    book.loanedToName,
    session.user.name ?? null,
  );
}
