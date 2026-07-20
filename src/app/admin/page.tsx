import type { Metadata } from "next";
import { sql, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, books } from "@/db/schema";
import { resetPassword } from "./actions";
import { DeleteUserButton } from "./delete-user-button";
import { ToggleAdminButton } from "./toggle-admin-button";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return null;
  }

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      bookCount: sql<number>`count(${books.id})::int`,
    })
    .from(users)
    .leftJoin(books, eq(books.userId, users.id))
    .groupBy(users.id)
    .orderBy(users.createdAt);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">Admin</h1>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Books</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Reset password</th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-4 py-2">{row.name ?? "—"}</td>
                <td className="px-4 py-2">{row.email}</td>
                <td className="px-4 py-2">{row.role}</td>
                <td className="px-4 py-2">{row.bookCount}</td>
                <td className="px-4 py-2">{row.createdAt.toISOString().slice(0, 10)}</td>
                <td className="px-4 py-2">
                  <form action={resetPassword} className="flex gap-2">
                    <input type="hidden" name="userId" value={row.id} />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New password"
                      minLength={8}
                      required
                      className="w-36 rounded border px-2 py-1"
                    />
                    <button type="submit" className="rounded border px-2 py-1 text-xs">
                      Set
                    </button>
                  </form>
                </td>
                <td className="px-4 py-2">
                  {row.id !== session.user.id && (
                    <ToggleAdminButton userId={row.id} role={row.role} />
                  )}
                </td>
                <td className="px-4 py-2">
                  <DeleteUserButton userId={row.id} email={row.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
