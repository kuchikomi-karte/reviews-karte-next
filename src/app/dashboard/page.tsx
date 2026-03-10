'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  name?: string
  salon_name?: string
  business_type?: string
  google_review_url?: string
  other_review_url_1?: string
  other_review_url_2?: string
  other_review_url_3?: string
  subscription_status?: string
}

const businessTypeLabel: Record<string, string> = {
  hair: '美容室',
  nail: 'ネイルサロン',
  esthetic: 'エステサロン',
  other: 'その他',
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const hasSalonInfo = profile?.salon_name && profile?.google_review_url
  const isPremium = profile?.subscription_status === 'premium'
  const displayName = profile?.name || 'ゲスト'

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream)' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray)', letterSpacing: '0.1em' }}>読み込み中...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>

      {/* ヘッダー */}
      <header style={{ backgroundColor: 'var(--black)', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gray)', fontFamily: 'Noto Sans JP, sans-serif' }}>ai×me lab</span>
          <span style={{ fontSize: '16px', letterSpacing: '0.15em', color: 'var(--cream)', fontFamily: 'Noto Serif JP, serif', fontWeight: 400 }}>口コミ経営カルテ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/dashboard/profile" style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'var(--gray-light)', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>プロフィール設定</Link>
          <span style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'var(--gray-light)', fontFamily: 'Noto Sans JP, sans-serif' }}>{displayName}</span>
          <button onClick={handleLogout} style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'var(--gray)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Noto Sans JP, sans-serif' }}>ログアウト</button>
        </div>
      </header>

      {/* 聖羅背景画像（右側固定） */}
      <div style={{ position: 'absolute', top: 64, right: 0, width: '420px', bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <img
            src="/images/seira.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, var(--cream) 0%, transparent 35%), linear-gradient(to bottom, var(--cream) 0%, transparent 8%, transparent 92%, var(--cream) 100%)',
          }} />
        </div>
      </div>

      {/* 名言（画像の胸下あたり・右寄せ） */}
      <div style={{ position: 'absolute', top: 420, right: 24, width: '300px', zIndex: 2, pointerEvents: 'none', textAlign: 'right' }}>
        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--gold)', marginLeft: 'auto', marginBottom: '16px' }} />
        <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '13px', fontWeight: 700, lineHeight: 2, letterSpacing: '0.08em', color: 'var(--black)', margin: '0 0 8px 0', whiteSpace: 'nowrap' }}>
          「口コミは、お客様からの経営レポート。」
        </p>
        <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '12px', fontWeight: 600, lineHeight: 2, letterSpacing: '0.06em', color: 'var(--black)', margin: '0 0 8px 0', whiteSpace: 'nowrap' }}>
          「データを読まない経営者は、勘で戦っている。」
        </p>
        <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '12px', fontWeight: 600, lineHeight: 2, letterSpacing: '0.06em', color: 'var(--black)', margin: '0 0 12px 0', whiteSpace: 'nowrap' }}>
          「返信の質が、店の格を決める。」
        </p>
        <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', margin: 0 }}>── 黒川 聖羅</p>
      </div>

      {/* メインコンテンツ */}
      <main style={{ position: 'relative', zIndex: 1, padding: '48px 48px 48px 48px', paddingRight: '480px' }}>

        {/* ウェルカム */}
        <div style={{ maxWidth: '560px', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '28px', fontWeight: 400, letterSpacing: '0.1em', color: 'var(--black)', marginBottom: '16px' }}>
            {displayName}さんのカルテ
          </h1>

          {/* プラン表示 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ padding: '6px 16px', border: '1px solid var(--black)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--black)', fontFamily: 'Noto Sans JP, sans-serif' }}>
              {isPremium ? 'プレミアムプラン' : 'フリープラン'}
            </span>
            {!isPremium && (
              <Link href="/premium" style={{ fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.1em', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>
                プレミアムプランへ →
              </Link>
            )}
          </div>

          {/* 店舗情報カード */}
          {hasSalonInfo ? (
            <div style={{ padding: '24px 28px', backgroundColor: 'white', border: '1px solid #ddd8ce', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gray)', fontFamily: 'Noto Sans JP, sans-serif' }}>登録済みの店舗情報</span>
                <Link href="/dashboard/profile" style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.1em' }}>編集する</Link>
              </div>
              <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '18px', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--black)', marginBottom: '12px' }}>
                {profile?.salon_name}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>
                業種：{businessTypeLabel[profile?.business_type || ''] || profile?.business_type}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {profile?.google_review_url && (
                  <a href={profile.google_review_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>
                    🔍 Google口コミを開く →
                  </a>
                )}
                {profile?.other_review_url_1 && (
                  <a href={profile.other_review_url_1} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>
                    🔗 その他口コミサイトを開く →
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px 28px', backgroundColor: 'var(--cream-dark)', border: '1px solid #ddd8ce' }}>
              <p style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '0.05em', color: 'var(--black)', marginBottom: '8px', fontFamily: 'Noto Sans JP, sans-serif' }}>店舗情報が未登録です</p>
              <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '20px', fontFamily: 'Noto Sans JP, sans-serif' }}>口コミ分析を始めるために、店舗情報をご登録ください。</p>
              <Link href="/dashboard/profile" style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: 'var(--gold)', color: 'var(--black)', fontSize: '13px', letterSpacing: '0.1em', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 500 }}>
                店舗情報を登録する →
              </Link>
            </div>
          )}
        </div>

        {/* メニューカード */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '800px' }}>

          {/* AI口コミ返信案 */}
          <Link href="/dashboard/reviews" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #ddd8ce', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>🖊️</div>
              <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--black)', marginBottom: '12px' }}>AI口コミ返信案</h3>
              <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'Noto Sans JP, sans-serif' }}>口コミの返信案をAIが自動で作成します。</p>
              <p style={{ fontSize: '11px', color: isPremium ? 'var(--gold)' : 'var(--gray)', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>
                {isPremium ? '無制限' : '1日5回まで'}
              </p>
            </div>
          </Link>

          {/* 週次レポート */}
          <div style={{ padding: '32px', backgroundColor: isPremium ? 'white' : 'var(--cream-dark)', border: '1px solid #ddd8ce', opacity: isPremium ? 1 : 0.7 }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: isPremium ? 'var(--black)' : 'var(--gray)', marginBottom: '12px' }}>週次レポート</h3>
            <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'Noto Sans JP, sans-serif' }}>週ごとの口コミ傾向やスコアの変化を確認できます。</p>
            <p style={{ fontSize: '11px', color: 'var(--gray)', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>{isPremium ? '' : 'プレミアムで解放'}</p>
          </div>

          {/* 月次レポート */}
          <div style={{ padding: '32px', backgroundColor: 'var(--cream-dark)', border: '1px solid #ddd8ce', opacity: 0.7 }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--gray)', marginBottom: '12px' }}>月次レポート</h3>
            <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'Noto Sans JP, sans-serif' }}>月次傾向や改善ポイントをレポート形式で確認します。</p>
            <p style={{ fontSize: '11px', color: 'var(--gray)', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>プレミアムで解放</p>
          </div>

          {/* 経営相談 */}
          <Link href="/dashboard/consultation" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #ddd8ce', cursor: 'pointer' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--black)', marginBottom: '12px' }}>経営相談</h3>
              <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'Noto Sans JP, sans-serif' }}>運用の悩みや返信方針を相談できます。</p>
              <p style={{ fontSize: '11px', color: isPremium ? 'var(--gold)' : 'var(--gray)', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>
                {isPremium ? '無制限' : '利用不可'}
              </p>
            </div>
          </Link>

        </div>
      </main>
    </div>
  )
}
