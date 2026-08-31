import type { Metadata } from "next";
import "./globals.css";
import { siteName, siteOrigin } from "@/lib/seo/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: siteName,
  description:
    "Fire protection, engineering and electromechanical maintenance services in Qatar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
