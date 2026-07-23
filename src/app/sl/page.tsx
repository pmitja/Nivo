import { HomePage } from "@/components/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Spletne strani in več povpraševanj za obrtnike",
  description: "Profesionalna spletna stran, povpraševanja, SMS obvestila, Google ocene in kampanje za slovenske obrtnike.",
  path: "/sl",
  languages: { en: "/", "sl-SI": "/sl", "x-default": "/" },
});

export default function SlovenianHomePage() {
  return <HomePage />;
}
