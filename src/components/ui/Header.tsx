'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '54px',
        zIndex: 1000,
        background: 'rgba(26,26,26,0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(201,165,90,0.16)',
        boxSizing: 'border-box' as const,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          height: '54px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Link
          href="https://kuchikomi-karte.github.io"
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: '13px',
            letterSpacing: '0.08em',
            color: '#c9a55a',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          口コミ経営カルテ
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/register"
            style={{
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: '#c9a55a',
              textDecoration: 'none',
              border: '1px solid rgba(201,165,90,0.5)',
              padding: '6px 16px',
              whiteSpace: 'nowrap',
            }}
          >
            新規登録
          </Link>
          <Link
            href="https://kuchikomi-karte.github.io/#karte"
            style={{
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: '#0a0a0a',
              textDecoration: 'none',
              backgroundColor: '#c9a55a',
              padding: '6px 16px',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >
            無料診断を受ける
          </Link>
        </div>
      </div>
    </header>
  )
}
