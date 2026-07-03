import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Nivo — več povpraševanj za obrtnike",
    template: "%s | Nivo",
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#6A5AE0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sl"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#16151D]">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
