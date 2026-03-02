import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You, Nandini",
  description: "A heartfelt message for Nandini.",
  openGraph: {
    title: "For You, Nandini",
    description: "A heartfelt message for Nandini.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
