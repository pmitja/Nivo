import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, reviewRequests } from "@/db/schema";
import { PublicReviewForm } from "./review-form";

export default async function PublicReviewPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  const [request] = await db
    .select({
      id: reviewRequests.id,
      companyName: companies.name,
    })
    .from(reviewRequests)
    .innerJoin(companies, eq(companies.id, reviewRequests.companyId))
    .where(eq(reviewRequests.id, requestId))
    .limit(1);

  if (!request) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F6FB] px-5 py-10 text-[#16151D]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[900px] items-center justify-center">
        <section className="w-full rounded-[28px] border border-[#E7E4EF] bg-white p-6 shadow-[0_28px_70px_rgba(20,19,29,.10)] md:p-10">
          <div className="mx-auto max-w-[620px] text-center">
            <div className="text-[34px] font-extrabold leading-tight tracking-[-.03em] md:text-[48px]">{request.companyName}</div>
            <p className="mt-3 text-[17px] font-semibold leading-7 text-[#686473]">
              Your feedback helps us improve our service.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-[620px] rounded-[22px] border border-[#E8E5EF] bg-[#FBFAFF] p-5 md:p-6">
            <PublicReviewForm requestId={request.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
