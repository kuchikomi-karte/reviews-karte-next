import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-8 py-16 sm:px-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
            口コミ経営カルテ
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            美容サロンの口コミを冷静に分析。構造から斬ります。<br />
            月次レポートでサロン経営を改善します。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-8 text-zinc-50 transition-colors hover:bg-zinc-800 sm:w-auto"
            >
              ログイン
            </Link>
            <Link
              href="/api/checkout"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-zinc-300 px-8 transition-colors hover:border-zinc-400 hover:bg-zinc-100 sm:w-auto"
            >
              料金プラン
            </Link>
          </div>
          <div className="mt-8 max-w-lg text-sm text-zinc-500 dark:text-zinc-400">
            <p className="mb-2">月額9,800円（モニター価格・3ヶ月限定）</p>
            <p>月次黒川診断レポート・口コミ返信案生成・問い合わせ相談</p>
          </div>
        </div>
      </main>
    </div>
  )
}
