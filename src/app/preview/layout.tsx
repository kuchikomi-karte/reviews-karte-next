// デザイン確認専用レイアウト。認証不要。本番導線とは無関係。
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Preview | 口コミ経営カルテ',
  robots: 'noindex,nofollow',
}

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
