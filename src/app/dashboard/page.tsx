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

        {/* 店舗情報カード */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            登録済みの店舗情報
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 min-w-[100px]">
                美容室 NECESSARY
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                業種: 美容室
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://search.google.com/local"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                🔍 Google口コミを開く
              </a>
              <span className="text-sm text-zinc-400">→</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://beauty.hotpepper.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                🔗 その他口コミサイトを開く
              </a>
              <span className="text-sm text-zinc-400">→</span>
            </div>
          </div>

          {/* 黒川聖羅の明言テーブル */}
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <div className="flex justify-end">
              <table className="text-left border-collapse">
                <tbody>
                  <tr>
                    <td className="py-3 px-4 align-top">
                      <p className="text-base leading-relaxed text-zinc-900 dark:text-zinc-50 mb-2">
                        口コミは、お客様からの経営レポート。<br />
                        データを読まない経営者は、勘で戦っている。<br />
                        返信の質が、店の格を決める。
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        ── 黒川 聖羅
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
