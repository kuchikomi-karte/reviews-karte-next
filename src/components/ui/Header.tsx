'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname()

  const products = [
    {
      label: '口コミ経営カルテ',
      href: '/dashboard',
      active: true,        // 現在唯一のアクティブサービス
      available: true,
    },
    {
      label: '口コミSNSカルテ',
      href: null,
      active: false,
      available: false,    // 将来実装
    },
  ]

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
      {/* 左側：ブランド名 ＋ 商品ナビ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {/* ブランドロゴ部分 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '40px' }}>
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#888888',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontWeight: 400
          }}>
            ai×me lab
          </span>
          <span style={{
            fontSize: '11px',
            letterSpacing: '0.05em',
            color: '#888888',
            fontFamily: 'Noto Sans JP, sans-serif',
          }}>|</span>
          <span style={{
            fontSize: '16px',
            letterSpacing: '0.15em',
            color: '#f5f0e8',
            fontFamily: 'Shippori Mincho, Noto Serif JP, serif',
            fontWeight: 400
          }}>
            黒川聖羅カルテ
          </span>
        </div>

        {/* 商品ナビ：口コミ経営カルテ / 口コミSNSカルテ */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          {products.map((product) => {
            const isCurrentPage = pathname?.startsWith('/dashboard') && product.href === '/dashboard'

            if (product.available && product.href) {
              return (
                <Link
                  key={product.label}
                  href={product.href}
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    color: isCurrentPage ? '#c9a84c' : '#cccccc',
                    textDecoration: 'none',
                    fontFamily: 'Noto Sans JP, sans-serif',
                    padding: '0 20px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: isCurrentPage ? '2px solid #c9a84c' : '2px solid transparent',
                    boxSizing: 'border-box',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  {product.label}
                </Link>
              )
            } else {
              return (
                <span
                  key={product.label}
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    color: '#444444',
                    fontFamily: 'Noto Sans JP, sans-serif',
                    padding: '0 20px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '2px solid transparent',
                    boxSizing: 'border-box',
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                >
                  {product.label}
                  <span style={{
                    fontSize: '9px',
                    color: '#444444',
                    marginLeft: '6px',
                    fontFamily: 'Noto Sans JP, sans-serif',
                    letterSpacing: '0.05em'
                  }}>準備中</span>
                </span>
              )
            }
          })}
        </nav>
      </div>

      {/* 右側：プロフィール設定 ＋ ログアウト */}
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
