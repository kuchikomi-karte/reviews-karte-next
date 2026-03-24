"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
import HeroSection from "@/components/brand/HeroSection";
import styles from "@/styles/dashboard.module.css";
import brandStyles from "@/styles/brand.module.css";
import { USER_LOGIN_PATH, USER_PREMIUM_PATH, hasUserAuthConfig } from "@/lib/auth/user";

type Profile = {
  name?: string;
  salon_name?: string;
  business_type?: string;
  google_review_url?: string;
  other_review_url_1?: string;
  subscription_status?: string;
};

const bizLabel: Record<string, string> = {
  hair: "ヘアサロン",
  nail: "ネイルサロン",
  esthetic: "エステサロン",
  other: "その他",
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
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f0e8" }}>
        <p style={{ fontSize: "13px", color: "#888888", letterSpacing: "0.1em", fontFamily: "Noto Sans JP, sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  const hasSalonInfo = Boolean(profile?.salon_name);
  const isPremium = profile?.subscription_status === "premium";
  const displayName = profile?.name || "ゲスト";

  return (
    <div className={brandStyles.wrapper}>
      <Header onLogout={handleLogout} />
      <HeroSection />

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>{displayName} さんのカルテ</h1>

          <div className={styles.planBadgeRow}>
            <span className={styles.planBadge}>
              {isPremium ? "プレミアムプラン" : "フリープラン"}
            </span>
            {!isPremium && (
              <Link href={USER_PREMIUM_PATH} className={styles.premiumLink}>
                プレミアムプランを見る
              </Link>
            )}
          </div>

          <div className={styles.salonCardRow}>
            {hasSalonInfo ? (
              <div className={`${styles.salonCard} ${styles.salonCardRegistered}`}>
                <div className={styles.salonCardHeader}>
                  <span className={styles.salonCardLabel}>登録済みの店舗情報</span>
                </div>
                <p className={styles.salonName}>{profile?.salon_name}</p>
                <p className={styles.salonMeta}>業種: {bizLabel[profile?.business_type || ""] || profile?.business_type}</p>
                <div className={styles.salonLinks}>
                  {profile?.google_review_url && (
                    <a href={profile.google_review_url} target="_blank" rel="noopener noreferrer" className={styles.salonLink}>Google口コミ</a>
                  )}
                  {profile?.other_review_url_1 && (
                    <a href={profile.other_review_url_1} target="_blank" rel="noopener noreferrer" className={styles.salonLink}>{profile.other_review_url_1}</a>
                  )}
                </div>
                <Link href="/dashboard/profile" className={styles.registerButton}>店舗情報の変更</Link>
              </div>
            ) : (
              <div className={`${styles.salonCard} ${styles.salonCardEmpty}`}>
                <p className={styles.emptyTitle}>店舗情報が未登録です</p>
                <p className={styles.emptyDesc}>口コミ管理を使い始める前に、店舗情報と口コミサイトURLを登録してください。</p>
                <Link href="/dashboard/profile" className={styles.registerButton}>店舗情報を登録する</Link>
              </div>
            )}

            <div className={styles.seiraBanner}>
              <p className={styles.seiraBannerText1}>口コミの状況を客観的に見て、次に集中すべきポイントを明確にする。</p>
              <p className={styles.seiraBannerText2}>返信案・週次書類・店舗情報の 3 つを同じ画面で捉えるように設計しています。</p>
              <p className={styles.seiraBannerAuthor}>―― 黒川聖羅</p>
            </div>
          </div>
        </div>

        <div className={styles.menuGrid}>
          {[
            { href: "/dashboard/reviews", title: "AI口コミ返信案", description: "口コミ本文から返信案の下書きを生成します。", status: isPremium ? "プレミアム利用中" : "フリープランで利用可能" },
            { href: "/dashboard/karte", title: "週次レポート", description: "今週の口コミ傾向と改善ポイントを確認します。", status: isPremium ? "利用可能" : "プレミアム限定" },
            { href: "/dashboard/consultation", title: "月次レポート", description: "月間の口コミデータを分析したレポートです。", status: isPremium ? "利用可能" : "プレミアム限定" },
            { href: "/dashboard/consultation", title: "経営相談", description: "担当上長への相談内容を送信し処理メモを確認します。", status: "相談状況を確認" },
          ].map((item) => (
            <Link key={item.href + item.title} href={item.href} className={styles.menuCard}>
              <h3 className={styles.menuTitle}>{item.title}</h3>
              <p className={styles.menuDesc}>{item.description}</p>
              <p className={isPremium ? styles.menuStatusActive : styles.menuStatus}>{item.status}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
