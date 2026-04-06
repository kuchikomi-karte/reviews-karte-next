// デザイン確認専用ページ。認証不要・Drive API未使用・固定HTMLサンプル使用。
// 本番コード（/dashboard/karte/[karteId]）には影響しません。
import Header from '@/components/ui/Header'
import KarteNav from '@/components/karte/KarteNav'
import Link from 'next/link'

const MOCK_HTML = `
<h1>2025年4月 口コミ経営カルテ</h1>
<p style="font-size:12px;color:#888;margin-bottom:40px;">診断日：2025年4月28日　　対象店舗：サンプルヘアサロン 表参道店</p>

<h2 id="section-souhy">総評</h2>
<p>
  4月の口コミ傾向を総合すると、技術面への評価は引き続き高水準を維持しています。
  一方で「待ち時間」に関するネガティブワードが前月比1.8倍に増加しており、
  予約枠の逼迫が顧客体験に影響を与え始めているサインと読み取れます。
</p>
<p>
  総合スコア：<strong>4.3 / 5.0</strong>（前月比 +0.1）<br/>
  口コミ件数：<strong>38件</strong>（前月比 +4件）
</p>

<h2 id="section-kuchikomi">口コミ分析</h2>
<h3>ポジティブワード Top5</h3>
<table>
  <thead><tr><th>キーワード</th><th>出現回数</th><th>前月比</th></tr></thead>
  <tbody>
    <tr><td>丁寧</td><td>18</td><td>+3</td></tr>
    <tr><td>仕上がり</td><td>15</td><td>+2</td></tr>
    <tr><td>スタッフ</td><td>13</td><td>±0</td></tr>
    <tr><td>おすすめ</td><td>11</td><td>+1</td></tr>
    <tr><td>また来たい</td><td>9</td><td>+2</td></tr>
  </tbody>
</table>

<h3>ネガティブワード Top3</h3>
<table>
  <thead><tr><th>キーワード</th><th>出現回数</th><th>前月比</th></tr></thead>
  <tbody>
    <tr><td>待ち時間</td><td>7</td><td style="color:#c0392b">+4</td></tr>
    <tr><td>混んでいる</td><td>4</td><td style="color:#c0392b">+2</td></tr>
    <tr><td>値段</td><td>2</td><td>±0</td></tr>
  </tbody>
</table>

<h2 id="section-jikaku">自覚症状</h2>
<p>
  今月のヒアリングで確認された経営者の自覚症状は以下のとおりです。
</p>
<ul>
  <li>土日の予約が2週間先まで埋まっており、新規顧客の取りこぼしが発生している</li>
  <li>スタッフ1名が育休中であり、施術対応キャパが通常比 −20%</li>
  <li>LINE予約のリマインドが機能しておらず、無断キャンセルが月3〜4件発生</li>
</ul>

<h2 id="section-monshin">自己問診</h2>
<p>
  今月の問診回答から抽出した経営課題の核心は<strong>「稼働率の最大化と顧客体験品質の両立」</strong>です。
  予約の逼迫を「良い問題」と捉える一方で、待ち時間の増加が5つ星評価を4つ星に変える
  潜在リスクであることを認識する必要があります。
</p>

<h2 id="section-shohousen">処方箋</h2>
<p>以下3つの施策を優先度順に提示します。</p>
<ol>
  <li>
    <strong>LINEリマインド自動化（優先度：高）</strong><br/>
    予約2日前・当日朝の自動リマインドを設定。月3〜4件の無断キャンセルを半減させることで
    実質稼働率を +5〜8% 改善できる試算。
  </li>
  <li>
    <strong>予約枠の再設計（優先度：中）</strong><br/>
    平日昼の空き枠に対して「平日限定割引」を設定し、土日の集中を分散させる。
  </li>
  <li>
    <strong>口コミへの返信テンプレート整備（優先度：低〜中）</strong><br/>
    待ち時間への言及がある口コミに対して「改善策を実施中」である旨を
    積極的に返信し、誠実な対応姿勢をアピールする。
  </li>
</ol>

<h2 id="section-action">アクション</h2>
<table>
  <thead><tr><th>施策</th><th>担当</th><th>期限</th><th>ステータス</th></tr></thead>
  <tbody>
    <tr><td>LINEリマインド設定</td><td>オーナー</td><td>5月10日</td><td>未着手</td></tr>
    <tr><td>平日割引キャンペーン検討</td><td>オーナー＋黒川</td><td>5月末</td><td>検討中</td></tr>
    <tr><td>口コミ返信テンプレート作成</td><td>黒川サポート</td><td>5月15日</td><td>未着手</td></tr>
  </tbody>
</table>
`

const CONTENT_STYLES = `
  .kk-preview-karte {
    min-height: 100vh;
    background: linear-gradient(180deg, #f5f0e8 0%, #fbf8f2 180px, #ffffff 180px);
  }
  .kk-preview-wrap {
    padding: 36px 24px 88px;
  }
  .kk-preview-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 32px 56px;
    background: #fff;
    border: 0.5px solid #ddd5c8;
    border-radius: 16px;
    box-shadow: 0 18px 60px rgba(10,10,10,0.06);
  }
  .kk-preview-content [id] { scroll-margin-top: 144px; }
  .kk-preview-content h1 {
    font-family: Noto Serif JP, serif;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: #0a0a0a;
    margin: 0 0 24px;
  }
  .kk-preview-content h2 {
    font-family: Noto Serif JP, serif;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: #0a0a0a;
    margin: 56px 0 16px;
    padding-top: 8px;
    border-top: 1px solid #f0e7d2;
  }
  .kk-preview-content h3 {
    font-family: Noto Serif JP, serif;
    font-size: 18px;
    font-weight: 500;
    color: #0a0a0a;
    margin: 28px 0 12px;
  }
  .kk-preview-content p, .kk-preview-content li, .kk-preview-content td, .kk-preview-content th {
    font-family: Noto Sans JP, sans-serif;
    font-size: 14px;
    line-height: 2;
    letter-spacing: 0.03em;
    color: #242424;
  }
  .kk-preview-content ul, .kk-preview-content ol { padding-left: 1.4em; }
  .kk-preview-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 32px;
  }
  .kk-preview-content th, .kk-preview-content td {
    padding: 12px 14px;
    border: 0.5px solid #e6ddcf;
    vertical-align: top;
  }
  .kk-preview-content th {
    background: #faf6ee;
    color: #5b4c22;
    font-weight: 500;
  }
  .kk-preview-footer {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px 40px;
    color: #7a746a;
    font-family: Noto Sans JP, sans-serif;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-align: center;
  }
  @media (max-width: 768px) {
    .kk-preview-wrap { padding: 20px 12px 56px; }
    .kk-preview-content { padding: 24px 18px 40px; border-radius: 12px; }
    .kk-preview-content h1 { font-size: 24px; }
    .kk-preview-content h2 { font-size: 19px; margin-top: 42px; }
    .kk-preview-content p, .kk-preview-content li,
    .kk-preview-content td, .kk-preview-content th { font-size: 13px; }
  }
`

export default function PreviewKarteDemoPage() {
  return (
    <div className="kk-preview-karte">
      <style>{CONTENT_STYLES}</style>
      <Header />
      <KarteNav />

      <main className="kk-preview-wrap">
        <div
          className="kk-preview-content"
          dangerouslySetInnerHTML={{ __html: MOCK_HTML }}
        />
      </main>

      <footer className="kk-preview-footer">
        © ai×me lab / 黒川聖羅カルテ
        <Link href="/preview/dashboard" style={{ color: '#c9a84c', marginLeft: '20px' }}>← ダッシュボードに戻る</Link>
      </footer>
    </div>
  )
}
