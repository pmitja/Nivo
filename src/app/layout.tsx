import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://nivo.si"),
  title: "Nivo",
  description:
    "Sistem za obrtnike in lokalna podjetja: spletna stran, SMS obvestila, Google ocene in kampanje.",
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
