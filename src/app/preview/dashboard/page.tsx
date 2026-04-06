// デザイン確認専用ページ。認証不要・モックデータのみ使用。
// 本番コード（/dashboard）には影響しません。
import Link from 'next/link'
import Header from '@/components/ui/Header'

const MOCK_KARTE = [
  { id: 'mock-1', title: '2025年4月のカルテ', period: '2025年4月1日〜4月30日', created_at: '2025-04-28T10:00:00Z' },
  { id: 'mock-2', title: '2025年3月のカルテ', period: '2025年3月1日〜3月31日', created_at: '2025-03-31T10:00:00Z' },
  { id: 'mock-3', title: '2025年2月のカルテ', period: '2025年2月1日〜2月28日', created_at: '2025-02-28T10:00:00Z' },
]

export default function PreviewDashboardPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8' }}>
      <Header />

      <main style={{ padding: '48px', boxSizing: 'border-box', maxWidth: '960px', margin: '0 auto' }}>
        {/* ページタイトル */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '28px',
            fontWeight: 400,
            letterSpacing: '0.1em',
            color: '#0a0a0a',
            marginBottom: '16px',
          }}>
            黒川様 のカルテ
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{
              padding: '6px 16px',
              border: '1px solid #0a0a0a',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#0a0a0a',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}>
              プレミアムプラン
            </span>
          </div>

          {/* 店舗カード */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '40px',
            marginBottom: '40px',
          }}>
            <div style={{
              padding: '24px 28px',
              border: '1px solid #ddd8ce',
              width: '50%',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#888', fontFamily: 'Noto Sans JP, sans-serif', marginBottom: '12px' }}>
                登録済みの店舗情報
              </div>
              <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '18px', color: '#0a0a0a', marginBottom: '8px' }}>
                サンプルヘアサロン 表参道店
              </p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px', fontFamily: 'Noto Sans JP, sans-serif' }}>
                業種: ヘアサロン
              </p>
              <span style={{
                display: 'inline-block',
                padding: '10px 24px',
                backgroundColor: '#c9a84c',
                color: '#0a0a0a',
                fontSize: '12px',
                letterSpacing: '0.1em',
                fontFamily: 'Noto Sans JP, sans-serif',
              }}>
                店舗情報の変更
              </span>
            </div>

            <div style={{ flex: 1, borderLeft: '3px solid #c9a84c', paddingLeft: '32px', paddingTop: '8px' }}>
              <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '13px', fontWeight: 700, lineHeight: 2, letterSpacing: '0.08em', color: '#0a0a0a', marginBottom: '8px' }}>
                口コミの状況を客観的に見て、次に集中すべきポイントを明確にする。
              </p>
              <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '13px', fontWeight: 700, lineHeight: 2, color: '#0a0a0a', marginBottom: '4px' }}>
                返信案・週次書類・店舗情報の 3 つを同じ画面で捉えるように設計しています。
              </p>
              <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#c9a84c', fontWeight: 700 }}>―― 黒川聖羅</p>
            </div>
          </div>

          {/* メニューグリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '48px' }}>
            {[
              { title: 'AI口コミ返信案', desc: '口コミ本文から返信案の下書きを生成します。', status: 'プレミアム利用中', active: true },
              { title: '週次レポート', desc: '今週の口コミ傾向と改善ポイントを確認します。', status: '利用可能', active: true },
              { title: '月次レポート', desc: '月間の口コミデータを分析したレポートです。', status: '利用可能', active: true },
              { title: '経営相談', desc: '担当上長への相談内容を送信し処理メモを確認します。', status: '相談状況を確認', active: false },
            ].map((item) => (
              <div key={item.title} style={{
                padding: '32px',
                border: '1px solid #ddd8ce',
                minHeight: '160px',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
              }}>
                <h3 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '16px', fontWeight: 500, letterSpacing: '0.1em', color: '#0a0a0a', marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.8, marginBottom: '12px', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  {item.desc}
                </p>
                <p style={{ fontSize: '11px', fontFamily: 'Noto Sans JP, sans-serif', color: item.active ? '#c9a84c' : '#888' }}>
                  {item.status}
                </p>
              </div>
            ))}
          </div>

          {/* カルテ履歴 */}
          <h2 style={{
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.12em',
            color: '#0a0a0a',
            marginBottom: '20px',
          }}>
            カルテ履歴
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {MOCK_KARTE.map((karte) => (
              <div key={karte.id} style={{
                backgroundColor: '#fff',
                border: '0.5px solid #ddd5c8',
                borderRadius: '10px',
                padding: '24px',
                boxSizing: 'border-box',
              }}>
                <p style={{ fontSize: '15px', fontFamily: 'Noto Serif JP, serif', color: '#0a0a0a', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  {karte.title}
                </p>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  対象期間: {karte.period}
                </p>
                <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '20px', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  診断日: {new Date(karte.created_at).toLocaleDateString('ja-JP')}
                </p>
                <Link href="/preview/karte-demo" style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  color: '#c9a84c',
                  textDecoration: 'none',
                  border: '0.5px solid #c9a84c',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}>
                  カルテを閲覧
                </Link>
              </div>
            ))}
          </div>

          {/* 確認用リンク集 */}
          <div style={{ marginTop: '48px', padding: '20px 24px', backgroundColor: '#f0e8d8', borderRadius: '8px', border: '0.5px solid #ddd5c8' }}>
            <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif', marginBottom: '12px' }}>
              ▼ 他のプレビューページ
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/preview/monshin" style={{ fontSize: '13px', color: '#c9a84c', fontFamily: 'Noto Sans JP, sans-serif' }}>自己問診フォーム →</Link>
              <Link href="/preview/karte-demo" style={{ fontSize: '13px', color: '#c9a84c', fontFamily: 'Noto Sans JP, sans-serif' }}>カルテ詳細レイアウト →</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
