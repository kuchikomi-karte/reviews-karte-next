'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8' }}>
      <header style={{
        backgroundColor: '#0a0a0a',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#888888', margin: 0 }}>ai×me lab</p>
          <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '18px', fontWeight: 400, letterSpacing: '0.2em', color: '#ffffff', margin: '4px 0 0 0' }}>口コミ経営カルテ</h1>
        </Link>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '32px', fontWeight: 400, color: '#0a0a0a', margin: '0 0 8px 0', letterSpacing: '0.1em' }}>
          プライバシーポリシー
        </h2>
        <p style={{ fontSize: '14px', color: '#888888', marginBottom: '48px', letterSpacing: '0.05em' }}>
          制定日: 2026年○月○日
        </p>

        <article style={{ fontFamily: 'Noto Sans JP, sans-serif', fontSize: '14px', lineHeight: '2', color: '#333333' }}>
          <p style={{ marginBottom: '32px', margin: 0 }}>
            運営: ai×me lab
          </p>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>1. 収集する情報</h3>
            <p style={{ margin: 0 }}>
              氏名・メールアドレス・店舗名・Google Place ID・口コミURL
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>2. 利用目的</h3>
            <p style={{ margin: 0 }}>
              サービス提供、口コミ分析レポートの作成、経営相談への回答、サービス改善
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>3. 第三者提供</h3>
            <p style={{ margin: 0 }}>
              法令に基づく場合を除き、お客様の情報を第三者に提供しません。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>4. 情報管理</h3>
            <p style={{ margin: 0 }}>
              収集した情報はSupabase（クラウドデータベース）にて安全に管理します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>5. お問い合わせ</h3>
            <p style={{ margin: 0 }}>
              kuchikomi.karte@gmail.com
            </p>
          </section>
        </article>

        <footer style={{ marginTop: '64px', borderTop: '1px solid #d4c9b0', paddingTop: '24px', fontSize: '12px', color: '#888888' }}>
          <p style={{ margin: '0 0 12px 0', letterSpacing: '0.1em' }}>ai×me lab</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/terms" style={{ color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.05em' }}>
              利用規約はこちら
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
