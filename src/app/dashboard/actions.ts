"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { sendLoanReminderEmail } from "@/lib/email";

export async function addBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const isbn = String(formData.get("isbn") ?? "").trim();
  const publishedDate = String(formData.get("publishedDate") ?? "").trim();
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();

  if (!isbn) throw new Error("ISBN is required");
  if (!title) throw new Error("Title is required");

  await db.insert(books).values({
    userId: session.user.id,
    title,
    author: author || null,
    isbn,
    publishedDate: publishedDate || null,
    coverUrl: coverUrl || null,
  });

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
