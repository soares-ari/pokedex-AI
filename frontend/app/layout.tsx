import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex Reverbs",
  description: "A full-stack Pokémon application with AI-powered battles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-50 to-red-50`}
      >
        <Providers>
          <nav className="bg-gradient-to-r from-red-600 to-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex space-x-8">
                  <Link
                    href="/"
                    className="inline-flex items-center px-1 pt-1 text-xl font-bold text-white hover:text-yellow-300 transition-colors"
                  >
                    ⚡ Pokédex Reverbs
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white/90 hover:text-yellow-300 transition-colors"
                  >
                    Pokémons
                  </Link>
                  <Link
                    href="/battle"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white/90 hover:text-yellow-300 transition-colors"
                  >
                    Battle Arena
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
