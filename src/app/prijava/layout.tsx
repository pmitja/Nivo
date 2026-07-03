import { noIndexMetadata } from "@/lib/seo";

export const metadata = {
  ...noIndexMetadata,
  title: "Prijava",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
