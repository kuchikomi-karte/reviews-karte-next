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
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f0e8' }}>
      <div style={{ fontSize: '13px', color: '#888888', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>読み込み中...</div>
    </div>
  )

  const hasSalonInfo = !!(profile?.salon_name && profile?.google_review_url)
  const isPremium = profile?.subscription_status === 'premium'
  const displayName = profile?.name || 'ゲスト'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', position: 'relative', overflow: 'hidden' }}>

      {/* ヘッダー */}
      <header style={{ backgroundColor: '#0a0a0a', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>ai×me lab</span>
          <span style={{ fontSize: '16px', letterSpacing: '0.15em', color: '#f5f0e8', fontFamily: 'Noto Serif JP, serif', fontWeight: 400 }}>口コミ経営カルテ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/dashboard/profile" style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#cccccc', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>プロフィール設定</Link>
          <Link href="/dashboard/reviews" style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#cccccc', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>口コミ経営カルテ</Link>
          <button onClick={handleLogout} style={{ fontSize: '12px', color: '#888888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Noto Sans JP, sans-serif', letterSpacing: '0.1em' }}>ログアウト</button>
        </div>
      </header>

      {/* 右側：黒川聖羅画像（absolute配置） */}
      <div style={{ position: 'absolute', top: 64, right: 0, width: '42%', bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src="/images/seira.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #f5f0e8 0%, transparent 35%), linear-gradient(to bottom, #f5f0e8 0%, transparent 8%, transparent 92%, #f5f0e8 100%)' }} />
      </div>

      {/* 名言（absolute配置） */}
      <div style={{ position: 'absolute', top: 480, right: 28, width: '300px', zIndex: 2, pointerEvents: 'none', textAlign: 'right' }}>
        <div style={{ width: '24px', height: '1px', backgroundColor: '#c9a84c', marginLeft: 'auto', marginBottom: '16px' }} />
        <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '13px', fontWeight: 700, lineHeight: 2, letterSpacing: '0.08em', color: '#0a0a0a', margin: '0 0 8px 0', whiteSpace: 'nowrap' }}>「口コミは、お客様からの経営レポート。」</p>
        <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '12px', fontWeight: 600, lineHeight: 2, letterSpacing: '0.06em', color: '#0a0a0a', margin: '0 0 8px 0', whiteSpace: 'nowrap' }}>「データを読まない経営者は、勘で戦っている。」</p>
        <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '12px', fontWeight: 600, lineHeight: 2, letterSpacing: '0.06em', color: '#0a0a0a', margin: '0 0 14px 0', whiteSpace: 'nowrap' }}>「返信の質が、店の格を決める。」</p>
        <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#c9a84c', margin: 0 }}>── 黒川 聖羅</p>
      </div>

      {/* メインコンテンツ：左58%に収める */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        width: '58%',
        padding: '48px 40px 48px 48px',
        boxSizing: 'border-box'
      }}>

        {/* タイトル・プランバッジ */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '28px', fontWeight: 400, letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '16px' }}>{displayName}さんのカルテ</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ padding: '6px 16px', border: '1px solid #0a0a0a', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', fontFamily: 'Noto Sans JP, sans-serif' }}>{isPremium ? 'プレミアムプラン' : 'フリープラン'}</span>
            {!isPremium && <Link href="/premium" style={{ fontSize: '12px', color: '#c9a84c', letterSpacing: '0.1em', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>プレミアムプランへ →</Link>}
          </div>

          {/* 店舗情報カード */}
          {hasSalonInfo ? (
            <div style={{ padding: '24px 28px', backgroundColor: 'white', border: '1px solid #ddd8ce', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>登録済みの店舗情報</span>
                <Link href="/dashboard/profile" style={{ fontSize: '11px', color: '#c9a84c', textDecoration: 'none' }}>編集する</Link>
              </div>
              <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '18px', fontWeight: 500, letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '8px' }}>{profile?.salon_name}</p>
              <p style={{ fontSize: '12px', color: '#888888', marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>業種：{bizLabel[profile?.business_type || ''] || profile?.business_type}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {profile?.google_review_url && <a href={profile.google_review_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#c9a84c', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>🔍 Google口コミを開く →</a>}
                {profile?.other_review_url_1 && <a href={profile.other_review_url_1} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#c9a84c', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif' }}>🔗 その他口コミサイトを開く →</a>}
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px 28px', backgroundColor: '#ede8df', border: '1px solid #ddd8ce', width: '100%', boxSizing: 'border-box' }}>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#0a0a0a', marginBottom: '8px', fontFamily: 'Noto Sans JP, sans-serif' }}>店舗情報が未登録です</p>
              <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px', fontFamily: 'Noto Sans JP, sans-serif' }}>口コミ分析を始めるために、店舗情報をご登録ください。</p>
              <Link href="/dashboard/profile" style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#c9a84c', color: '#0a0a0a', fontSize: '13px', letterSpacing: '0.1em', textDecoration: 'none', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 500 }}>店舗情報を登録する →</Link>
            </div>
          )}
        </div>

        {/* メニューカード：2列グリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
          <Link href="/dashboard/reviews" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #ddd8ce', minHeight: '160px' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>🖊️</div>
              <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '10px' }}>AI口コミ返信案</h3>
              <p style={{ fontSize: '12px', color: '#888888', lineHeight: 1.8, marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>口コミの返信案をAIが自動で作成します。</p>
              <p style={{ fontSize: '11px', color: isPremium ? '#c9a84c' : '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>{isPremium ? '無制限' : '1日5回まで'}</p>
            </div>
          </Link>
          <div style={{ padding: '32px', backgroundColor: isPremium ? 'white' : '#ede8df', border: '1px solid #ddd8ce', opacity: isPremium ? 1 : 0.75, minHeight: '160px' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: isPremium ? '#0a0a0a' : '#888888', marginBottom: '10px' }}>週次レポート</h3>
            <p style={{ fontSize: '12px', color: '#888888', lineHeight: 1.8, marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>週ごとの口コミ傾向やスコアの変化を確認できます。</p>
            <p style={{ fontSize: '11px', color: '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>{isPremium ? '' : 'プレミアムで解放'}</p>
          </div>
          <div style={{ padding: '32px', backgroundColor: '#ede8df', border: '1px solid #ddd8ce', opacity: 0.75, minHeight: '160px' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: '#888888', marginBottom: '10px' }}>月次レポート</h3>
            <p style={{ fontSize: '12px', color: '#888888', lineHeight: 1.8, marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>月次傾向や改善ポイントをレポート形式で確認します。</p>
            <p style={{ fontSize: '11px', color: '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>プレミアムで解放</p>
          </div>
          <Link href="/dashboard/consultation" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #ddd8ce', minHeight: '160px' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '10px' }}>経営相談</h3>
              <p style={{ fontSize: '12px', color: '#888888', lineHeight: 1.8, marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>運用の悩みや返信方針を相談できます。</p>
              <p style={{ fontSize: '11px', color: isPremium ? '#c9a84c' : '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>{isPremium ? '無制限' : '利用不可'}</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
