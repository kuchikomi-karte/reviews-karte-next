'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

const SIDEBAR_NAV = [
  { label: '総評',       href: '/preview/karte-demo' },
  { label: '口コミ分析', href: '/preview/karte-demo' },
  { label: '自覚症状',   href: '/preview/karte-demo' },
  { label: '7要素診断',  href: '/preview/monshin' },
  { label: '処方箋',     href: '/preview/karte-demo' },
  { label: 'アクション', href: '/preview/karte-demo' },
]

const HISTORY = [
  { label: '2025年4月', href: '/preview/karte-demo' },
  { label: '2025年3月', href: '/preview/karte-demo' },
  { label: '2025年2月', href: '/preview/karte-demo' },
]

interface PreviewShellProps {
  children: ReactNode
  activeItem?: string
}

export default function PreviewShell({ children, activeItem }: PreviewShellProps) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#e0ddd6',
      fontFamily: 'Noto Sans JP, sans-serif',
    }}>
      {/* ── Header ─────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Row 1 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          height: '58px',
          backgroundColor: '#141414',
          borderBottom: '1px solid #222',
        }}>
          <Link href="/preview/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'Shippori Mincho, Noto Serif JP, serif',
              fontSize: '17px',
              fontWeight: 500,
              color: '#f0ebe0',
              letterSpacing: '0.1em',
              lineHeight: 1.15,
            }}>
              口コミ経営カルテ
            </div>
            <div style={{
              fontSize: '10px',
              color: '#444',
              letterSpacing: '0.25em',
              marginTop: '2px',
            }}>
              ai×me lab
            </div>
          </Link>

          {/* User badge */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1.5px solid #c9a84c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c9a84c',
            fontSize: '11px',
            fontFamily: 'Shippori Mincho, serif',
            letterSpacing: '0.05em',
            flexShrink: 0,
          }}>
            聖羅
          </div>
        </div>

        {/* Row 2 — Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          height: '38px',
          backgroundColor: '#141414',
          borderBottom: '1px solid #1c1c1c',
        }}>
          <Link href="/preview/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 18px',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: '#c9a84c',
            textDecoration: 'none',
            borderBottom: '2px solid #c9a84c',
            boxSizing: 'border-box',
          }}>
            口コミ経営カルテ
          </Link>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 18px',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: '#2e2e2e',
            cursor: 'default',
            userSelect: 'none',
          }}>
            口コミSNSカルテ
          </span>
        </div>
      </header>

      {/* ── Body ────────────────────────────────── */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'flex-start',
      }}>
        {/* Sidebar */}
        <aside style={{
          width: '180px',
          flexShrink: 0,
          padding: '24px 0',
          borderRight: '1px solid #1c1c1c',
          position: 'sticky',
          top: '96px',
          height: 'calc(100vh - 96px)',
          overflowY: 'auto',
        }}>
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: '#3a3a3a',
            padding: '0 20px',
            marginBottom: '6px',
          }}>
            カルテ内容
          </p>

          {SIDEBAR_NAV.map((item) => {
            const isActive = item.label === activeItem
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 20px',
                  borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                  fontSize: '13px',
                  color: isActive ? '#e8e2d4' : '#505050',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'rgba(201,168,76,0.05)' : 'transparent',
                  letterSpacing: '0.04em',
                  transition: 'color 0.15s',
                }}
              >
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#c9a84c' : '#282828',
                  flexShrink: 0,
                }} />
                {item.label}
              </Link>
            )
          })}

          <p style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: '#3a3a3a',
            padding: '16px 20px 6px',
            marginTop: '8px',
            borderTop: '1px solid #1c1c1c',
          }}>
            履歴
          </p>

          {HISTORY.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 20px',
                borderLeft: '2px solid transparent',
                fontSize: '12px',
                color: '#505050',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#282828',
                flexShrink: 0,
              }} />
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '28px 28px 64px', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
