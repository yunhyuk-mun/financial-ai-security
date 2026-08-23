import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 금융보안 비서",
  description: "AI 레드팀 vs 블루팀 금융보안 비서",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-6">
          <span className="font-semibold text-lg">AI 금융보안 비서</span>
          <nav className="flex gap-4 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-100">
              분석
            </Link>
            <Link href="/demo" className="hover:text-slate-100">
              레드팀 vs 블루팀 데모
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
