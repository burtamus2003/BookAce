import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPalette } from "@/lib/get-user-palette";
import { getPalette, CLASSIC_FALLBACK_COLORS } from "@/lib/palettes";
import { PalettePicker } from "./palette-picker";

export default async function ProfilePage() {
  const session = await auth();
  const palette = await getUserPalette(session?.user?.id);

  const isCustom = palette.customColors !== null;
  const currentColors =
    palette.customColors ?? getPalette(palette.presetKey).colors ?? CLASSIC_FALLBACK_COLORS;

  return (
    // Always the neutral default theme, regardless of what the user has saved — this page is
    // the escape hatch back to a readable UI, so it can't be hidden by a bad color choice.
    <AppShell session={session} paletteColors={null}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Profile</h1>
        <p className="mb-8 text-sm text-gray-500">
          Pick a color palette for your library, or customize your own. This only changes how
          BookAce looks for you.
        </p>

        <PalettePicker
          key={`${palette.presetKey}-${isCustom ? Object.values(currentColors).join(",") : "preset"}`}
          currentKey={isCustom ? null : palette.presetKey}
          currentColors={currentColors}
        />
      </main>
    </AppShell>
  );
}
