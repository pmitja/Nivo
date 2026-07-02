import { submitLead } from "@/app/api/leads/route";

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const formData = await request.formData();
  const attachment = formData.get("attachment");

  const body = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    location: formData.get("location"),
    service: formData.get("service") || "Splošno povpraševanje",
    message: formData.get("message"),
    privacyConsent: formData.get("privacyConsent") === "on",
    marketingConsent: formData.get("marketingConsent") === "on",
  };

  const response = await submitLead(body, companyId, attachment instanceof File ? attachment : null);
  response.headers.set("access-control-allow-origin", "*");
  return response;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
    },
  });
}
