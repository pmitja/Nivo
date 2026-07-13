import { allowedOrigin, corsHeaders, submitLead } from "@/app/api/leads/route";

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const origin = allowedOrigin(request);
  if (request.headers.get("origin") && !origin) {
    return Response.json({ message: "Domena ni dovoljena." }, { status: 403 });
  }

  const { companyId } = await params;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 10 * 1024 * 1024 + 256 * 1024) {
    return Response.json({ message: "Zahtevek je prevelik." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ message: "Neveljaven zahtevek." }, { status: 400 });
  }
  const attachment = formData.get("attachment");
  const formStartedAt = formData.get("formStartedAt");

  const body = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    location: formData.get("location") ?? undefined,
    service: formData.get("service") || "Splošno povpraševanje",
    message: formData.get("message") ?? "",
    privacyConsent: formData.get("privacyConsent") === "on",
    marketingConsent: formData.get("marketingConsent") === "on",
    website: formData.get("website") ?? "",
    formStartedAt:
      typeof formStartedAt === "string" && formStartedAt.trim().length > 0
        ? formStartedAt
        : undefined,
  };

  const response = await submitLead(body, companyId, attachment instanceof File ? attachment : null, request.headers);
  if (origin) {
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => response.headers.set(key, value));
  }
  return response;
}

export async function OPTIONS(request: Request) {
  const origin = allowedOrigin(request);
  if (!origin) return new Response(null, { status: 403 });

  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
