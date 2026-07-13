import { JsonLd } from "@/components/json-ld";
import { createMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { faqsLanding } from "@/lib/site-data";
import HomePage from "./nova-domaca/page";

const description =
  "Profesionalna spletna stran, povpraševanja, SMS obvestila, Google ocene in kampanje za slovenske obrtnike — vse na enem mestu.";

export const metadata = createMetadata({
  title: "Spletne strani in več povpraševanj za obrtnike",
  description,
  path: "/",
  keywords: [
    "spletna stran za obrtnike",
    "izdelava spletnih strani za obrtnike",
    "marketing za obrtnike",
    "povpraševanja za obrtnike",
  ],
  languages: { "sl-SI": "/", en: "/en", "x-default": "/" },
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Spletna stran in sistem za obrtnike",
            description,
            path: "/",
          }),
          faqJsonLd(faqsLanding),
        ]}
      />
      <HomePage />
    </>
  );
}
