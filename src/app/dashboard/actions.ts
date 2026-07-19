"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";

export async function addBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const isbn = String(formData.get("isbn") ?? "").trim();

  if (!title) throw new Error("Title is required");

  await db.insert(books).values({
    userId: session.user.id,
    title,
    author: author || null,
    isbn: isbn || null,
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
