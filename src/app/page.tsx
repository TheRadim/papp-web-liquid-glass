import type { Metadata } from "next";
import { LanguageRedirect } from "@/components/layout/LanguageRedirect";

export const metadata: Metadata = {
  alternates: { languages: { da: "/da", en: "/en" } }
};

export default function RootPage() {
  return <LanguageRedirect />;
}
