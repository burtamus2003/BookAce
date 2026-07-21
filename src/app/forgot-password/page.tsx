import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Reset your password</h1>

      {sent ? (
        <p className="text-sm">
          If that email has a BookAce account, we&apos;ve sent a link to reset the password.
          It expires in 1 hour.
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="rounded border px-3 py-2"
          />
          <button type="submit" className="rounded bg-accent px-3 py-2 text-accent-foreground">
            Send reset link
          </button>
        </form>
      )}

      <p className="text-sm">
        <Link href="/login" className="underline">
          Back to log in
        </Link>
      </p>
    </main>
  );
}
