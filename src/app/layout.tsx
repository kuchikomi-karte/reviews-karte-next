import type { Metadata } from "next";
import {
  Noto_Sans_JP,
  Noto_Serif_JP,
  Shippori_Mincho,
} from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      className={`${notoSansJp.variable} ${notoSerifJp.variable} ${shipporiMincho.variable}`}
      lang="ja"
    >
      <body>{children}</body>
    </html>
  );
}
