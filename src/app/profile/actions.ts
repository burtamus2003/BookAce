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

  await db
    .update(users)
    .set({
      colorPalette: paletteKey,
      // Picking a preset resets any custom colors, so it always works as an escape hatch.
      customBackground: null,
      customForeground: null,
      customAccent: null,
      customAccentForeground: null,
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/", "layout");
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export async function updateCustomPalette(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const background = String(formData.get("background") ?? "");
  const foreground = String(formData.get("foreground") ?? "");
  const accent = String(formData.get("accent") ?? "");
  const accentForeground = String(formData.get("accentForeground") ?? "");

  for (const value of [background, foreground, accent, accentForeground]) {
    if (!HEX_COLOR.test(value)) {
      throw new Error("Colors must be valid hex values");
    }
  }

  await db
    .update(users)
    .set({
      customBackground: background,
      customForeground: foreground,
      customAccent: accent,
      customAccentForeground: accentForeground,
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/", "layout");
}
