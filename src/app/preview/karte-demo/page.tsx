import PreviewShell from '@/components/preview/PreviewShell'

/* ── セクションヘッダースタイル ─────────────── */
const SEC_HD: React.CSSProperties = {
  background: '#0a0a0a',
  padding: '10px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '10px 10px 0 0',
}

const SEC_TITLE: React.CSSProperties = {
  fontSize: '12px',
  color: '#c9a84c',
  fontWeight: 500,
  letterSpacing: '0.08em',
  fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
}

const SEC_BODY: React.CSSProperties = {
  background: '#ffffff',
  border: '0.5px solid #ddd5c8',
  borderTop: 'none',
  borderRadius: '0 0 10px 10px',
  padding: '20px',
}

function SecBadge({ children, red }: { children: React.ReactNode; red?: boolean }) {
  return (
    <span style={{
      fontSize: '10px',
      padding: '2px 10px',
      background: red ? 'rgba(226,68,26,0.1)' : 'rgba(201,168,76,0.15)',
      border: `0.5px solid ${red ? 'rgba(201,64,15,0.4)' : 'rgba(201,168,76,0.35)'}`,
      color: red ? '#c9400f' : '#c9a84c',
      borderRadius: '20px',
    }}>
      {children}
    </span>
  )
}

export default function PreviewKarteDemoPage() {
  return (
    <PreviewShell activeItem="総評" showKarteMenu>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── 総評 HERO ─────────────────────────────────── */}
        <div id="section-souhy" style={{
          background: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'flex-end',
          borderRadius: '10px',
        }}>
          {/* 黒川聖羅 人物画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/seira.png"
            alt="黒川聖羅"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              height: '100%',
              maxHeight: '320px',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom right',
              opacity: 0.92,
            }}
          />

          {/* テキストコンテンツ */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '40px 32px 36px',
            maxWidth: '580px',
          }}>
            <p style={{
              fontSize: '10px',
              color: '#c9a84c',
              letterSpacing: '0.12em',
              marginBottom: '8px',
            }}>
              2025年4月 診断
            </p>
            <h2 style={{
              fontSize: '24px',
              color: '#e8e0d0',
              fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
              marginBottom: '16px',
              letterSpacing: '0.08em',
            }}>
              黒川サロン
            </h2>
            <p style={{
              fontSize: '9px',
              color: '#c9a84c',
              letterSpacing: '0.12em',
              marginBottom: '6px',
            }}>
              黒川聖羅 より
            </p>
            <p style={{
              fontSize: '13px',
              color: '#c8bfb0',
              lineHeight: 1.8,
              fontFamily: 'var(--font-noto-serif-jp), Noto Serif JP, serif',
            }}>
              口コミの平均評価は4.1ですが、★3以下が全体の23%を占めています。
              未返信が3件あり、これが新規顧客の信頼獲得を妨げている可能性があります。
              まず返信対応を優先してください。
            </p>
          </div>
        </div>

        {/* ── 口コミ投稿分析 ──────────────────────────── */}
        <div id="section-kuchikomi" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <div style={SEC_HD}>
            <span style={SEC_TITLE}>口コミ投稿分析</span>
            <SecBadge>計42件</SecBadge>
          </div>
          <div style={SEC_BODY}>
            {[
              { star: '★5', count: 18, pct: 70 },
              { star: '★4', count: 12, pct: 47 },
              { star: '★3', count: 7,  pct: 27 },
            ].map((row) => (
              <div key={row.star} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#666', width: '26px', flexShrink: 0 }}>{row.star}</span>
                <div style={{ flex: 1, height: '6px', backgroundColor: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct}%`, height: '100%', backgroundColor: '#c9a84c', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#666', width: '22px', textAlign: 'right', flexShrink: 0 }}>{row.count}</span>
              </div>
            ))}
          </div>
          {/* 黒川聖羅の考察ブロック */}
          <div style={{
            background: '#0a0a0a',
            borderRadius: '10px',
            padding: '16px 18px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
            marginTop: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '0.5px solid rgba(201,168,76,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: '#c9a84c',
              fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
              flexShrink: 0,
            }}>
              聖羅
            </div>
            <div>
              <p style={{ fontSize: '9px', color: '#c9a84c', letterSpacing: '0.1em', marginBottom: '5px' }}>
                黒川聖羅 の考察
              </p>
              <p style={{
                fontSize: '12px',
                color: '#c0b8a8',
                lineHeight: 1.8,
                fontFamily: 'var(--font-noto-serif-jp), Noto Serif JP, serif',
              }}>
                ★5と★3以下の二極化が顕著です。高評価の要因（スタッフ対応・技術力）を強化しつつ、
                低評価の共通ワード「待ち時間」への対応が急務です。返信で改善姿勢を示すことが信頼回復の第一歩です。
              </p>
            </div>
          </div>
        </div>

        {/* ── 未返信の口コミ ─────────────────────────── */}
        <div id="section-action" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <div style={SEC_HD}>
            <span style={SEC_TITLE}>未返信の口コミ</span>
            <SecBadge red>3件</SecBadge>
          </div>
          <div style={SEC_BODY}>
            {[
              {
                stars: '★★★★',
                text: 'スタッフの対応がとても丁寧でまた来たいと思いました',
                reply: 'この度はご来店いただきありがとうございます。スタッフの対応が伝わり大変嬉しく思います。またのご来店をお待ちしております。',
              },
              {
                stars: '★★★',
                text: '待ち時間が長かったですが施術自体は満足でした',
                reply: 'ご来店ありがとうございます。お待たせしてしまい申し訳ございませんでした。予約管理を改善し、より快適にご利用いただけるよう努めてまいります。',
              },
            ].map((review, i) => (
              <div key={i} style={{ marginBottom: i < 1 ? '20px' : 0, paddingBottom: i < 1 ? '20px' : 0, borderBottom: i < 1 ? '0.5px solid #e8e0d0' : 'none' }}>
                <div style={{ color: '#c9a84c', fontSize: '14px', marginBottom: '6px' }}>{review.stars}</div>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, marginBottom: '8px', letterSpacing: '0.04em' }}>
                  {review.text}
                </p>
                {/* 返信例ブロック */}
                <div style={{
                  background: '#f5f0e8',
                  borderLeft: '2px solid #c9a84c',
                  padding: '10px 14px',
                }}>
                  <p style={{ fontSize: '9px', color: '#c9a84c', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    返信例
                  </p>
                  <p style={{ fontSize: '12px', color: '#1a1a1a', lineHeight: 1.75 }}>
                    {review.reply}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 自覚症状 ────────────────────────────────── */}
        <div id="section-jikaku" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <div style={SEC_HD}>
            <span style={SEC_TITLE}>自覚症状</span>
          </div>
          <div style={{ ...SEC_BODY, padding: '4px 0' }}>
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
                borderBottom: i < 2 ? '0.5px solid #e8e0d0' : 'none',
              }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid #ddd5c8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#888',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, letterSpacing: '0.03em' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 処方箋 ──────────────────────────────────── */}
        <div id="section-shohousen" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <div style={SEC_HD}>
            <span style={SEC_TITLE}>処方箋</span>
          </div>
          <div style={{ ...SEC_BODY, padding: '4px 0' }}>
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
                borderBottom: i < 2 ? '0.5px solid #e8e0d0' : 'none',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: item.highlight ? '#c9a84c' : '#888',
                  border: `0.5px solid ${item.highlight ? 'rgba(201,168,76,0.4)' : '#ddd5c8'}`,
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
                  <p style={{ fontSize: '13px', color: '#1a1a1a', letterSpacing: '0.04em', marginBottom: '6px' }}>{item.title}</p>
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
