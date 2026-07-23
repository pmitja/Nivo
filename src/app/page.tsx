import { HomePage } from "@/components/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Websites and lead management for contractors",
  description: "A professional website and customer system with instant inquiry alerts, Google reviews, campaigns and ongoing support.",
  path: "/",
  locale: "en_US",
  languages: { en: "/", "sl-SI": "/sl", "x-default": "/" },
  keywords: ["contractor website", "lead management for contractors", "home service marketing"],
});

export default function Page() {
  return <HomePage locale="en" />;
}
