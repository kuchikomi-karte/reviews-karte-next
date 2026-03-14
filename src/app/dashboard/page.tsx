'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/ui/Header'

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'Noto Sans JP, sans-serif' }}>
      <Header onLogout={handleLogout} />

      <div style={{ padding: '40px 24px', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '28px', fontWeight: 700, letterSpacing: '0.1em', color: '#0a0a0a', margin: '0 0 12px 0' }}>
              {displayName}さんのカルテ
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{
                padding: '4px 12px',
                backgroundColor: isPremium ? '#c9a84c' : '#e0e0e0',
                color: isPremium ? '#0a0a0a' : '#666666',
                fontSize: '11px',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}>
                {isPremium ? 'プレミアムプラン' : 'フリープラン'}
              </span>
              {!isPremium && (
                <Link href="/premium" style={{
                  fontSize: '12px',
                  color: '#c9a84c',
                  textDecoration: 'none'
                }}>
                  プレミアムプランへ →
                </Link>
              )}
            </div>

            {/* 将来のタブUI（現在非表示） */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#0a0a0a',
                color: '#f5f0e8',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 600
              }}>
                口コミ経営カルテ
              </button>
              <button style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#0a0a0a',
                border: '1px solid #cccccc',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 600
              }}>
                SNS経営カルテ
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {hasSalonInfo ? (
                <div style={{
                  border: '1px solid #cccccc',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', fontWeight: 600 }}>
                      登録済みの店舗情報
                    </span>
                    <Link href="/dashboard/profile" style={{ fontSize: '12px', color: '#c9a84c', textDecoration: 'none' }}>
                      編集する
                    </Link>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>{profile?.salon_name}</p>
                  <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px' }}>業種：{bizLabel[profile?.business_type || ''] || profile?.business_type}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {profile?.google_review_url && (
                      <a href={profile.google_review_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#c9a84c', textDecoration: 'none' }}>
                        🔍 Google口コミを開く →
                      </a>
                    )}
                    {profile?.other_review_url_1 && (
                      <a href={profile.other_review_url_1} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#c9a84c', textDecoration: 'none' }}>
                        🔗 その他口コミサイトを開く →
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '1px solid #cccccc',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>店舗情報が未登録です</p>
                  <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px' }}>口コミ分析を始めるために、店舗情報をご登録ください。</p>
                  <Link href="/dashboard/profile" style={{
                    display: 'inline-block',
                    padding: '13px 24px',
                    backgroundColor: '#c9a84c',
                    color: '#0a0a0a',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'Noto Sans JP, sans-serif'
                  }}>
                    店舗情報を登録する →
                  </Link>
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Link href="/dashboard" style={{ fontSize: '12px', color: '#888888', textDecoration: 'none' }}>
                      ダッシュボードへ戻る
                    </Link>
                  </div>
                </div>
              )}
              <div style={{
                padding: '24px',
                backgroundColor: '#f5f0e8',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '15px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>「口コミは、お客様からの経営レポート。」</p>
                <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '15px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>「データを読まない経営者は、勘で戦っている。」</p>
                <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '15px', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>「返信の質が、店の格を決める。」</p>
                <p style={{ fontSize: '12px', color: '#888888', textAlign: 'right' }}>── 黒川 聖羅</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <Link href="/dashboard/reviews" style={{
              display: 'block',
              padding: '24px',
              backgroundColor: 'white',
              border: '1px solid #cccccc',
              borderRadius: '8px',
              textDecoration: 'none'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🖊️</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 8px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>AI口コミ返信案</h3>
              <p style={{ fontSize: '13px', color: '#666666', margin: '0 0 12px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>口コミの返信案をAIが自動で作成します。</p>
              <p style={{
                fontSize: '12px',
                color: isPremium ? '#c9a84c' : '#666666',
                fontWeight: 600
              }}>
                {isPremium ? '無制限' : '1日5回まで'}
              </p>
            </Link>

            <div style={{
              padding: '24px',
              backgroundColor: '#f5f0e8',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📊</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#666666', margin: '0 0 8px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>週次レポート</h3>
              <p style={{ fontSize: '13px', color: '#888888', margin: '0 0 12px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>週ごとの口コミ傾向やスコアの変化を確認できます。</p>
              <p style={{ fontSize: '12px', color: '#888888', fontWeight: 600 }}>
                {isPremium ? '' : 'プレミアムで解放'}
              </p>
            </div>

            <div style={{
              padding: '24px',
              backgroundColor: '#f5f0e8',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📋</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#666666', margin: '0 0 8px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>月次レポート</h3>
              <p style={{ fontSize: '13px', color: '#888888', margin: '0 0 12px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>月次傾向や改善ポイントをレポート形式で確認します。</p>
              <p style={{ fontSize: '12px', color: '#888888', fontWeight: 600 }}>
                プレミアムで解放
              </p>
            </div>

            <Link href="/dashboard/consultation" style={{
              display: 'block',
              padding: '24px',
              backgroundColor: 'white',
              border: '1px solid #cccccc',
              borderRadius: '8px',
              textDecoration: 'none'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>💬</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 8px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>経営相談</h3>
              <p style={{ fontSize: '13px', color: '#666666', margin: '0 0 12px 0', fontFamily: 'Noto Sans JP, sans-serif' }}>運用の悩みや返信方針を相談できます。</p>
              <p style={{
                fontSize: '12px',
                color: isPremium ? '#c9a84c' : '#666666',
                fontWeight: 600
              }}>
                {isPremium ? '無制限' : '利用不可'}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
