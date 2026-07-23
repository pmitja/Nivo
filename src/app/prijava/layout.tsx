import { noIndexMetadata } from "@/lib/seo";

export const metadata = {
  ...noIndexMetadata,
  title: "Log in",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
