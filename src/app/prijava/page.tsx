"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, { message: "" });

  return (
    <main className="min-h-screen bg-[#F7F6FB] px-5 py-10 text-[#16151D]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1120px] items-center">
        <Card className="grid w-full overflow-hidden rounded-[28px] border-[#E7E4EF] shadow-[0_28px_70px_rgba(20,19,29,.10)] lg:grid-cols-[1fr_.86fr]">
          <section className="flex min-h-[520px] flex-col justify-between bg-[#16151D] p-8 text-white md:p-10">
            <div>
              <div className="text-xl font-extrabold">Obrtio</div>
              <div className="mt-16 max-w-[560px]">
                <p className="text-sm font-bold uppercase tracking-[.1em] text-[#AFA8FF]">Dashboard</p>
                <h1 className="mt-4 text-[40px] font-extrabold leading-[1.05] md:text-[56px]">
                  You do the work. We bring the customers.
                </h1>
                <p className="mt-5 max-w-[480px] text-[17px] leading-[1.65] text-[#D8D5E4]">
                  Inquiries, customers, SMS messages, reviews and website requests in one clear system.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-[#D8D5E4] sm:grid-cols-3">
              <span>SMS alerts</span>
              <span>Google reviews</span>
              <span>Website</span>
            </div>
          </section>

          <section className="p-7 md:p-10">
            <div className="mx-auto max-w-[390px] py-8">
              <h2 className="text-2xl font-extrabold">Log in</h2>
              <p className="mt-2 text-[15px] leading-6 text-[#686573]">Access for Obrtio clients and team members.</p>

              <form action={action} className="mt-8 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="h-12 text-[15px]"
                    placeholder="name@company.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="h-12 text-[15px]"
                    placeholder="Enter your password"
                  />
                </div>

                {state?.message ? (
                  <p className="rounded-[12px] border border-[#F4C7C7] bg-[#FFF5F5] px-4 py-3 text-sm font-semibold text-[#9B2C2C]">
                    {state.message}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={pending}
                  className="mt-2 h-12 text-[15px]"
                >
                  {pending ? "Logging in..." : "Open dashboard"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </section>
        </Card>
      </div>
    </main>
  );
}
