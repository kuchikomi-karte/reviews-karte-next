'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header" style={{
      backgroundColor: '#0a0a0a',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      width: '100%',
      boxSizing: 'border-box' as const
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <Link href="https://kuchikomi-karte.github.io" style={{
          color: '#c9a84c',
          fontSize: '18px',
          fontFamily: '"Noto Serif JP", serif',
          textDecoration: 'none',
          letterSpacing: '0.1em'
        }}>
          口コミ経営カルテ
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="https://reviews-karte-next.vercel.app/login" style={{
            border: '1px solid #c9a84c',
            color: '#c9a84c',
            padding: '8px 20px',
            textDecoration: 'none',
            fontSize: '13px',
            letterSpacing: '0.05em'
          }}>
            会員ログイン
          </Link>
          <Link href="https://kuchikomi-karte.github.io/#karte" style={{
            backgroundColor: '#c9a84c',
            color: '#0a0a0a',
            padding: '8px 20px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.05em'
          }}>
            無料診断を受ける
          </Link>
        </div>
      </div>
    </header>
  )
}
