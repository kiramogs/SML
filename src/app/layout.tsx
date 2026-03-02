import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You, Nandini",
  description: "A heartfelt message, written under the stars.",
  openGraph: {
    title: "For You, Nandini",
    description: "A heartfelt message, written under the stars.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
