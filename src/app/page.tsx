import Image from "next/image";
import Link from "next/link";
import { BookshelfBackground } from "./bookshelf-background";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-center">
      <BookshelfBackground />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/logo-transparent.png"
          alt="BookAce"
          width={340}
          height={340}
          priority
        />
        <p className="max-w-md text-lg text-[#e8dfc0]/90">
          Catalog every book you own, and let Sage recommend what to read next.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded bg-[#c9a227] px-5 py-2 font-medium text-black transition-colors hover:bg-[#b8860b]"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded border border-[#e8dfc0]/60 px-5 py-2 text-[#e8dfc0] transition-colors hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
