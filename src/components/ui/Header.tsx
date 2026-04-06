'use client'

import { startTransition, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { USER_LOGIN_PATH, hasUserAuthConfig } from '@/lib/auth/user'
import styles from './Header.module.css'

type HeaderProps = {
  onLogout?: () => Promise<void> | void
}

export default function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isKarteActive = useMemo(() => pathname?.startsWith('/dashboard') ?? false, [pathname])

  const handleLogout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      if (onLogout) {
        await onLogout()
        return
      }

      if (hasUserAuthConfig()) {
        const supabase = createClientComponentClient()
        await supabase.auth.signOut()
      }

      startTransition(() => {
        router.push(USER_LOGIN_PATH)
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.row} ${styles.brandRow}`}>
        <div className={styles.brandGroup}>
          <span className={styles.brandPrefix}>ai×me lab</span>
          <span className={styles.brandSeparator}>|</span>
          <span className={styles.brandTitle}>黒川聖羅カルテ</span>
        </div>

        <nav aria-label="ユーザーメニュー" className={styles.actionGroup}>
          <Link className={styles.link} href="/dashboard/profile">
            プロフィール設定
          </Link>
          <button className={styles.button} onClick={handleLogout} type="button">
            {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
          </button>
        </nav>
      </div>

      <div className={`${styles.row} ${styles.navRow}`}>
        <nav aria-label="サービスナビゲーション" className={styles.serviceGroup}>
          <Link
            className={`${styles.serviceLink} ${isKarteActive ? styles.serviceLinkActive : ''}`}
            href="/dashboard"
          >
            口コミ経営カルテ
          </Link>
          <span className={styles.slash}>/</span>
          <span aria-disabled="true" className={styles.serviceDisabled}>
            口コミSNSカルテ
            <span className={styles.badge}>準備中</span>
          </span>
        </nav>

        <div className={styles.navRight}>
          <Link className={styles.consultation} href="/dashboard/consultation">
            経営相談
          </Link>
        </div>
      </div>
    </header>
  )
}
