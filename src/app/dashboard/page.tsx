import Image from "next/image";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { deleteBook } from "./actions";
import { AddBookForm } from "./add-book-form";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const myBooks = await db
    .select()
    .from(books)
    .where(eq(books.userId, userId))
    .orderBy(desc(books.createdAt));

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {session?.user?.name ? `${session.user.name}'s` : "Your"} Library
        </h1>
        <SignOutButton />
      </div>

      <AddBookForm />

      {myBooks.length === 0 ? (
        <p className="text-sm text-gray-500">No books yet — add your first one above.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {myBooks.map((book) => (
            <li
              key={book.id}
              className="flex items-center justify-between rounded border px-4 py-3"
            >
              <div className="flex items-center gap-3">
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
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-500">
                    {[book.author, book.publishedDate, book.isbn].filter(Boolean).join(" · ") ||
                      "—"}
                  </p>
                </div>
              </div>
              <form action={deleteBook}>
                <input type="hidden" name="bookId" value={book.id} />
                <button type="submit" className="text-sm text-red-600 underline">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
