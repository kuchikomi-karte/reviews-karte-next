'use client'

import Link from 'next/link'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <>
      <style>{`
        .header-inner {
          position: relative;
          z-index: 10;
          background-color: #0a0a0a;
          padding: 0 32px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .header-lab {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #888;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .header-divider {
          color: #444;
          font-size: 12px;
        }
        .header-title {
          font-family: 'Noto Serif JP', serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          color: #f5f0e8;
          font-weight: 400;
          white-space: nowrap;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .header-nav a, .header-nav button {
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #aaa;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
          padding: 0;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .header-inner {
            padding: 0 16px;
            height: 52px;
          }
          .header-lab, .header-divider {
            display: none;
          }
          .header-title {
            font-size: 13px;
          }
          .header-nav {
            gap: 14px;
          }
          .header-nav a, .header-nav button {
            font-size: 10px;
            letter-spacing: 0.05em;
          }
        }
      `}</style>

      <header className="header-inner">
        <div className="header-brand">
          <span className="header-lab">ai×me lab</span>
          <span className="header-divider">|</span>
          <span className="header-title">黒川聖羅カルテ</span>
        </div>
        <nav className="header-nav">
          <Link href="/dashboard/profile">プロフィール設定</Link>
          <Link href="/dashboard">口コミ経営カルテ</Link>
          <button onClick={onLogout}>ログアウト</button>
        </nav>
      </header>
    </>
  )
}
