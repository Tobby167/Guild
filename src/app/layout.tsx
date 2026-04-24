import type { Metadata } from "next";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guild",
  description:
    "A premium home for fiber and textile creators to showcase work, earn trusted commissions, and build with more structure.",
  icons: {
    icon: "/guild-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
