import Image from "next/image";
import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPalette, resolvePaletteColors } from "@/lib/get-user-palette";
import { getBookOfTheDay } from "@/lib/book-of-the-day";

export default async function DiscoverPage() {
  const session = await auth();
  const [palette, book] = await Promise.all([
    getUserPalette(session?.user?.id),
    getBookOfTheDay(),
  ]);

  return (
    <AppShell session={session} paletteColors={resolvePaletteColors(palette)}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Discover</h1>
        <p className="mb-8 text-sm text-gray-500">
          A trending pick, refreshed daily — not from anyone&apos;s library on BookAce.
        </p>

        {book ? (
          <div className="flex gap-6 rounded border p-6">
            {book.coverUrl && (
              <Image
                src={book.coverUrl}
                alt={book.title}
                priority
                width={140}
                height={210}
                unoptimized
                className="h-[210px] w-[140px] flex-shrink-0 rounded object-cover"
              />
            )}
            <div className="flex flex-col gap-3">
              <span className="w-fit rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
                Trending today
              </span>
              <div>
                <h2 className="text-lg font-medium">{book.title}</h2>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-fit rounded bg-accent px-4 py-2 text-sm text-accent-foreground"
              >
                Buy on Amazon
              </a>
              <p className="text-xs text-gray-500">
                As an Amazon Associate, BookAce earns from qualifying purchases — proceeds go
                toward hosting and building the site.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Couldn&apos;t load today&apos;s pick — check back in a bit.
          </p>
        )}
      </main>
    </AppShell>
  );
}
