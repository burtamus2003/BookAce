"use server";

import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";

export async function resetPasswordWithToken(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!token || newPassword.length < 8) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&error=1`);
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const [resetRow] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(eq(passwordResetTokens.tokenHash, tokenHash), gt(passwordResetTokens.expiresAt, new Date())),
    )
    .limit(1);

  if (!resetRow) {
    redirect("/forgot-password?expired=1");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.update(users).set({ passwordHash }).where(eq(users.id, resetRow.userId));
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, resetRow.userId));

  redirect("/login?reset=1");
}
