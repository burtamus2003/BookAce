"use client";

import { deleteUser } from "./actions";

export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  return (
    <form
      action={deleteUser}
      onSubmit={(e) => {
        if (!confirm(`Permanently delete ${email} and all their books? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button type="submit" className="text-sm text-red-600 underline">
        Delete account
      </button>
    </form>
  );
}
