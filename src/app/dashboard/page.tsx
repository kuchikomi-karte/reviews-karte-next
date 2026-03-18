"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/rebuild/user-shell";
import { USER_LOGIN_PATH, USER_PREMIUM_PATH, hasUserAuthConfig } from "@/lib/auth/user";

type Profile = {
  name?: string;
  salon_name?: string;
  business_type?: string;
  google_review_url?: string;
  other_review_url_1?: string;
  subscription_status?: string;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasSupabaseConfig = hasUserAuthConfig();

  useEffect(() => {
    const loadProfile = async () => {
      if (!hasSupabaseConfig) {
        setLoading(false);
        return;
      }
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(USER_LOGIN_PATH);
        return;
      }
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    void loadProfile();
  }, [hasSupabaseConfig, router]);

  const handleLogout = async () => {
    if (hasSupabaseConfig) {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
    }
    router.push(USER_LOGIN_PATH);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" }}>
        <p style={{ fontSize: "13px", color: "#888888", letterSpacing: "0.1em", fontFamily: "Noto Sans JP, sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  const isPremium = profile?.subscription_status === "premium";
  const displayName = profile?.name || "ゲスト";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f0e8", fontFamily: "Noto Sans JP, sans-serif" }}>
      <DashboardHeader onLogout={handleLogout} />

      <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {/* 左：聖羅の言葉 */}
        <div style={{ width: "45%", backgroundColor: "#0a0a0a", padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <img
            src="/images/seira.png"
            alt=""
            style={{ position: "absolute", right: 0, bottom: 0, height: "85%", objectFit: "contain", objectPosition: "bottom right", opacity: 0.85 }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "260px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#888888", marginBottom: "32px", fontFamily: "Noto Sans JP, sans-serif" }}>ai x me lab</p>
            <p style={{ fontSize: "15px", lineHeight: 2.2, color: "#f5f0e8", fontFamily: "Noto Serif JP, serif", fontWeight: 400, letterSpacing: "0.08em", margin: "0 0 8px" }}>「口コミは、お客様からの経営レポート。」</p>
            <p style={{ fontSize: "15px", lineHeight: 2.2, color: "#f5f0e8", fontFamily: "Noto Serif JP, serif", fontWeight: 400, letterSpacing: "0.08em", margin: "0 0 8px" }}>「データを読まない経営者は、感で戦っている。」</p>
            <p style={{ fontSize: "15px", lineHeight: 2.2, color: "#f5f0e8", fontFamily: "Noto Serif JP, serif", fontWeight: 400, letterSpacing: "0.08em", margin: "0 0 32px" }}>「返信の質が、次の客を決める。」</p>
            <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#c9a84c", fontFamily: "Noto Sans JP, sans-serif" }}>―― 黒川聖羅</p>
          </div>
        </div>

        {/* 右：ダッシュボード */}
        <div style={{ flex: 1, padding: "48px 40px" }}>
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#888888", margin: "0 0 8px" }}>DASHBOARD</p>
            <h1 style={{ fontFamily: "Noto Serif JP, serif", fontSize: "24px", fontWeight: 700, color: "#0a0a0a", margin: "0 0 8px", letterSpacing: "0.1em" }}>{displayName} さんのカルテ</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: isPremium ? "#c9a84c" : "#888888", border: `1px solid ${isPremium ? "#c9a84c" : "#cccccc"}`, padding: "3px 10px" }}>
                {isPremium ? "プレミアムプラン" : "フリープラン"}
              </span>
              {!isPremium && (
                <Link href={USER_PREMIUM_PATH} style={{ fontSize: "11px", color: "#c9a84c", textDecoration: "none", letterSpacing: "0.05em" }}>
                  プレミアムプランを見る →
                </Link>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { href: "/dashboard/reviews", title: "AI口コミ返信案", desc: "口コミ本文から返信案の下書きを生成します。", tag: isPremium ? "プレミアム利用中" : "フリープランで利用可能" },
              { href: "/dashboard/karte", title: "週次レポート", desc: "今週の口コミ傾向と改善ポイントを確認します。", tag: isPremium ? "利用可能" : "プレミアム限定" },
              { href: "/dashboard/consultation", title: "月次レポート", desc: "月間の口コミデータを分析したレポートです。", tag: isPremium ? "利用可能" : "プレミアム限定" },
              { href: "/dashboard/consultation", title: "経営相談", desc: "担当上長への相談内容を送信し確認します。", tag: "相談状況を確認" },
            ].map((item) => (
              <Link
                key={item.href + item.title}
                href={item.href}
                style={{ display: "block", padding: "28px 24px", backgroundColor: "white", border: "1px solid #ddd8ce", textDecoration: "none", color: "inherit" }}
              >
                <h3 style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: 700, letterSpacing: "0.08em", color: "#0a0a0a", fontFamily: "Noto Serif JP, serif" }}>{item.title}</h3>
                <p style={{ margin: "0 0 16px", fontSize: "12px", lineHeight: 1.9, color: "#666666" }}>{item.desc}</p>
                <p style={{ margin: 0, fontSize: "10px", letterSpacing: "0.12em", color: "#c9a84c" }}>{item.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
