'use client'

import { startTransition, useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { USER_LOGIN_PATH, hasUserAuthConfig } from '@/lib/auth/user'
import { USER_AVATAR_UPDATED_EVENT, getStoredUserAvatar } from '@/lib/user-avatar'
import styles from './Header.module.css'

type HeaderProps = {
  onLogout?: () => Promise<void> | void
}

export default function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  const isKarteActive = useMemo(() => pathname?.startsWith('/dashboard') ?? false, [pathname])

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
          <Link className={styles.profileLink} href="/dashboard/profile">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="ユーザーアイコン" className={styles.avatar} src={avatarUrl} />
            ) : (
              <span aria-hidden="true" className={styles.avatarFallback}>
                人
              </span>
            )}
            <span className={styles.link}>プロフィール設定</span>
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
