import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";

const inter = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "macro",
  description: "data for your future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
