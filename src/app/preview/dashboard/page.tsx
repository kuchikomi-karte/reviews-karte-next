import Link from 'next/link'
import PreviewShell from '@/components/preview/PreviewShell'

const CARD: React.CSSProperties = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #252525',
  borderRadius: '12px',
  overflow: 'hidden',
}

const CARD_HEADER: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  borderBottom: '1px solid #1e1e1e',
}

const CARD_TITLE: React.CSSProperties = {
  fontSize: '13px',
  color: '#e0ddd6',
  letterSpacing: '0.06em',
}

function Badge({ children, color = 'gold' }: { children: React.ReactNode; color?: 'gold' | 'orange' }) {
  const isOrange = color === 'orange'
  return (
    <span style={{
      fontSize: '11px',
      color: isOrange ? '#e07040' : '#c9a84c',
      backgroundColor: isOrange ? 'rgba(224,112,64,0.1)' : 'rgba(201,168,76,0.1)',
      border: `1px solid ${isOrange ? 'rgba(224,112,64,0.3)' : 'rgba(201,168,76,0.25)'}`,
      borderRadius: '20px',
      padding: '3px 10px',
      letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  )
}

export default function PreviewDashboardPage() {
  return (
    <PreviewShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 総評サマリーカード */}
        <div style={{
          ...CARD,
          padding: '24px',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1.5px solid #c9a84c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c9a84c',
            fontSize: '11px',
            fontFamily: 'Shippori Mincho, serif',
            flexShrink: 0,
          }}>
            聖羅
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#555', letterSpacing: '0.06em', marginBottom: '10px' }}>
              黒川聖羅 — 総評 / 2025年4月のカルテ
            </p>
            <p style={{ fontSize: '14px', color: '#e8e2d4', lineHeight: 1.9, letterSpacing: '0.04em' }}>
              口コミの平均評価は4.1ですが、★3以下が全体の23%を占めています。
              未返信が3件あり、これが新規顧客の信頼獲得を妨げている可能性があります。
              まず返信対応を優先してください。
            </p>
          </div>
        </div>

        {/* 2カラム：口コミ分析 + 小カード */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* 口コミ投稿分析 */}
          <div style={CARD}>
            <div style={CARD_HEADER}>
              <span style={CARD_TITLE}>口コミ投稿分析</span>
              <Badge>計42件</Badge>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {[
                { star: '★5', count: 18, pct: 70 },
                { star: '★4', count: 12, pct: 47 },
                { star: '★3', count: 7,  pct: 27 },
              ].map((row) => (
                <div key={row.star} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#666', width: '26px', flexShrink: 0 }}>{row.star}</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.pct}%`, height: '100%', backgroundColor: '#c9a84c', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#666', width: '20px', textAlign: 'right', flexShrink: 0 }}>{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右列 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...CARD, padding: '22px', flex: 1 }}>
              <p style={{ fontSize: '11px', color: '#555', letterSpacing: '0.08em', marginBottom: '12px' }}>未返信の口コミ</p>
              <p style={{ fontSize: '36px', color: '#c9a84c', fontFamily: 'Shippori Mincho, serif', lineHeight: 1 }}>
                3<span style={{ fontSize: '14px', color: '#555', marginLeft: '6px' }}>件</span>
              </p>
            </div>
            <div style={{ ...CARD, padding: '22px', flex: 1 }}>
              <p style={{ fontSize: '11px', color: '#555', letterSpacing: '0.08em', marginBottom: '10px' }}>今月の改善ポイント</p>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.8, letterSpacing: '0.03em' }}>
                待ち時間への言及が前月比+4件。予約枠の分散と返信テンプレート整備を推奨。
              </p>
            </div>
          </div>
        </div>

        {/* カルテ履歴 */}
        <div style={CARD}>
          <div style={CARD_HEADER}>
            <span style={CARD_TITLE}>カルテ履歴</span>
          </div>
          {[
            { title: '2025年4月のカルテ', period: '2025年4月1日〜4月30日', date: '2025/04/28' },
            { title: '2025年3月のカルテ', period: '2025年3月1日〜3月31日', date: '2025/03/31' },
            { title: '2025年2月のカルテ', period: '2025年2月1日〜2月28日', date: '2025/02/28' },
          ].map((karte, i) => (
            <Link
              key={karte.title}
              href="/preview/karte-demo"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i < 2 ? '1px solid #1c1c1c' : 'none',
                textDecoration: 'none',
              }}
            >
              <div>
                <p style={{ fontSize: '13px', color: '#e0ddd6', letterSpacing: '0.06em', marginBottom: '4px' }}>{karte.title}</p>
                <p style={{ fontSize: '11px', color: '#444', letterSpacing: '0.04em' }}>{karte.period}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#444' }}>{karte.date}</span>
                <span style={{
                  fontSize: '11px',
                  color: '#c9a84c',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '4px',
                  padding: '4px 14px',
                  letterSpacing: '0.06em',
                }}>
                  閲覧
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PreviewShell>
  )
}
