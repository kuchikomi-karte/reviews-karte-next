import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import KarteNav from '@/components/karte/KarteNav'
import Header from '@/components/ui/Header'
import {
  KarteAccessError,
  fetchPreparedDriveHtml,
  getPublishedKarteByIdForUser,
} from '@/lib/server/karte-drive'

export const dynamic = 'force-dynamic'

const CONTENT_STYLES = `
  .kk-karte-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f5f0e8 0%, #fbf8f2 180px, #ffffff 180px, #ffffff 100%);
  }

  .kk-karte-content-wrap {
    padding: 36px 24px 88px;
  }

  .kk-karte-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 32px 56px;
    background: #fff;
    border: 0.5px solid #ddd5c8;
    border-radius: 16px;
    box-shadow: 0 18px 60px rgba(10, 10, 10, 0.06);
  }

  .kk-karte-content [id] {
    scroll-margin-top: 144px;
  }

  .kk-karte-content h1,
  .kk-karte-content h2,
  .kk-karte-content h3 {
    color: #0a0a0a;
    font-family: var(--font-noto-serif-jp), serif;
    font-weight: 500;
    letter-spacing: 0.08em;
    line-height: 1.6;
  }

  .kk-karte-content h1 {
    margin: 0 0 24px;
    font-size: 30px;
  }

  .kk-karte-content h2 {
    margin: 56px 0 16px;
    padding-top: 8px;
    border-top: 1px solid #f0e7d2;
    font-size: 22px;
  }

  .kk-karte-content h3 {
    margin: 28px 0 12px;
    font-size: 18px;
  }

  .kk-karte-content p,
  .kk-karte-content li,
  .kk-karte-content td,
  .kk-karte-content th,
  .kk-karte-content blockquote {
    color: #242424;
    font-family: var(--font-noto-sans-jp), sans-serif;
    font-size: 14px;
    line-height: 2;
    letter-spacing: 0.03em;
  }

  .kk-karte-content ul,
  .kk-karte-content ol {
    padding-left: 1.4em;
  }

  .kk-karte-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 32px;
  }

  .kk-karte-content th,
  .kk-karte-content td {
    padding: 12px 14px;
    border: 0.5px solid #e6ddcf;
    vertical-align: top;
  }

  .kk-karte-content th {
    background: #faf6ee;
    color: #5b4c22;
    font-weight: 500;
  }

  .kk-karte-content img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 20px auto;
  }

  .kk-karte-content a {
    color: #8e7130;
  }

  .kk-karte-footer {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px 40px;
    color: #7a746a;
    font-family: var(--font-noto-sans-jp), sans-serif;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-align: center;
  }

  @media (max-width: 768px) {
    .kk-karte-content-wrap {
      padding: 20px 12px 56px;
    }

    .kk-karte-content {
      padding: 24px 18px 40px;
      border-radius: 12px;
    }

    .kk-karte-content h1 {
      font-size: 24px;
    }

    .kk-karte-content h2 {
      font-size: 19px;
      margin-top: 42px;
    }

    .kk-karte-content p,
    .kk-karte-content li,
    .kk-karte-content td,
    .kk-karte-content th,
    .kk-karte-content blockquote {
      font-size: 13px;
    }
  }
`

type KartePageProps = {
  params: Promise<{ karteId: string }>
}

function renderErrorPage(message: string) {
  return (
    <div className="kk-karte-page">
      <style>{CONTENT_STYLES}</style>
      <Header />
      <main className="kk-karte-content-wrap">
        <div className="kk-karte-content" style={{ textAlign: 'center' }}>
          <h1>カルテを表示できません</h1>
          <p>{message}</p>
        </div>
      </main>
    </div>
  )
}

export default async function KarteDetailPage({ params }: KartePageProps) {
  const { karteId } = await params
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return renderErrorPage('ログイン状態を確認できませんでした。')
  }

  let html = ''

  try {
    const karte = await getPublishedKarteByIdForUser(supabase, user.id, karteId)
    html = await fetchPreparedDriveHtml(karte.file_id)
  } catch (error) {
    if (error instanceof KarteAccessError) {
      return renderErrorPage(error.message)
    }

    console.error('Karte detail page error:', error)
    return renderErrorPage('しばらくしてから再度お試しください。')
  }

  return (
    <div className="kk-karte-page">
      <style>{CONTENT_STYLES}</style>
      <Header />
      <KarteNav />

      <main className="kk-karte-content-wrap">
        <div className="kk-karte-content" dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <footer className="kk-karte-footer">© ai×me lab / 黒川聖羅カルテ</footer>
    </div>
  )
}
