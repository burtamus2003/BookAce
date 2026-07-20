"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session;
}

export async function resetPassword(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!userId || newPassword.length < 8) {
    throw new Error("A user and a password of at least 8 characters are required");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

  revalidatePath("/admin");
}

export async function toggleAdminRole(formData: FormData) {
  const session = await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  if (userId === session.user.id) {
    throw new Error("You can't change your own role from here");
  }

  const [target] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId));
  if (!target) return;

  const nextRole = target.role === "admin" ? "user" : "admin";
  await db.update(users).set({ role: nextRole }).where(eq(users.id, userId));

  revalidatePath("/admin");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  if (userId === session.user.id) {
    throw new Error("You can't delete your own account from here");
  }

  await db.delete(users).where(eq(users.id, userId));

  revalidatePath("/admin");
}
