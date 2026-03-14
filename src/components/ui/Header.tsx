'use client'
import Link from 'next/link'

type HeaderProps = {
  authLinkHref?: string
  authLinkLabel?: string
  onLogout?: () => void
}

export default function Header({
  authLinkHref = 'https://reviews-karte-next.vercel.app/login',
  authLinkLabel = '会員ログイン',
  onLogout,
}: HeaderProps) {
  const isDashboardHeader = typeof onLogout === 'function'

  if (isDashboardHeader) {
    return (
      <header
        style={{
          backgroundColor: '#0a0a0a',
          padding: '0 48px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#888888',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            ai×me lab
          </span>
          <span
            style={{
              fontSize: '16px',
              letterSpacing: '0.15em',
              color: '#f5f0e8',
              fontFamily: 'Noto Serif JP, serif',
              fontWeight: 400,
            }}
          >
            口コミ経営カルテ
          </span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            href="/dashboard/profile"
            style={{
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: '#cccccc',
              textDecoration: 'none',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            プロフィール設定
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: '#cccccc',
              textDecoration: 'none',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            口コミ経営カルテ
          </Link>
          <button
            onClick={onLogout}
            style={{
              fontSize: '12px',
              color: '#888888',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Noto Sans JP, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            ログアウト
          </button>
        </nav>
      </header>
    )
  }

  return (
    <header
      className="site-header"
      style={{
        backgroundColor: '#0a0a0a',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        width: '100%',
        boxSizing: 'border-box' as const,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Link
          href="https://kuchikomi-karte.github.io"
          style={{
            color: '#c9a84c',
            fontSize: '18px',
            fontFamily: '"Noto Serif JP", serif',
            textDecoration: 'none',
            letterSpacing: '0.1em',
          }}
        >
          口コミ経営カルテ
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href={authLinkHref}
            style={{
              border: '1px solid #c9a84c',
              color: '#c9a84c',
              padding: '8px 20px',
              textDecoration: 'none',
              fontSize: '13px',
              letterSpacing: '0.05em',
            }}
          >
            {authLinkLabel}
          </Link>
          <Link
            href="https://kuchikomi-karte.github.io/#karte"
            style={{
              backgroundColor: '#c9a84c',
              color: '#0a0a0a',
              padding: '8px 20px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.05em',
            }}
          >
            無料診断を受ける
          </Link>
        </div>
      </div>
    </header>
  )
}
