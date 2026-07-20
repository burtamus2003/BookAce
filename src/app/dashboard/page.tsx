import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { BookList } from "./book-list";
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
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {session?.user?.name ? `${session.user.name}'s` : "Your"} Library
        </h1>
        <div className="flex items-center gap-4">
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="text-sm underline">
              Admin
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      <BookList books={myBooks} />
    </main>
  );
}
