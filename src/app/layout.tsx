import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "口コミ経営カルテ 管理者サイト",
  description: "口コミ経営カルテの管理者サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#f6f1ea] text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
