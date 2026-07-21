import "server-only";

export interface BookOfTheDay {
  title: string;
  author: string;
  coverUrl: string | null;
  amazonUrl: string;
}

interface TrendingWork {
  title?: string;
  author_name?: string[];
  cover_i?: number;
}

interface TrendingResponse {
  works?: TrendingWork[];
}

const AMAZON_ASSOCIATE_TAG = "bookace-20";

function amazonSearchUrl(title: string, author: string): string {
  const query = encodeURIComponent(`${title} ${author}`.trim());
  return `https://www.amazon.com/s?k=${query}&i=stripbooks&tag=${AMAZON_ASSOCIATE_TAG}`;
}

export async function getBookOfTheDay(): Promise<BookOfTheDay | null> {
  try {
    const res = await fetch("https://openlibrary.org/trending/daily.json", {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data: TrendingResponse = await res.json();
    const works = (data.works ?? []).filter((w) => w.title && w.author_name?.length);
    if (works.length === 0) return null;

    // Same pick for everyone, all day — changes once daily.
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const work = works[dayIndex % works.length];

    const title = work.title!;
    const author = work.author_name!.join(", ");

    return {
      title,
      author,
      coverUrl: work.cover_i ? `https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg` : null,
      amazonUrl: amazonSearchUrl(title, author),
    };
  } catch {
    return null;
  }
}
