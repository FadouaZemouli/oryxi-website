import type { Metadata } from "next";
import "./globals.css";
import { siteName, siteOrigin } from "@/lib/seo/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: siteName,
  description: "Professional maintenance and technical services.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
