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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6L12 2.5Z"
        fill="url(#shield-gradient)"
        stroke="none"
      />
      <path
        d="m9 12 2 2 4-4.5"
        stroke="#0f172a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="shield-gradient" x1="4" y1="2.5" x2="20" y2="21.5">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur px-6 py-3.5 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <ShieldIcon />
            AI 금융보안 비서
          </Link>
          <nav className="flex gap-5 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-100 transition-colors">
              분석
            </Link>
            <Link href="/demo" className="hover:text-slate-100 transition-colors">
              레드팀 vs 블루팀 데모
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800/80 px-6 py-6 text-center text-xs text-slate-600">
          2026 금융 AI Challenge 제출작 · 전 구간 무료 티어로 배포됨
        </footer>
      </body>
    </html>
  );
}
