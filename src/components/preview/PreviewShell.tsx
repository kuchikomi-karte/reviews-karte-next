'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { USER_AVATAR_UPDATED_EVENT, getStoredUserAvatar } from '@/lib/user-avatar'

interface PreviewShellProps {
  children: ReactNode
  /** karte-demoページ用のカルテメニューバーを表示するか */
  showKarteMenu?: boolean
  /** false のとき PreviewShell のサイドバー（maxWidth ラッパー）を非表示にする */
  showSidebar?: boolean
  /** karte-demo のように独自右カラムを描画するページ向けの予約prop */
  showRightCol?: boolean
}

export default function PreviewShell({ children, showKarteMenu, showSidebar }: PreviewShellProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const syncAvatar = () => {
      setAvatarUrl(getStoredUserAvatar())
    }

    syncAvatar()
    window.addEventListener('storage', syncAvatar)
    window.addEventListener(USER_AVATAR_UPDATED_EVENT, syncAvatar as EventListener)

    return () => {
      window.removeEventListener('storage', syncAvatar)
      window.removeEventListener(USER_AVATAR_UPDATED_EVENT, syncAvatar as EventListener)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
    })
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f0e8',
      color: '#1a1a1a',
      fontFamily: 'var(--font-noto-sans-jp), Noto Sans JP, sans-serif',
    }}>
      {/* ── Header ─────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>

        {/* 上段: ブランドバー 52px */}
        <div style={{
          height: '56px',
          backgroundColor: '#0a0a0a',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '0.5px solid #222',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{
              fontSize: '11px',
              color: '#555',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
            }}>
              ai×me lab
            </span>
            <span style={{ color: '#333', margin: '0 10px' }}>|</span>
            <span style={{
              fontSize: '14px',
              color: '#e8e0d0',
              fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
              letterSpacing: '0.1em',
            }}>
              黒川聖羅カルテ
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {userEmail && (
              <span style={{ fontSize: '10px', color: '#444', letterSpacing: '0.04em' }}>
                {userEmail}
              </span>
            )}
            <button
              onClick={() => router.push('/preview/karte-demo/profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              type="button"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="ユーザーアイコン"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    border: '1px solid rgba(201,168,76,0.35)',
                    background: '#1a1a1a',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.35)',
                    background: '#1a1a1a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#c9a84c',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}
                >
                  人
                </span>
              )}
              <span style={{ fontSize: '11px', color: '#555', cursor: 'pointer', letterSpacing: '0.04em' }}>
                プロフィール設定
              </span>
            </button>
            <span style={{ color: '#2a2a2a', fontSize: '11px' }}>|</span>
            <button
              onClick={handleLogout}
              style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', padding: 0 }}
              type="button"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* 下段: サービスナビ 42px */}
        <div style={{
          height: '46px',
          backgroundColor: '#0d0d0d',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'stretch',
          borderBottom: '0.5px solid #222',
        }}>
          {/* 口コミ経営カルテ（アクティブ） */}
          <Link href="/preview/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            fontSize: '12px',
            color: '#c9a84c',
            textDecoration: 'none',
            borderBottom: '2px solid #c9a84c',
            letterSpacing: '0.06em',
            boxSizing: 'border-box',
          }}>
            口コミ経営カルテ
          </Link>

          {/* 口コミSNSカルテ（準備中） */}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            fontSize: '12px',
            color: '#3a3a3a',
            cursor: 'default',
            userSelect: 'none',
            letterSpacing: '0.06em',
          }}>
            口コミSNSカルテ
            <span style={{
              fontSize: '9px',
              marginLeft: '6px',
              padding: '1px 5px',
              backgroundColor: '#1a1a1a',
              border: '0.5px solid #333',
              borderRadius: '3px',
              color: '#3a3a3a',
            }}>
              準備中
            </span>
          </span>

          {/* 経営相談（右端） */}
          <span style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: '#c9a84c',
            padding: '0 18px',
            borderLeft: '0.5px solid #222',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            経営相談
          </span>
        </div>

        {/* カルテメニューバー（karte-demoのみ） */}
        {showKarteMenu && (
          <div style={{
            backgroundColor: '#111',
            borderBottom: '0.5px solid #222',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
          }}>
            {['総評', '口コミ分析', '自覚症状', '自己問診', '処方箋', 'アクション'].map((label, i, arr) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center' }}>
                <a href={`#section-${label}`} style={{
                  fontSize: '11px',
                  color: '#555',
                  padding: '10px 14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'block',
                }}
                onClick={(e) => {
                  e.preventDefault()
                  const id = {
                    '総評': 'section-souhy',
                    '口コミ分析': 'section-kuchikomi',
                    '自覚症状': 'section-jikaku',
                    '自己問診': 'section-monshin',
                    '処方箋': 'section-shohousen',
                    'アクション': 'section-action',
                  }[label]
                  const el = id ? document.getElementById(id) : null
                  if (el) window.scrollTo({ top: el.offsetTop - 140, behavior: 'smooth' })
                }}>
                  {label}
                </a>
                {i < arr.length - 1 && (
                  <span style={{ color: '#2a2a2a', fontSize: '11px' }}>/</span>
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Body ────────────────────────────────── */}
      {showSidebar === false ? (
        <main>{children}</main>
      ) : (
        <main>
          <div style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '32px 24px 80px',
          }}>
            {children}
          </div>
        </main>
      )}
    </div>
  )
}
