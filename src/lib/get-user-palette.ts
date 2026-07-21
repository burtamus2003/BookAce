import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function getUserPaletteKey(userId: string | undefined): Promise<string> {
  if (!userId) return "classic";

  const [row] = await db
    .select({ colorPalette: users.colorPalette })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return row?.colorPalette ?? "classic";
}
