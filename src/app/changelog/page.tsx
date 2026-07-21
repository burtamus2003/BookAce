import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPaletteKey } from "@/lib/get-user-palette";

const ENTRIES = [
  {
    date: "2026-07-20",
    items: ["Improved ISBN lookup with a second data source for better coverage of hard-to-find editions"],
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
  const paletteKey = await getUserPaletteKey(session?.user?.id);

  return (
    <AppShell session={session} paletteKey={paletteKey}>
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
