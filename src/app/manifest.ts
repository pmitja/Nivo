import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Obrtio — sistem za obrtnike",
    short_name: "Obrtio",
    description:
      "Spletna stran, povpraševanja, SMS obvestila in Google ocene za slovenske obrtnike.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6A5AE0",
    lang: "sl",
    icons: [
      {
        src: "/obrtio-favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
