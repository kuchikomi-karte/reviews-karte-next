'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">読み込み中...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            口コミ経営カルテ
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="rounded-md px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          ダッシュボード
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/consultation"
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              問い合わせ・相談
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              黒川聖羅に経営に関する相談をしましょう
            </p>
          </Link>

          <Link
            href="/dashboard/reviews"
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              口コミ返信案生成
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              GoogleやHotPepperの口コミに返信案を生成
            </p>
          </Link>

          <Link
            href="/dashboard/karte"
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              カルテ確認
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              月次黒川診断レポートを確認
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
