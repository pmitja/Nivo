import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
