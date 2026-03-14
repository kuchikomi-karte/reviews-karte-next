'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/ui/Header'
import HeroSection from '@/components/brand/HeroSection'
import styles from '@/styles/dashboard.module.css'
import brandStyles from '@/styles/brand.module.css'

interface Profile {
  name?: string
  salon_name?: string
  business_type?: string
  google_review_url?: string
  other_review_url_1?: string
  subscription_status?: string
}

const bizLabel: Record<string, string> = {
  hair: '美容室',
  nail: 'ネイルサロン',
  esthetic: 'エステサロン',
  other: 'その他'
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f0e8' }}>
      <p style={{ fontSize: '13px', color: '#888888', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>読み込み中...</p>
    </div>
  )

  const hasSalonInfo = !!(profile?.salon_name && profile?.google_review_url)
  const isPremium = profile?.subscription_status === 'premium'
  const displayName = profile?.name || 'ゲスト'

  return (
    <div className={brandStyles.wrapper}>
      <Header onLogout={handleLogout} />
      <HeroSection />

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>{displayName}さんのカルテ</h1>

          <div className={styles.planBadgeRow}>
            <span className={styles.planBadge}>
              {isPremium ? 'プレミアムプラン' : 'フリープラン'}
            </span>
            {!isPremium && (
              <Link href="/premium" className={styles.premiumLink}>
                プレミアムプランへ →
              </Link>
            )}
          </div>

          {/* 将来のタブUI（現在非表示） */}
          <div className={styles.productTabs}>
            <button className={`${styles.productTab} ${styles.productTabActive}`}>
              口コミ経営カルテ
            </button>
            <button className={styles.productTab}>
              SNS経営カルテ
            </button>
          </div>

          {hasSalonInfo ? (
            <div className={`${styles.salonCard} ${styles.salonCardRegistered}`}>
              <div className={styles.salonCardHeader}>
                <span className={styles.salonCardLabel}>登録済みの店舗情報</span>
                <Link href="/dashboard/profile" className={styles.salonCardEditLink}>編集する</Link>
              </div>
              <p className={styles.salonName}>{profile?.salon_name}</p>
              <p className={styles.salonMeta}>業種：{bizLabel[profile?.business_type || ''] || profile?.business_type}</p>
              <div className={styles.salonLinks}>
                {profile?.google_review_url && (
                  <a href={profile.google_review_url} target="_blank" rel="noopener noreferrer" className={styles.salonLink}>
                    🔍 Google口コミを開く →
                  </a>
                )}
                {profile?.other_review_url_1 && (
                  <a href={profile.other_review_url_1} target="_blank" rel="noopener noreferrer" className={styles.salonLink}>
                    🔗 その他口コミサイトを開く →
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className={`${styles.salonCard} ${styles.salonCardEmpty}`}>
              <p className={styles.emptyTitle}>店舗情報が未登録です</p>
              <p className={styles.emptyDesc}>口コミ分析を始めるために、店舗情報をご登録ください。</p>
              <Link href="/dashboard/profile" className={styles.registerButton}>
                店舗情報を登録する →
              </Link>
            </div>
          )}

          <div className={styles.seiraBanner}>
            <p className={styles.seiraBannerText1}>「口コミは、お客様からの経営レポート。」</p>
            <p className={styles.seiraBannerText2}>「データを読まない経営者は、勘で戦っている。」</p>
            <p className={styles.seiraBannerText3}>「返信の質が、店の格を決める。」</p>
            <p className={styles.seiraBannerAuthor}>── 黒川 聖羅</p>
          </div>
        </div>

        <div className={styles.menuGrid}>
          <Link href="/dashboard/reviews" className={styles.menuCard}>
            <div className={styles.menuIcon}>🖊️</div>
            <h3 className={styles.menuTitle}>AI口コミ返信案</h3>
            <p className={styles.menuDesc}>口コミの返信案をAIが自動で作成します。</p>
            <p className={isPremium ? styles.menuStatusActive : styles.menuStatus}>
              {isPremium ? '無制限' : '1日5回まで'}
            </p>
          </Link>

          <div className={styles.menuCardLocked}>
            <div className={styles.menuIcon}>📊</div>
            <h3 className={styles.menuTitleLocked}>週次レポート</h3>
            <p className={styles.menuDesc}>週ごとの口コミ傾向やスコアの変化を確認できます。</p>
            <p className={styles.menuStatus}>{isPremium ? '' : 'プレミアムで解放'}</p>
          </div>

          <div className={styles.menuCardLocked}>
            <div className={styles.menuIcon}>📋</div>
            <h3 className={styles.menuTitleLocked}>月次レポート</h3>
            <p className={styles.menuDesc}>月次傾向や改善ポイントをレポート形式で確認します。</p>
            <p className={styles.menuStatus}>プレミアムで解放</p>
          </div>

          <Link href="/dashboard/consultation" className={styles.menuCard}>
            <div className={styles.menuIcon}>💬</div>
            <h3 className={styles.menuTitle}>経営相談</h3>
            <p className={styles.menuDesc}>運用の悩みや返信方針を相談できます。</p>
            <p className={isPremium ? styles.menuStatusActive : styles.menuStatus}>
              {isPremium ? '無制限' : '利用不可'}
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
