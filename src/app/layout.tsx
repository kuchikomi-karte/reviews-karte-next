import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "口コミ経営カルテ",
    template: "%s | 口コミ経営カルテ",
  },
  description:
    "口コミ経営カルテのLP、ユーザーサイト、管理者サイトを分離した再構築版。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
