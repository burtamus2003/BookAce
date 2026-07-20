import Link from "next/link";
import { resetPasswordWithToken } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4 text-center">
        <p className="text-sm">This reset link is missing its token.</p>
        <Link href="/forgot-password" className="text-sm underline">
          Request a new reset link
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Set a new password</h1>

      <form action={resetPasswordWithToken} className="flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          placeholder="New password (min 8 characters)"
          className="rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">Password must be at least 8 characters.</p>}
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Set new password
        </button>
      </form>
    </main>
  );
}
