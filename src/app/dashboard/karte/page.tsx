"use client";

import Link from "next/link";
import { useState } from "react";
import { UserShell } from "@/components/dashboard/UserShell";

type ProfileSummary = {
  salonName?: string;
  googleAddress?: string;
  otherUrls?: string[];
};

function getStoredSummary(): ProfileSummary {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem("reviews-karte-profile-draft");
  return stored ? (JSON.parse(stored) as ProfileSummary) : {};
}

export default function KartePage() {
  const [summary] = useState<ProfileSummary>(() => getStoredSummary());

  const completionItems = [
    {
      label: "店舗情報",
      done: Boolean(summary.salonName),
      href: "/dashboard/profile",
    },
    {
      label: "Google店舗候補",
      done: Boolean(summary.googleAddress),
      href: "/dashboard/profile",
    },
    {
      label: "その他口コミサイト",
      done: Boolean(summary.otherUrls?.find(Boolean)),
      href: "/dashboard/profile",
    },
  ];

  return (
    <UserShell
      eyebrow="Karte"
      title="カルテ確認"
      description="登録済みの店舗情報と次のアクションを俯瞰するための確認ページです。既存 dashboard 導線の補助画面として再構成しています。"
    >
      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr" }}>
        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>登録状況</h2>
          <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
            {completionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 18px",
                  borderRadius: "18px",
                  textDecoration: "none",
                  backgroundColor: item.done ? "#faf7f1" : "#f3efe7",
                  color: "#0a0a0a",
                }}
              >
                <span>{item.label}</span>
                <strong style={{ color: item.done ? "#9a7b3f" : "#888888" }}>
                  {item.done ? "完了" : "未登録"}
                </strong>
              </Link>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>次に進むメニュー</h2>
          <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
            {[
              { href: "/dashboard/reviews", title: "AI口コミ返信", body: "返信案を作成する" },
              { href: "/dashboard/consultation", title: "経営相談", body: "相談内容を整理する" },
              { href: "/premium", title: "プレミアムプラン", body: "上位プランを確認する" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "18px",
                  borderRadius: "18px",
                  backgroundColor: "white",
                  border: "1px solid #e5dfd4",
                  textDecoration: "none",
                }}
              >
                <div style={{ fontWeight: 700, color: "#0a0a0a" }}>{item.title}</div>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#666666" }}>
                  {item.body}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </UserShell>
  );
}

const panelStyle = {
  padding: "28px",
  border: "1px solid #ddd8ce",
  borderRadius: "24px",
  backgroundColor: "white",
} as const;

const sectionTitleStyle = {
  margin: 0,
  fontFamily: "Noto Serif JP, serif",
  fontSize: "22px",
  color: "#0a0a0a",
} as const;
