import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบรายงานไปราชการ",
  description: "ระบบรายงานการเดินทางไปราชการของหน่วยงาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${anuphan.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
