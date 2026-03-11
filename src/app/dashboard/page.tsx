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
  other: 'その他',
}

const QUOTES = [
  '口コミは、\nお客様からの経営レポート。',
  'データを読まない経営者は、\n勘で戦っている。',
  '返信の質が、\n店の格を決める。',
]

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

  const isPremium = profile?.subscription_status === 'premium'
  const displayName = profile?.salon_name || profile?.name || '口コミ経営カルテ'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Noto Sans JP, sans-serif', color: '#888', letterSpacing: '0.1em', fontSize: '13px' }}>読み込み中...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Noto Sans JP, sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* 聖羅の背景画像（全画面） */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <img
          src="/images/seira.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* 左側オーバーレイ：コンテンツを読みやすくする */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(245,240,232,0.97) 0%, rgba(245,240,232,0.92) 40%, rgba(245,240,232,0.4) 70%, transparent 100%)'
        }} />
        {/* 上下フェード */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 12%, transparent 85%, rgba(245,240,232,0.8) 100%)'
        }} />
      </div>

      {/* ヘッダー */}
      <header style={{ position: 'relative', zIndex: 10, backgroundColor: '#0a0a0a', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#888', fontWeight: 400 }}>ai×me lab</span>
          <span style={{ color: '#444', fontSize: '12px' }}>|</span>
          <span style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '15px', letterSpacing: '0.2em', color: '#f5f0e8', fontWeight: 400 }}>口コミ経営カルテ</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/dashboard/profile" style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#aaa', textDecoration: 'none' }}>プロフィール設定</Link>
          <Link href="/dashboard" style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#aaa', textDecoration: 'none' }}>口コミ経営カルテ</Link>
          <button onClick={handleLogout} style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Noto Sans JP, sans-serif', padding: 0 }}>ログアウト</button>
        </nav>
      </header>

      {/* 聖羅の名言（右下に配置） */}
      <div style={{ position: 'fixed', bottom: 48, right: 28, width: '300px', zIndex: 5, pointerEvents: 'none', textAlign: 'right' }}>
        <div style={{ width: '24px', height: '1px', backgroundColor: '#c9a84c', marginLeft: 'auto', marginBottom: '16px' }} />
        {QUOTES.map((q, i) => (
          <p key={i} style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '13px', lineHeight: 2, letterSpacing: '0.12em', color: '#0a0a0a', marginBottom: '12px', whiteSpace: 'pre-line' }}>
            {q}
          </p>
        ))}
        <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#c9a84c', marginTop: '16px' }}>黒川 聖羅</p>
      </div>

      {/* メインコンテンツ（横幅全体を使う） */}
      <div style={{ position: 'relative', zIndex: 3, padding: '48px 40px 80px' }}>

        <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '26px', fontWeight: 400, letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px' }}>
          {displayName}さんのカルテ
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
          <span style={{ display: 'inline-block', padding: '4px 14px', border: '1px solid #0a0a0a', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a' }}>
            {isPremium ? 'プレミアムプラン' : 'フリープラン'}
          </span>
          {!isPremium && (
            <Link href="/dashboard/upgrade" style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#c9a84c', textDecoration: 'none' }}>
              プレミアムプランへ →
            </Link>
          )}
        </div>

        {!profile?.google_review_url ? (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #e8e0d0', padding: '32px', marginBottom: '32px', maxWidth: '520px' }}>
            <p style={{ fontSize: '15px', letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '8px', fontWeight: 500 }}>店舗情報が未登録です</p>
            <p style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#666', marginBottom: '24px', lineHeight: 1.8 }}>口コミ分析を始めるために、店舗情報をご登録ください。</p>
            <Link href="/register/complete" style={{ display: 'inline-block', padding: '13px 28px', backgroundColor: '#c9a84c', color: '#0a0a0a', fontSize: '13px', letterSpacing: '0.12em', textDecoration: 'none', fontWeight: 500 }}>
              店舗情報を登録する →
            </Link>
          </div>
        ) : (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #e8e0d0', padding: '28px 32px', marginBottom: '32px', maxWidth: '520px' }}>
            <p style={{ fontSize: '13px', letterSpacing: '0.12em', color: '#888', marginBottom: '4px' }}>登録店舗</p>
            <p style={{ fontSize: '18px', fontFamily: 'Noto Serif JP, serif', letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '12px' }}>{profile.salon_name || '未設定'}</p>
            {profile.business_type && (
              <p style={{ fontSize: '12px', color: '#666', letterSpacing: '0.08em' }}>{bizLabel[profile.business_type] || profile.business_type}</p>
            )}
          </div>
        )}

        {/* カードグリッド：横幅に合わせて自動調整 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '900px'
        }}>

          <Link href="/dashboard/reply" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e8e0d0', padding: '28px 24px', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🖊</div>
              <p style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#0a0a0a', fontWeight: 500, marginBottom: '8px' }}>AI口コミ返信案</p>
              <p style={{ fontSize: '12px', color: '#666', letterSpacing: '0.05em', lineHeight: 1.7, marginBottom: '12px' }}>口コミの返信案をAIが自動で作成します。</p>
              <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.08em' }}>{isPremium ? '無制限' : '1日5回まで'}</p>
            </div>
          </Link>

          <div style={{ backgroundColor: isPremium ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', border: '1px solid #e8e0d0', padding: '28px 24px' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>📊</div>
            <p style={{ fontSize: '14px', letterSpacing: '0.1em', color: isPremium ? '#0a0a0a' : '#aaa', fontWeight: 500, marginBottom: '8px' }}>週次レポート</p>
            <p style={{ fontSize: '12px', color: isPremium ? '#666' : '#bbb', letterSpacing: '0.05em', lineHeight: 1.7, marginBottom: '12px' }}>週ごとの口コミ傾向やスコアの変化を確認できます。</p>
            {!isPremium && <p style={{ fontSize: '11px', color: '#c9a84c', letterSpacing: '0.08em' }}>プレミアムで解放</p>}
          </div>

          <div style={{ backgroundColor: isPremium ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', border: '1px solid #e8e0d0', padding: '28px 24px' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>📋</div>
            <p style={{ fontSize: '14px', letterSpacing: '0.1em', color: isPremium ? '#0a0a0a' : '#aaa', fontWeight: 500, marginBottom: '8px' }}>月次レポート</p>
            <p style={{ fontSize: '12px', color: isPremium ? '#666' : '#bbb', letterSpacing: '0.05em', lineHeight: 1.7, marginBottom: '12px' }}>月単位の経営指標と口コミ分析レポートです。</p>
            {!isPremium && <p style={{ fontSize: '11px', color: '#c9a84c', letterSpacing: '0.08em' }}>プレミアムで解放</p>}
          </div>

          <Link href="/dashboard/consultation" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e8e0d0', padding: '28px 24px', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>💬</div>
              <p style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#0a0a0a', fontWeight: 500, marginBottom: '8px' }}>経営相談</p>
              <p style={{ fontSize: '12px', color: '#666', letterSpacing: '0.05em', lineHeight: 1.7, marginBottom: '12px' }}>黒川聖羅に経営の悩みを相談できます。</p>
              <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.08em' }}>{isPremium ? '無制限' : '月3回まで'}</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
