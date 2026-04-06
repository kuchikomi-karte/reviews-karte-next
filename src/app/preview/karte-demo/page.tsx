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
    }}>
      {children}
    </span>
  )
}

export default function PreviewKarteDemoPage() {
  return (
    <PreviewShell activeItem="総評">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 総評カード */}
        <div id="section-souhy" style={{
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

        {/* 口コミ投稿分析 */}
        <div id="section-kuchikomi" style={CARD}>
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
              <div key={row.star} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#666', width: '26px', flexShrink: 0 }}>{row.star}</span>
                <div style={{ flex: 1, height: '6px', backgroundColor: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct}%`, height: '100%', backgroundColor: '#c9a84c', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#666', width: '22px', textAlign: 'right', flexShrink: 0 }}>{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 未返信の口コミ */}
        <div id="section-action" style={CARD}>
          <div style={CARD_HEADER}>
            <span style={CARD_TITLE}>未返信の口コミ</span>
            <Badge color="orange">3件</Badge>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <div style={{ color: '#c9a84c', fontSize: '14px', marginBottom: '6px' }}>★★★★</div>
            <p style={{ fontSize: '13px', color: '#c0bbb2', lineHeight: 1.8, marginBottom: '14px', letterSpacing: '0.04em' }}>
              スタッフの対応がとても丁寧でまた来たいと思いました
            </p>
            <div style={{
              backgroundColor: '#141414',
              border: '1px solid #282828',
              borderRadius: '8px',
              padding: '16px 18px',
            }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.18em', marginBottom: '8px' }}>返信例</p>
              <p style={{ fontSize: '13px', color: '#777', lineHeight: 1.8, letterSpacing: '0.03em' }}>
                この度はご来店いただきありがとうございます。スタッフの対応が伝わり大変嬉しく思います。またのご来店をお待ちしております。
              </p>
            </div>
          </div>
        </div>

        {/* 自覚症状 */}
        <div id="section-jikaku" style={CARD}>
          <div style={CARD_HEADER}>
            <span style={CARD_TITLE}>自覚症状</span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {[
              '土日の予約が2週間先まで埋まっており、新規顧客の取りこぼしが発生している',
              'スタッフ1名が育休中であり、施術対応キャパが通常比 −20%',
              'LINE予約のリマインドが機能しておらず、無断キャンセルが月3〜4件発生',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 20px',
                borderBottom: i < 2 ? '1px solid #1c1c1c' : 'none',
              }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid #2e2e2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#555',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.8, letterSpacing: '0.03em' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 処方箋 */}
        <div id="section-shohousen" style={CARD}>
          <div style={CARD_HEADER}>
            <span style={CARD_TITLE}>処方箋</span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {[
              { priority: '優先', highlight: true,  title: 'LINEリマインド自動化',      body: '予約2日前・当日朝の自動リマインドを設定。無断キャンセルを半減させ、実質稼働率を +5〜8% 改善。' },
              { priority: '推奨', highlight: false, title: '予約枠の再設計',             body: '平日昼の空き枠に「平日限定割引」を設定し、土日への集中を分散させる。' },
              { priority: '検討', highlight: false, title: '口コミ返信テンプレート整備', body: '待ち時間への言及がある口コミに対して改善策を実施中である旨を積極的に返信する。' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                padding: '16px 20px',
                borderBottom: i < 2 ? '1px solid #1c1c1c' : 'none',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: item.highlight ? '#c9a84c' : '#444',
                  border: `1px solid ${item.highlight ? 'rgba(201,168,76,0.4)' : '#2a2a2a'}`,
                  borderRadius: '4px',
                  padding: '2px 8px',
                  flexShrink: 0,
                  marginTop: '2px',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}>
                  {item.priority}
                </span>
                <div>
                  <p style={{ fontSize: '13px', color: '#c0bbb2', letterSpacing: '0.04em', marginBottom: '6px' }}>{item.title}</p>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.8, letterSpacing: '0.03em' }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PreviewShell>
  )
}
