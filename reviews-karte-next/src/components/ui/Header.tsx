'use client'

import Link from 'next/link'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header style={{
      backgroundColor: '#0a0a0a',
      padding: '0 48px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#888888',
          fontFamily: 'Noto Sans JP, sans-serif'
        }}>
          ai×me lab
        </span>
        <span style={{
          fontSize: '16px',
          letterSpacing: '0.15em',
          color: '#f5f0e8',
          fontFamily: 'Noto Serif JP, serif',
          fontWeight: 400
        }}>
          黒川聖羅カルテ
        </span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/dashboard/profile" style={{
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: '#cccccc',
          textDecoration: 'none',
          fontFamily: 'Noto Sans JP, sans-serif'
        }}>
          プロフィール設定
        </Link>
        <Link href="/dashboard" style={{
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: '#cccccc',
          textDecoration: 'none',
          fontFamily: 'Noto Sans JP, sans-serif'
        }}>
          口コミ経営カルテ
        </Link>
        <button onClick={onLogout} style={{
          fontSize: '12px',
          color: '#888888',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Noto Sans JP, sans-serif',
          letterSpacing: '0.1em'
        }}>
          ログアウト
        </button>
      </nav>
    </header>
  )
}
