import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "md単語帳",
  description: "md単語帳",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="flex flex-col min-h-screen">
          {/* ヘッダー */}
          <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl font-bold">md単語帳</h1>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-1 overflow-y-auto p-6 bg-white">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-gray-800 text-white p-4">
            <p className="text-center">
              &copy; {new Date().getFullYear()} md単語帳. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
