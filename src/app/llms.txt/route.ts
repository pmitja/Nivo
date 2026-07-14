import { llmsText } from "@/lib/ai-discovery";

export const revalidate = 86400;

export function GET() {
  return new Response(llmsText(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
