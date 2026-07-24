import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { getUserPalette, resolvePaletteColors } from "@/lib/get-user-palette";

const FAQS = [
  {
    question: "How do I add a book?",
    answer:
      'Type or scan in the ISBN and hit "Look up" — we\'ll fetch the title, author, cover, and publish date for you. You can still edit any of it, or add a book with no ISBN by filling in the fields yourself.',
  },
  {
    question: "Barcode scanning isn't focusing on the barcode — what's wrong?",
    answer:
      "Scanning works best with a phone's rear camera, which autofocuses at close range. A laptop or desktop webcam is usually fixed-focus for face distance and can struggle to focus close enough to read a barcode sharply — try holding it a bit farther back, or just type the ISBN in by hand.",
  },
  {
    question: "What if the ISBN lookup can't find my book?",
    answer:
      "We check multiple sources, but coverage still isn't perfect, especially for older or regional editions. You can always fill in the title and author manually.",
  },
  {
    question: "What if my book has no cover, or the wrong one?",
    answer:
      'Click "Change cover" in the book\'s details panel to upload your own — JPEG, PNG, WebP, or an iPhone HEIC photo (converted to JPEG automatically), up to 5MB. Only you can ever see it, same as the rest of your library.',
  },
  {
    question: "Can I track a book's condition, edition, or whether it's signed?",
    answer:
      "Yes — click into any book in your library to add a condition, format, edition/printing, signed-copy flag, reading status, and your own rating.",
  },
  {
    question: "Is my library private?",
    answer: "Yes. Only you can see your books and their details.",
  },
  {
    question: "How do I loan a book to someone?",
    answer:
      'Click the book, then use the "Loan this book" section to record who has it. If you add their email, you can send them a reminder later from the same panel.',
  },
  {
    question: "I forgot my password — what do I do?",
    answer:
      'Use the "Forgot password?" link on the login page. We\'ll email you a reset link that expires in an hour.',
  },
  {
    question: "I found a bug — how do I report it?",
    answer: (
      <>
        Open an issue on our{" "}
        <a
          href="https://github.com/burtamus2003/BookAce/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub Issues page
        </a>
        . Include what you were doing and what you expected to happen — that&apos;s the fastest
        way to get it fixed.
      </>
    ),
  },
];

export default async function FaqPage() {
  const session = await auth();
  const palette = await getUserPalette(session?.user?.id);

  return (
    <AppShell session={session} paletteColors={resolvePaletteColors(palette)}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-semibold">Frequently asked questions</h1>
        <div className="flex flex-col gap-6">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h2 className="font-medium">{faq.question}</h2>
              <p className="mt-1 text-sm text-gray-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
