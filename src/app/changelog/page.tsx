import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPalette, resolvePaletteColors } from "@/lib/get-user-palette";

const ENTRIES = [
  {
    date: "2026-07-20",
    items: [
      "Improved ISBN lookup with a second data source for better coverage of hard-to-find editions",
      "Added a top navigation bar, plus FAQ, Changelog, and Privacy pages",
      "Added per-user color palettes — pick one of several themes, or customize your own colors from your profile page",
      "Added Discover: a daily trending book pick, open to everyone whether you've signed up or not",
      "Added a \"Buy on Amazon\" link on Discover picks, with the required affiliate disclosure",
      "Added cover uploads — set your own picture for any book from its details panel",
      "Fixed sign-out sending you to the wrong address instead of back to the site",
      "Fixed the login, register, and password pages looking cramped, with links overlapping each other",
      "Fixed the profile page's color inputs not updating right away when you picked a different preset",
    ],
  },
  {
    date: "2026-07-19",
    items: [
      "Launched the BookAce beta: catalog your books by ISBN, with cover art and details filled in automatically",
      "Redesigned the library into a searchable grid, with condition, format, edition, signed-copy tracking, reading status, and your own ratings",
      "Added the ability to loan books to friends and send them a reminder email",
      "Added self-service password reset",
      "Added admin tools for managing accounts",
    ],
  },
];

export default async function ChangelogPage() {
  const session = await auth();
  const palette = await getUserPalette(session?.user?.id);

  return (
    <AppShell session={session} paletteColors={resolvePaletteColors(palette)}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Changelog</h1>
        <p className="mb-8 text-sm text-gray-500">
          BookAce is in beta — here&apos;s what&apos;s changed recently.
        </p>
        <div className="flex flex-col gap-8">
          {ENTRIES.map((entry) => (
            <div key={entry.date}>
              <h2 className="mb-2 text-sm font-medium text-gray-500">{entry.date}</h2>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
