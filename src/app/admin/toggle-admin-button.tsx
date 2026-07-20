"use client";

import { toggleAdminRole } from "./actions";

export function ToggleAdminButton({ userId, role }: { userId: string; role: string }) {
  const isAdmin = role === "admin";

  return (
    <form action={toggleAdminRole}>
      <input type="hidden" name="userId" value={userId} />
      <button type="submit" className="rounded border px-2 py-1 text-xs">
        {isAdmin ? "Remove admin" : "Make admin"}
      </button>
    </form>
  );
}
