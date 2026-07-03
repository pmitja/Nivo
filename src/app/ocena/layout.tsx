import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
