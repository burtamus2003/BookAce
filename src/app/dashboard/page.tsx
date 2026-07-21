import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { AppShell } from "@/components/app-shell";
import { getUserPaletteKey } from "@/lib/get-user-palette";
import { BookList } from "./book-list";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [myBooks, paletteKey] = await Promise.all([
    db.select().from(books).where(eq(books.userId, userId)).orderBy(desc(books.createdAt)),
    getUserPaletteKey(userId),
  ]);

  return (
    <AppShell session={session} paletteKey={paletteKey}>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-semibold">
          {session?.user?.name ? `${session.user.name}'s` : "Your"} Library
        </h1>

        <BookList books={myBooks} />
      </main>
    </AppShell>
  );
}
