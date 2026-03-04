'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function KartePage() {
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
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            カルテ確認
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              📊
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            月次黒川診断レポート
          </h2>
          <p className="mb-8 max-w-md text-zinc-600 dark:text-zinc-400">
            現在、診断レポートはまだ作成されていません。<br />
            初回の診断レポートは、サービス開始から1ヶ月後に作成されます。
          </p>
          <div className="mx-auto max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              診断レポートの内容
            </h3>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>数値データの分析（前月比較）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>傾向分析（季節性・構造的課題）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>黒川の所見（構造的課題）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>具体的なアクション提案（1〜3個）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>今後の予測（次月の傾向）</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
            <p>診断レポートは毎月1日〜5日に作成されます。</p>
            <p className="mt-2">ご不明な点があれば、<Link href="/dashboard/consultation" className="font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300">問い合わせ・相談</Link>からお問い合わせください。</p>
          </div>
        </div>
      </main>
    </div>
  )
}
