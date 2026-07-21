import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getPalette, type PaletteColors } from "./palettes";

export interface ResolvedPalette {
  presetKey: string;
  customColors: PaletteColors | null;
}

const DEFAULT: ResolvedPalette = { presetKey: "classic", customColors: null };

export async function getUserPalette(userId: string | undefined): Promise<ResolvedPalette> {
  if (!userId) return DEFAULT;

  const [row] = await db
    .select({
      colorPalette: users.colorPalette,
      customBackground: users.customBackground,
      customForeground: users.customForeground,
      customAccent: users.customAccent,
      customAccentForeground: users.customAccentForeground,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) return DEFAULT;

  const customColors =
    row.customBackground && row.customForeground && row.customAccent && row.customAccentForeground
      ? {
          background: row.customBackground,
          foreground: row.customForeground,
          accent: row.customAccent,
          accentForeground: row.customAccentForeground,
        }
      : null;

  return { presetKey: row.colorPalette, customColors };
}

export function resolvePaletteColors(resolved: ResolvedPalette): PaletteColors | null {
  return resolved.customColors ?? getPalette(resolved.presetKey).colors;
}
