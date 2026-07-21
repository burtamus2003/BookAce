import Link from "next/link";
import type { Session } from "next-auth";
import { SignOutButton } from "./sign-out-button";

export function NavBar({ session }: { session: Session | null }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={session ? "/dashboard" : "/"} className="font-semibold">
          BookAce
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <Link href="/dashboard">Library</Link>
              <Link href="/discover">Discover</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/privacy">Privacy</Link>
              {session.user.role === "admin" && <Link href="/admin">Admin</Link>}
              <Link href="/profile">Profile</Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/discover">Discover</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/login">Log in</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
