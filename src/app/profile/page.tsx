import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPaletteKey } from "@/lib/get-user-palette";
import { PalettePicker } from "./palette-picker";

export default async function ProfilePage() {
  const session = await auth();
  const paletteKey = await getUserPaletteKey(session?.user?.id);

  return (
    <AppShell session={session} paletteKey={paletteKey}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Profile</h1>
        <p className="mb-8 text-sm text-gray-500">
          Pick a color palette for your library. This only changes how BookAce looks for you.
        </p>

        <PalettePicker currentKey={paletteKey} />
      </main>
    </AppShell>
  );
}
