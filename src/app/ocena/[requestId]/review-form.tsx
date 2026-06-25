"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Send, Star } from "lucide-react";
import { submitPublicReviewAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ratings = [5, 4, 3, 2, 1];

export function PublicReviewForm({ requestId }: { requestId: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [state, action, pending] = useActionState(submitPublicReviewAction, { ok: false, message: "" });
  const needsFeedback = rating !== null && rating <= 3;

  if (state.ok) {
    return (
      <div className="rounded-[18px] border border-[#D9F4E5] bg-[#F2FFF7] p-6 text-center">
        <div className="text-xl font-extrabold text-[#167E53]">Hvala za povratno informacijo.</div>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#41745B]">
          Vaše sporočilo smo posredovali podjetju, da lahko izboljša storitev.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="rating" value={rating ?? ""} />

      <div>
        <Label>Kako bi ocenili storitev?</Label>
        <div className="mt-3 grid gap-2">
          {ratings.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`flex min-h-12 cursor-pointer items-center justify-between rounded-[14px] border px-4 text-left transition ${
                rating === value
                  ? "border-[#6A5AE0] bg-[#F1EFF8] shadow-[0_0_0_4px_rgba(106,90,224,.10)]"
                  : "border-[#E2DFEA] bg-white hover:border-[#C9C4D8]"
              }`}
            >
              <span className="flex items-center gap-2">
                {Array.from({ length: value }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </span>
              <span className="text-sm font-extrabold text-[#55515F]">{value} zvezdic</span>
            </button>
          ))}
        </div>
      </div>

      {needsFeedback ? (
        <div className="rounded-[18px] border border-[#EEEAF5] bg-[#FBFAFF] p-4">
          <h2 className="text-lg font-extrabold">Žal nam je, da niste bili zadovoljni.</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#777382]">
            Prosimo napišite, kaj lahko podjetje izboljša.
          </p>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="review-name">Ime (neobvezno)</Label>
              <Input id="review-name" name="name" placeholder="Ime" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review-email">Email (neobvezno)</Label>
              <Input id="review-email" name="email" type="email" placeholder="email@primer.si" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review-feedback">Vaša povratna informacija</Label>
              <Textarea id="review-feedback" name="feedback" required minLength={5} className="min-h-28" placeholder="Kaj lahko izboljšamo?" />
            </div>
          </div>
        </div>
      ) : null}

      {state.message ? (
        <p className="rounded-[12px] bg-[#FFF5F5] px-4 py-3 text-sm font-bold text-[#9B2C2C]">{state.message}</p>
      ) : null}

      <Button type="submit" disabled={pending || rating === null} className="h-12 justify-self-stretch">
        {rating && rating >= 4 ? (
          <>
            Nadaljuj na Google
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            {pending ? "Pošiljam..." : "Pošlji povratno informacijo"}
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
