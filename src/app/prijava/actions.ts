"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";

export async function loginAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await signIn(email, password);

  if (!result.ok) {
    return { message: result.message };
  }

  if (result.role === "super_admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut();
  redirect("/prijava");
}
