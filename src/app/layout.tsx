import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 — Interactive Bracket with AI Predictions | Trackr",
  description: "Make your FIFA World Cup 2026 predictions! Interactive tournament bracket for all 48 teams across 12 groups with AI-powered score predictions. Download as PNG and share with friends.",
  keywords: ["FIFA", "World Cup 2026", "tournament bracket", "football predictions", "soccer", "AI predictions", "bracket challenge"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "FIFA World Cup 2026 — Predict the Champion! 🏆",
    description: "Interactive bracket with AI predictions for all 48 teams. Make your picks, download as PNG, and challenge your friends!",
    type: "website",
    siteName: "Trackr - AI Expense Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFA World Cup 2026 — Predict the Champion! 🏆",
    description: "Interactive bracket with AI predictions for all 48 teams. Make your picks and share!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
