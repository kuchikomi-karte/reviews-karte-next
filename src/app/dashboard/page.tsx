"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserShell } from "@/rebuild/user-shell";
import { USER_LOGIN_PATH, USER_PREMIUM_PATH, hasUserAuthConfig } from "@/lib/auth/user";

type Profile = {
  name?: string;
  salon_name?: string;
  business_type?: string;
  google_review_url?: string;
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

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    void loadProfile();
  }, [hasSupabaseConfig, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f0e8" }}>
        <p style={{ fontSize: "13px", color: "#888888", letterSpacing: "0.1em", fontFamily: "Noto Sans JP, sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  const isPremium = profile?.subscription_status === "premium";
  const hasSalonInfo = Boolean(profile?.salon_name && profile?.google_review_url);

  return (
    <UserShell
      eyebrow="ai x me lab"
      title="口コミ経営カルテ"
      description="口コミの状況を客観的に見て、次に集中すべきポイントを明確にします。"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {[
          {
            href: "/dashboard/reviews",
            title: "AI口コミ返信",
            description: "口コミ本文から返信案の下書きを生成します。",
            status: isPremium ? "プレミアム利用中" : "フリープランで利用可能",
          },
          {
            href: "/dashboard/consultation",
            title: "経営相談",
            description: "担当上長への相談内容を送信し処理メモを確認します。",
            status: "相談状況を確認",
          },
          {
            href: "/dashboard/profile",
            title: "店舗情報",
            description: "Google店舗情報と口コミサイトURLを管理します。",
            status: hasSalonInfo ? "登録済み" : "登録を開始",
          },
          {
            href: USER_PREMIUM_PATH,
            title: "プレミアムプラン",
            description: "上位プランの機能詳細と料金を確認します。",
            status: isPremium ? "加入中" : "アップグレード可能",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: "24px",
              backgroundColor: "white",
              border: "1px solid #ddd8ce",
              borderRadius: "16px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 700, letterSpacing: "0.08em", color: "#0a0a0a" }}>{item.title}</h3>
            <p style={{ margin: "0 0 12px", fontSize: "13px", lineHeight: 1.8, color: "#666666" }}>{item.description}</p>
            <p style={{ margin: 0, fontSize: "11px", letterSpacing: "0.1em", color: "#c9a84c" }}>{item.status}</p>
          </Link>
        ))}
      </div>
    </UserShell>
  );
}
