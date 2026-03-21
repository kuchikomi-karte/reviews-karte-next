'use client'

import Link from 'next/link'

export default function TermsPage() {
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
          利用規約
        </h2>
        <p style={{ fontSize: '14px', color: '#888888', marginBottom: '48px', letterSpacing: '0.05em' }}>
          2026年○月○日施行
        </p>

        <article style={{ fontFamily: 'Noto Sans JP, sans-serif', fontSize: '14px', lineHeight: '2', color: '#333333' }}>
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第1条（定義）</h3>
            <p style={{ margin: 0 }}>
              本規約における「本サービス」とは、ai×me labが提供する口コミ経営カルテ（美容サロン向け口コミ管理・経営支援サービス）を指します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第2条（利用条件）</h3>
            <p style={{ margin: 0 }}>
              本サービスをご利用いただくには、本規約およびプライバシーポリシーへの同意が必要です。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第3条（サービス内容）</h3>
            <p style={{ margin: 0 }}>
              本サービスは以下を提供します。
            </p>
            <ul style={{ marginTop: '12px', marginBottom: 0, paddingLeft: '24px' }}>
              <li>Googleマップ等の口コミに対するAI返信案の提案（月20件まで）</li>
              <li>週次・月次の口コミ分析レポート</li>
              <li>テキストチャット形式による経営相談</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第4条（免責事項・保証の否定）【最重要】</h3>
            <p style={{ margin: 0 }}>
              本サービスは口コミ返信案の提案および経営アドバイスを行うものであり、集客数・売上・利益等の経営成果を一切保証しません。提供する返信文・アドバイスは参考情報であり、経営判断はお客様ご自身の責任において行っていただきます。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第5条（料金・決済）</h3>
            <p style={{ margin: 0 }}>
              月額料金はサービス内に表示する金額（税込）とし、Stripeによる自動課金にて毎月お支払いいただきます。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第6条（解約・返金）</h3>
            <p style={{ margin: 0 }}>
              解約は月末までにお申し出いただいた場合、翌月末をもってサービスを終了します。すでにお支払いいただいた月の料金は原則として返金いたしません。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第7条（情報管理・著作権）</h3>
            <p style={{ margin: 0 }}>
              お客様よりご提供いただいた口コミ情報はサービス提供目的にのみ使用します。本サービスが作成した返信文の著作権はお客様に帰属します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第8条（禁止事項）</h3>
            <p style={{ margin: 0 }}>
              不正アクセス、虚偽情報の登録、サービスの第三者への転売・共有を禁止します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第9条（サービスの変更・終了）</h3>
            <p style={{ margin: 0 }}>
              当社は事前通知のうえ、サービス内容の変更または終了を行う場合があります。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 400, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.1em' }}>第10条（準拠法・管轄）</h3>
            <p style={{ margin: 0 }}>
              本規約は日本法に準拠し、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>
        </article>

        <footer style={{ marginTop: '64px', borderTop: '1px solid #d4c9b0', paddingTop: '24px', fontSize: '12px', color: '#888888' }}>
          <p style={{ margin: '0 0 12px 0', letterSpacing: '0.1em' }}>ai×me lab</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" style={{ color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.05em' }}>
              プライバシーポリシーはこちら
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
