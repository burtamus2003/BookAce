import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { readCoverFile } from "@/lib/cover-storage";
import { detectImageType } from "@/lib/image-type";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Not found", { status: 404 });
  }

  const { filename } = await params;

  // Only the owner can view their uploaded cover — matches "your library is private".
  const [book] = await db
    .select({ id: books.id })
    .from(books)
    .where(
      and(eq(books.coverUrl, `/api/uploads/${filename}`), eq(books.userId, session.user.id)),
    );

  if (!book) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const bytes = await readCoverFile(filename);
    const detected = detectImageType(bytes);

    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": detected?.contentType ?? "application/octet-stream",
        // no-store, not just "private": this is per-user access-controlled content, and a
        // long-lived cache would let a second person on the same browser/device see it
        // without ever going through the ownership check again.
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
