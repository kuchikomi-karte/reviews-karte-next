"use client";

import Link from "next/link";
import { UserShell } from "@/components/dashboard/UserShell";

const planItems = [
  {
    title: "AI口コミ返信",
    current: "月5件まで",
    premium: "件数上限なし / 文体プリセット付き",
  },
  {
    title: "経営相談",
    current: "送信のみ",
    premium: "優先回答 / 月次改善コメント付き",
  },
  {
    title: "レポート支援",
    current: "ダッシュボード閲覧",
    premium: "週次・月次レポート整理を優先対応",
  },
];

export function PremiumClientPage() {
  return (
    <UserShell
      eyebrow="Premium"
      title="プレミアムプラン案内"
      description="口コミ運用の返信精度と相談対応を強化したい店舗向けの上位プラン案内です。現行導線上の情報整理ページとして復元しています。"
    >
      <section
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <article
          style={{
            padding: "28px",
            backgroundColor: "white",
            border: "1px solid #ddd8ce",
            borderRadius: "24px",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "#888888", letterSpacing: "0.15em" }}>
            CURRENT
          </p>
          <h2
            style={{
              margin: "16px 0 10px",
              fontFamily: "Noto Serif JP, serif",
              fontSize: "24px",
              color: "#0a0a0a",
            }}
          >
            フリープラン
          </h2>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.9, color: "#666666" }}>
            初回導入と基本導線の確認に使う標準プランです。まずは店舗情報を整え、口コミ返信と相談導線を使い始められます。
          </p>
        </article>

        <article
          style={{
            padding: "28px",
            backgroundColor: "#0a0a0a",
            border: "1px solid #0a0a0a",
            borderRadius: "24px",
            color: "#f5f0e8",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "#c9a84c", letterSpacing: "0.15em" }}>
            RECOMMENDED
          </p>
          <h2
            style={{
              margin: "16px 0 10px",
              fontFamily: "Noto Serif JP, serif",
              fontSize: "24px",
            }}
          >
            プレミアムプラン
          </h2>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.9, color: "#e8ded0" }}>
            返信案の量産、相談の優先対応、レポート整理をまとめて強化する運用向けプランです。
          </p>
        </article>
      </section>

      <section
        style={{
          marginTop: "24px",
          padding: "28px",
          backgroundColor: "white",
          border: "1px solid #ddd8ce",
          borderRadius: "24px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "Noto Serif JP, serif",
            fontSize: "24px",
            color: "#0a0a0a",
          }}
        >
          プラン比較
        </h2>
        <div style={{ marginTop: "20px", display: "grid", gap: "14px" }}>
          {planItems.map((item) => (
            <div
              key={item.title}
              style={{
                display: "grid",
                gap: "10px",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                padding: "18px 20px",
                backgroundColor: "#faf7f1",
                borderRadius: "18px",
              }}
            >
              <div style={{ fontWeight: 700, color: "#0a0a0a" }}>{item.title}</div>
              <div style={{ fontSize: "13px", color: "#666666", lineHeight: 1.7 }}>
                {item.current}
              </div>
              <div style={{ fontSize: "13px", color: "#0a0a0a", lineHeight: 1.7 }}>
                {item.premium}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "24px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/dashboard/consultation"
          style={{
            padding: "14px 24px",
            backgroundColor: "#c9a84c",
            color: "#0a0a0a",
            textDecoration: "none",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          相談内容を整理する
        </Link>
        <Link
          href="/dashboard/profile"
          style={{
            padding: "14px 24px",
            border: "1px solid #cccccc",
            color: "#0a0a0a",
            textDecoration: "none",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 700,
            backgroundColor: "white",
          }}
        >
          店舗情報を見直す
        </Link>
      </section>
    </UserShell>
  );
}

