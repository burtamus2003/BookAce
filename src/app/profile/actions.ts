"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { PALETTES } from "@/lib/palettes";

export async function updateColorPalette(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const paletteKey = String(formData.get("paletteKey") ?? "");
  if (!PALETTES.some((p) => p.key === paletteKey)) {
    throw new Error("Unknown palette");
  }

  await db.update(users).set({ colorPalette: paletteKey }).where(eq(users.id, session.user.id));

  revalidatePath("/", "layout");
}
