import { compare, hash } from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";

const sessionCookie = "obrtio_session";
const sessionDays = 14;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export type AuthUser = Pick<User, "id" | "companyId" | "name" | "email" | "role">;

export async function maybeBootstrapAdmin() {
  const email = process.env.OBRTIO_BOOTSTRAP_EMAIL ?? process.env.NIVO_BOOTSTRAP_EMAIL;
  const password = process.env.OBRTIO_BOOTSTRAP_PASSWORD ?? process.env.NIVO_BOOTSTRAP_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existing = await db.select({ id: users.id }).from(users).limit(1);
  if (existing.length > 0) {
    return;
  }

  await db.insert(users).values({
    name: process.env.OBRTIO_BOOTSTRAP_NAME ?? process.env.NIVO_BOOTSTRAP_NAME ?? "Obrtio Admin",
    email,
    passwordHash: await hash(password, 12),
    role: "super_admin",
  });
}

export async function signIn(email: string, password: string) {
  await maybeBootstrapAdmin();

  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
  if (!user) {
    return { ok: false, message: "The email or password is incorrect." };
  }

  const validPassword = await compare(password, user.passwordHash);
  if (!validPassword) {
    return { ok: false, message: "The email or password is incorrect." };
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { ok: true, role: user.role };
}

export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }

  cookieStore.delete(sessionCookie);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (!token) {
    return null;
  }

  const [session] = await db
    .select({
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      id: users.id,
      companyId: users.companyId,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    return null;
  }

  return {
    id: session.id,
    companyId: session.companyId,
    name: session.name,
    email: session.email,
    role: session.role,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/prijava");
  }
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "super_admin") {
    redirect("/dashboard");
  }
  return user;
}

export async function requireClientUser() {
  const user = await requireUser();
  if (user.role === "super_admin") {
    redirect("/admin");
  }
  if (!user.companyId) {
    redirect("/prijava");
  }
  return user;
}
