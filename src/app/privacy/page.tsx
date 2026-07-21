import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPaletteKey } from "@/lib/get-user-palette";

export default async function PrivacyPage() {
  const session = await auth();
  const paletteKey = await getUserPaletteKey(session?.user?.id);

  return (
    <AppShell session={session} paletteKey={paletteKey}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Privacy</h1>
        <p className="mb-8 text-sm text-gray-500">
          Plain language, not legal boilerplate. If you have questions this page doesn&apos;t
          answer, reach out at{" "}
          <a href="mailto:bookace@inthometech.com" className="underline">
            bookace@inthometech.com
          </a>
          .
        </p>

        <div className="flex flex-col gap-6 text-sm">
          <section>
            <h2 className="font-medium">What we collect</h2>
            <p className="mt-1 text-gray-500">
              Your name and email when you register, and whatever you add to your library —
              titles, authors, ISBNs, cover art, your notes, condition, rating, and reading
              status. If you loan a book out, we also store the borrower&apos;s name and, if you
              provide it, their email.
            </p>
          </section>

          <section>
            <h2 className="font-medium">About that borrower data</h2>
            <p className="mt-1 text-gray-500">
              If you loan a book to someone, you&apos;re the one entering their name and email —
              they haven&apos;t signed up for anything and haven&apos;t agreed to this policy.
              That information is used only to send the reminder email you asked us to send, and
              nothing else.
            </p>
          </section>

          <section>
            <h2 className="font-medium">Who else sees it</h2>
            <p className="mt-1 text-gray-500">
              <a
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Resend
              </a>{" "}
              delivers our emails (password resets, loan reminders) on our behalf. When you look
              up a book by ISBN, we send that ISBN to Open Library and, if needed, Google Books —
              they don&apos;t receive your name, email, or anything else about you. We don&apos;t
              sell or share your data with anyone else, and we don&apos;t run analytics or
              tracking on this site.
            </p>
          </section>

          <section>
            <h2 className="font-medium">Is my library private?</h2>
            <p className="mt-1 text-gray-500">
              Yes. Only you can see your books and their details.
            </p>
          </section>

          <section>
            <h2 className="font-medium">Deleting your data</h2>
            <p className="mt-1 text-gray-500">
              Email us at{" "}
              <a href="mailto:bookace@inthometech.com" className="underline">
                bookace@inthometech.com
              </a>{" "}
              and we&apos;ll delete your account and everything in it.
            </p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
