import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body ?? {};

  if (typeof email !== "string" || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Email and a password of at least 8 characters are required." },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [created] = await db
    .insert(users)
    .values({
      name: typeof name === "string" ? name : null,
      email: normalizedEmail,
      passwordHash,
    })
    .returning({ id: users.id, email: users.email });

  return NextResponse.json({ id: created.id, email: created.email }, { status: 201 });
}
