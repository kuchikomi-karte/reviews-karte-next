'use client'

import { forwardRef, type ReactNode, useEffect, useRef, useState } from 'react'
import PreviewShell from '@/components/preview/PreviewShell'

const GOLD = '#c9a84c'
const BLACK = '#0a0a0a'
const CREAM = '#f5f0e8'
const HEADER_H = 102
const NAV_W = 220
const STEPPER_W = 260
const REVIEW_ICON = '/images/kamokamo8760_httpss.mj.runacAPPEs24Ww_a_full-body_portrait_of_c19f6189-b45a-41d8-986d-5c031a43914d_2.png'

type PhaseId = 'step0' | 'step1' | 'step2' | 'step3' | 'soudan'
type StepStatus = 'done' | 'active' | 'locked'
type NavId =
  | 'souhyo'
  | 'kuchikomi'
  | 'jikaku'
  | 'jittai'
  | 'soukan'
  | 'shohosen'
  | 'mondai'
  | 'hokusei'
  | 'action'
  | 'furikaeri'

interface ReviewSite {
  id: string
  name: string
  url: string
  urlLabel: string
  stats: {
    total: number
    average: number
    distribution: Array<{ star: number; count: number }>
    belowThreePercent: number
  }
  unreplied: Array<{
    stars: number
    date: string
    text: string
    replyExample: string
  }>
  consideration: string
}

const NAV_SECTIONS: Array<{ section: string; items: Array<{ label: string; id: NavId }> }> = [
  {
    section: 'カルテ内容',
    items: [
      { label: '総評', id: 'souhyo' },
      { label: '口コミ分析', id: 'kuchikomi' },
    ],
  },
  {
    section: '自己問診',
    items: [
      { label: '自覚症状', id: 'jikaku' },
      { label: '経営実態', id: 'jittai' },
      { label: '口コミとの相関', id: 'soukan' },
      { label: '処方箋', id: 'shohosen' },
    ],
  },
  {
    section: '7要素問診',
    items: [{ label: '問題の明確化', id: 'mondai' }],
  },
  {
    section: '目標・行動',
    items: [
      { label: '北極星', id: 'hokusei' },
      { label: 'アクションプラン', id: 'action' },
      { label: '振り返り', id: 'furikaeri' },
    ],
  },
]

const NAV_IDS: NavId[] = ['souhyo', 'kuchikomi', 'jikaku', 'jittai', 'soukan', 'shohosen', 'mondai', 'hokusei', 'action', 'furikaeri']

const steps: Array<{
  id: 'basic' | 'step0' | 'step1' | 'step2' | 'step3'
  icon: string
  tag: string
  name: string
  desc: string
  status: StepStatus
  completedAt?: string
  btnLabel?: string
  lockHint?: string
}> = [
  {
    id: 'basic',
    icon: '✓',
    tag: '基本情報登録',
    name: 'お店情報・口コミサイト登録',
    desc: '',
    status: 'done',
    completedAt: '2025年4月1日',
  },
  {
    id: 'step0',
    icon: '0',
    tag: 'STEP 0　現在状況の確認',
    name: '自己問診',
    desc: '自覚症状・経営実態・口コミとの相関診断・11原理から見た処方箋',
    status: 'active',
    btnLabel: '黒川聖羅の問診を開始',
  },
  {
    id: 'step1',
    icon: '1',
    tag: 'STEP 1　問題点の深掘り',
    name: '7要素問診・北極星の設定',
    desc: '最優先課題を7要素で深掘りし、北極星（WOOP）を設定します',
    status: 'locked',
    lockHint: 'STEP 0 完了で解放',
  },
  {
    id: 'step2',
    icon: '2',
    tag: 'STEP 2　アクションプラン',
    name: 'WOOP問診・IF-Thenプラン作成',
    desc: '北極星に向けたIF-Thenアクションを最大3つ設定します',
    status: 'locked',
    lockHint: 'STEP 1 完了で解放',
  },
  {
    id: 'step3',
    icon: '3',
    tag: 'STEP 3　振り返り',
    name: '週次報告・聖羅フィードバック',
    desc: '週次報告 → 完了・ピボット・継続を選択してサイクルを回します',
    status: 'locked',
    lockHint: 'STEP 2 完了で解放',
  },
]

const phaseMeta: Record<
  PhaseId,
  {
    shortLabel: string
    title: string
    description: string
    badge: string
    buttonLabel?: string
  }
> = {
  step0: {
    shortLabel: 'STEP 0',
    title: '現在状況の確認',
    description: '自覚症状・経営実態を確認し、口コミとの相関から最優先課題を特定します。',
    badge: 'STEP 0 — 自己問診',
    buttonLabel: '黒川聖羅の問診を開始',
  },
  step1: {
    shortLabel: 'STEP 1',
    title: '問題点の深掘り',
    description: '7要素で課題を深掘りし、北極星の方向性を整理します。',
    badge: 'STEP 1 — 7要素問診',
  },
  step2: {
    shortLabel: 'STEP 2',
    title: 'アクションプラン',
    description: 'WOOP問診と IF-Then で実行可能な行動に落とし込みます。',
    badge: 'STEP 2 — アクションプラン',
  },
  step3: {
    shortLabel: 'STEP 3',
    title: '振り返り',
    description: '週次報告と聖羅フィードバックで改善サイクルを継続します。',
    badge: 'STEP 3 — 振り返り',
  },
  soudan: {
    shortLabel: '相談',
    title: '経営相談',
    description: '壁打ちや優先順位整理のための相談パネルです。',
    badge: '経営相談',
  },
}

const depthLevels = [
  { dots: [true, false, false, false], label: '●○○○　口コミ投稿分析', current: true },
  { dots: [true, true, false, false], label: '●●○○　自己問診', current: false },
  { dots: [true, true, true, false], label: '●●●○　7要素問診', current: false },
  { dots: [true, true, true, true], label: '●●●●　北極星設定', current: false },
]

const reviewSites: ReviewSite[] = [
  {
    id: 'google',
    name: 'Googleマップ',
    url: 'https://maps.google.com/',
    urlLabel: 'Google マップで見る',
    stats: {
      total: 42,
      average: 4.1,
      distribution: [
        { star: 5, count: 18 },
        { star: 4, count: 12 },
        { star: 3, count: 7 },
        { star: 2, count: 3 },
        { star: 1, count: 2 },
      ],
      belowThreePercent: 23,
    },
    unreplied: [
      {
        stars: 5,
        date: '2025年3月28日',
        text: 'スタッフの対応がとても丁寧でまた来たいと思いました。施術も丁寧で肌がつるつるになりました。',
        replyExample: 'この度はご来店いただきありがとうございます。スタッフの対応が伝わり大変嬉しく思います。またのご来店を心よりお待ちしております。',
      },
      {
        stars: 3,
        date: '2025年3月20日',
        text: '少し待ち時間が長かったですが施術は満足です。次回また予約したいと思います。',
        replyExample: '貴重なご意見をありがとうございます。お待たせしてしまい大変申し訳ございませんでした。次回はよりスムーズにご案内できるよう改善してまいります。',
      },
    ],
    consideration: '未返信が2件続いています。高評価への返信がない状態は「見ていない」印象を与え、潜在顧客の来店決断を妨げます。今週中の返信対応を最優先にしてください。',
  },
  {
    id: 'hotpepper',
    name: 'Hotpepper Beauty',
    url: 'https://beauty.hotpepper.jp/',
    urlLabel: 'Hotpepper Beautyで見る',
    stats: {
      total: 28,
      average: 4.3,
      distribution: [
        { star: 5, count: 14 },
        { star: 4, count: 9 },
        { star: 3, count: 3 },
        { star: 2, count: 1 },
        { star: 1, count: 1 },
      ],
      belowThreePercent: 18,
    },
    unreplied: [
      {
        stars: 4,
        date: '2025年4月1日',
        text: '雰囲気が良くてリラックスできました。スタッフの方が親切で次回も来たいです。',
        replyExample: 'ご来店いただきありがとうございます。雰囲気を気に入っていただけてとても嬉しいです。またのご来店を心よりお待ちしております。',
      },
    ],
    consideration: 'Hotpepper Beauty は平均 4.3 と高評価ですが、未返信が 1 件あります。新規集客への影響が大きいサイトなので、信頼感維持のため早めに返信してください。',
  },
]

function getStepIconStyle(status: StepStatus) {
  if (status === 'done') {
    return {
      background: 'rgba(201,168,76,0.15)',
      border: '1.5px solid #c9a84c',
      color: '#c9a84c',
    }
  }
  if (status === 'active') {
    return {
      background: '#c9a84c',
      border: '1.5px solid #c9a84c',
      color: '#0a0a0a',
      fontWeight: 700,
    }
  }
  return {
    background: '#1a1a1a',
    border: '1.5px solid #2a2a2a',
    color: '#444',
    opacity: 0.4,
  }
}

function getConnectorColor(status: StepStatus) {
  if (status === 'done') return 'rgba(201,168,76,0.4)'
  if (status === 'active') return 'rgba(201,168,76,0.25)'
  return '#2a2a2a'
}

function SectionHeader({ title, badge }: { title: string; badge: string }) {
  return (
    <div
      style={{
        background: BLACK,
        padding: '11px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '11px 11px 0 0',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          color: GOLD,
          fontWeight: 500,
          letterSpacing: '0.06em',
          fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: '11px',
          padding: '3px 11px',
          borderRadius: '11px',
          background: 'rgba(201,168,76,0.12)',
          border: '0.5px solid rgba(201,168,76,0.3)',
          color: GOLD,
        }}
      >
        {badge}
      </span>
    </div>
  )
}

function SectionBody({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        border: '0.5px solid #ddd5c8',
        borderTop: 'none',
        borderRadius: '0 0 11px 11px',
        padding: '18px',
      }}
    >
      {children}
    </div>
  )
}

function LockedSection({ title, hint, pill }: { title: string; hint: string; pill: string }) {
  return (
    <div
      style={{
        background: '#f9f8f6',
        border: '0.5px solid #e8e4de',
        borderRadius: '11px',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ fontSize: '13px', color: '#c0bab2' }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#ccc', marginTop: '2px' }}>{hint}</div>
      </div>
      <span
        style={{
          fontSize: '10px',
          padding: '3px 11px',
          border: '0.5px solid #ddd',
          borderRadius: '11px',
          color: '#ccc',
          background: 'white',
          whiteSpace: 'nowrap',
        }}
      >
        {pill}
      </span>
    </div>
  )
}

function ReviewSiteBlock({ site }: { site: ReviewSite }) {
  const maxCount = Math.max(...site.stats.distribution.map((item) => item.count))

  return (
    <div
      style={{
        marginBottom: '20px',
        borderRadius: '11px',
        overflow: 'hidden',
        border: '0.5px solid #ddd5c8',
        background: 'white',
      }}
    >
      <div
        style={{
          background: BLACK,
          padding: '11px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            color: GOLD,
            fontWeight: 500,
            letterSpacing: '0.06em',
            fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
          }}
        >
          {site.name}
        </span>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '11px',
            color: GOLD,
            textDecoration: 'none',
            padding: '3px 10px',
            border: '0.5px solid rgba(201,168,76,0.3)',
            borderRadius: '10px',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}
        >
          {site.urlLabel} ›
        </a>
      </div>

      <div style={{ padding: '18px 20px', borderTop: '0.5px solid #ede8e0' }}>
        {site.stats.distribution.map(({ star, count }) => (
          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '7px' }}>
            <span style={{ fontSize: '13px', color: '#666', width: '30px', flexShrink: 0 }}>★ {star}</span>
            <div style={{ flex: 1, height: '7px', background: '#ede5d8', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  background: GOLD,
                  width: `${(count / maxCount) * 100}%`,
                  opacity: star >= 4 ? 1 : star === 3 ? 0.65 : 0.4,
                }}
              />
            </div>
            <span style={{ fontSize: '13px', color: '#666', width: '22px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '0.5px solid #ede8e0', marginTop: '8px', flexWrap: 'wrap' }}>
          {[
            { label: '平均評価', value: site.stats.average, unit: '/ 5' },
            { label: '総口コミ数', value: site.stats.total, unit: '件' },
            { label: '★3以下の割合', value: site.stats.belowThreePercent, unit: '%' },
          ].map(({ label, value, unit }) => (
            <div key={label}>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '22px', color: '#1a1a1a', fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif', fontWeight: 500 }}>
                {value}
                <span style={{ fontSize: '11px', color: '#999', marginLeft: '2px' }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0 9px', borderTop: '0.5px solid #ede8e0', borderBottom: '0.5px solid #ede8e0' }}>
          <span style={{ fontSize: '12px', color: '#888', letterSpacing: '0.04em' }}>未返信の口コミ</span>
          <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '10px', background: 'rgba(226,68,26,0.1)', border: '0.5px solid rgba(201,64,15,0.35)', color: '#c9400f' }}>
            {site.unreplied.length}件
          </span>
        </div>

        {site.unreplied.map((review, index) => (
          <div key={`${site.id}-${index}`} style={{ padding: '16px 0', borderBottom: index < site.unreplied.length - 1 ? '0.5px solid #ede8e0' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', color: GOLD }}>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span>
              <span style={{ fontSize: '11px', color: '#999' }}>{review.date}</span>
            </div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '10px' }}>{review.text}</div>
            <div style={{ background: CREAM, borderLeft: `2px solid ${GOLD}`, padding: '10px 14px' }}>
              <div style={{ fontSize: '10px', color: GOLD, letterSpacing: '0.08em', marginBottom: '4px' }}>返信例</div>
              <div style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: 1.7 }}>{review.replyExample}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: BLACK,
          padding: '14px 18px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          borderTop: '0.5px solid #1e1e1e',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={REVIEW_ICON}
          alt="黒川聖羅"
          style={{
            width: '52px',
            height: '68px',
            borderRadius: '6px',
            objectFit: 'cover',
            objectPosition: 'top center',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: '10px', color: GOLD, letterSpacing: '0.08em', marginBottom: '5px' }}>黒川聖羅 — 考察</div>
          <div style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.8, fontFamily: 'var(--font-noto-serif-jp), Noto Serif JP, serif' }}>
            {site.consideration}
          </div>
        </div>
      </div>
    </div>
  )
}

function ColNav({ activeItem, onNavClick }: { activeItem: NavId; onNavClick: (id: NavId) => void }) {
  return (
    <aside
      className="col-nav-pc karte-nav-scroll"
      style={{
        width: '220px',
        flexShrink: 0,
        background: '#0d0d0d',
        borderRight: '0.5px solid #1e1e1e',
        padding: '18px 0',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {NAV_SECTIONS.map((section, sectionIndex) => (
        <div key={section.section}>
          {sectionIndex > 0 && <div style={{ margin: '9px 20px', borderTop: '0.5px solid #1a1a1a' }} />}
          <div style={{ padding: '7px 20px 3px', fontSize: '11px', color: '#3a3a3a', letterSpacing: '0.1em', marginTop: '6px' }}>
            {section.section}
          </div>
          {section.items.map((item) => {
            const isActive = activeItem === item.id

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  onNavClick(item.id)
                }}
                style={{
                  padding: '8px 20px',
                  paddingLeft: isActive ? '18px' : '20px',
                  fontSize: '13px',
                  color: isActive ? GOLD : '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  borderLeft: `2px solid ${isActive ? GOLD : 'transparent'}`,
                  background: isActive ? 'rgba(201,168,76,0.05)' : 'transparent',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                {item.label}
              </a>
            )
          })}
        </div>
      ))}

      <div style={{ margin: '9px 20px', borderTop: '0.5px solid #1a1a1a' }} />
      <div style={{ padding: '7px 20px 3px', fontSize: '11px', color: '#3a3a3a', letterSpacing: '0.1em', marginTop: '6px' }}>
        履歴
      </div>
      {['2025年4月', '2025年3月'].map((label) => (
        <div key={label} style={{ padding: '7px 20px', fontSize: '12px', color: '#444', cursor: 'pointer' }}>
          {label}
        </div>
      ))}
    </aside>
  )
}

const ColKarte = forwardRef<HTMLElement, { chatOpen: boolean }>(function ColKarte({ chatOpen }, ref) {
  const totalReviews = reviewSites.reduce((sum, site) => sum + site.stats.total, 0)

  return (
    <main ref={ref} className={`col-karte-main ${chatOpen ? 'chat-open' : ''}`}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <section
          id="souhyo"
          style={{
            background: BLACK,
            borderRadius: '14px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '220px',
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: '18px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.86) 52%, rgba(10,10,10,0.45) 100%)',
              zIndex: 1,
            }}
          />
          <div style={{ position: 'relative', zIndex: 2, padding: '28px 28px 24px', maxWidth: '500px' }}>
            <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '0.12em', marginBottom: '6px' }}>2025年4月のカルテ</div>
            <div
              style={{
                fontSize: '22px',
                color: '#e8e0d0',
                fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
                fontWeight: 500,
                letterSpacing: '0.08em',
                marginBottom: '3px',
              }}
            >
              NECESSARY さんのカルテ
            </div>
            <div style={{ fontSize: '12px', color: '#444', marginBottom: '16px' }}>業種：エステサロン</div>
            <div style={{ width: '32px', height: '0.5px', background: GOLD, opacity: 0.5, marginBottom: '12px' }} />
            <div style={{ fontSize: '10px', color: GOLD, letterSpacing: '0.1em', marginBottom: '5px' }}>黒川聖羅 — 総評</div>
            <div style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.85, fontFamily: 'var(--font-noto-serif-jp), Noto Serif JP, serif' }}>
              口コミの平均評価は 4.1 ですが、★3 以下が 23% を占めています。右の STEP 0「黒川聖羅の問診を開始」から経営状況を教えてください。
            </div>
            <span
              style={{
                display: 'inline-block',
                marginTop: '12px',
                fontSize: '10px',
                padding: '3px 10px',
                background: 'rgba(201,168,76,0.12)',
                border: '0.5px solid rgba(201,168,76,0.3)',
                color: GOLD,
              }}
            >
              診断日：2025年4月6日
            </span>
          </div>
        </section>

        <section id="kuchikomi" style={{ marginBottom: '16px' }}>
          <SectionHeader title="口コミ投稿分析" badge={`計${totalReviews}件`} />
          <SectionBody>
            {reviewSites.map((site) => (
              <ReviewSiteBlock key={site.id} site={site} />
            ))}
          </SectionBody>
        </section>

        <section id="jikaku" style={{ marginBottom: '12px' }}>
          <LockedSection title="自覚症状" hint="STEP 0 問診完了で表示されます" pill="🔒 STEP 0" />
        </section>

        <section id="jittai" style={{ marginBottom: '12px' }}>
          <LockedSection title="経営実態" hint="STEP 0 問診完了で表示されます" pill="🔒 STEP 0" />
        </section>

        <section id="soukan" style={{ marginBottom: '12px' }}>
          <LockedSection title="口コミとの相関" hint="STEP 0 問診完了で表示されます" pill="🔒 STEP 0" />
        </section>

        <section id="shohosen" style={{ marginBottom: '12px' }}>
          <LockedSection title="処方箋" hint="STEP 0 問診完了で表示されます" pill="🔒 STEP 0" />
        </section>

        <section id="mondai" style={{ marginBottom: '12px' }}>
          <LockedSection title="問題の明確化" hint="STEP 1 問診完了で表示されます" pill="🔒 STEP 1" />
        </section>

        <section id="hokusei" style={{ marginBottom: '12px' }}>
          <LockedSection title="北極星" hint="STEP 2 完了で表示されます" pill="🔒 STEP 2" />
        </section>

        <section id="action" style={{ marginBottom: '12px' }}>
          <LockedSection title="アクションプラン" hint="STEP 2 完了で表示されます" pill="🔒 STEP 2" />
        </section>

        <section id="furikaeri" style={{ marginBottom: '24px' }}>
          <LockedSection title="振り返り" hint="STEP 2 完了で表示されます" pill="🔒 STEP 2" />
        </section>
      </div>
    </main>
  )
})

function ColStepper({
  chatOpen,
  activePhase,
  onOpenChat,
}: {
  chatOpen: boolean
  activePhase: PhaseId
  onOpenChat: (phase: PhaseId) => void
}) {
  const currentPhase = phaseMeta[activePhase]

  return (
    <aside className={`col-stepper karte-nav-scroll ${chatOpen ? 'chat-open' : ''}`}>
      <div style={{ padding: '16px 18px 12px', borderBottom: '0.5px solid #1e1e1e', background: '#111', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.1em', marginBottom: '10px' }}>現在のフェーズ</div>
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ fontSize: '9px', color: GOLD, letterSpacing: '0.1em', marginBottom: '4px' }}>{currentPhase.shortLabel}</div>
          <div style={{ fontSize: '14px', color: '#e8e0d0', fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif', fontWeight: 500, marginBottom: '8px' }}>
            {currentPhase.title}
          </div>
          <div style={{ fontSize: '11px', color: '#777', lineHeight: 1.6, marginBottom: '12px' }}>{currentPhase.description}</div>
          {currentPhase.buttonLabel && (
            <button
              onClick={() => onOpenChat(activePhase)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                background: GOLD,
                border: 'none',
                borderRadius: '8px',
                color: BLACK,
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                fontFamily: 'var(--font-noto-sans-jp), sans-serif',
              }}
            >
              {currentPhase.buttonLabel}
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 18px', flex: 1 }}>
        {steps.map((step, index) => (
          <div key={step.id} style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '4px', marginBottom: '4px' }}>
            {index < steps.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '30px',
                  bottom: '-4px',
                  width: '0.5px',
                  background: getConnectorColor(step.status),
                }}
              />
            )}

            <div style={{ flexShrink: 0, position: 'relative', zIndex: 1, paddingTop: '2px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  ...getStepIconStyle(step.status),
                }}
              >
                {step.icon}
              </div>
            </div>

            <div style={{ flex: 1, padding: '2px 0 16px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.08em', marginBottom: '2px', color: step.status === 'active' ? GOLD : step.status === 'done' ? 'rgba(201,168,76,0.6)' : '#444' }}>
                {step.tag}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: step.status === 'active' ? '#e8e0d0' : step.status === 'done' ? '#888' : '#555',
                  fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif',
                  fontWeight: 500,
                  marginBottom: '3px',
                  lineHeight: 1.4,
                }}
              >
                {step.name}
              </div>

              {step.desc ? (
                <div style={{ fontSize: '11px', color: step.status === 'active' ? '#666' : '#3a3a3a', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              ) : null}

              {step.status === 'done' && step.completedAt ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'rgba(201,168,76,0.7)', marginTop: '4px' }}>
                  ✓ 完了 — {step.completedAt}
                </div>
              ) : null}

              {step.status === 'active' && step.btnLabel ? (
                <button
                  onClick={() => onOpenChat('step0')}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '8px',
                    padding: '9px 12px',
                    background: GOLD,
                    border: 'none',
                    borderRadius: '7px',
                    color: BLACK,
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: 'var(--font-noto-sans-jp), sans-serif',
                  }}
                >
                  {step.btnLabel}
                </button>
              ) : null}

              {step.status === 'locked' && step.lockHint ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#333', marginTop: '4px' }}>
                  <span>🔒</span>
                  <span>{step.lockHint}</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 18px 16px', borderTop: '0.5px solid #1e1e1e', background: '#111', flexShrink: 0 }}>
        <div style={{ fontSize: '9px', color: '#3a3a3a', letterSpacing: '0.1em', marginBottom: '10px' }}>カルテ深度</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {depthLevels.map((level) => (
            <div key={level.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {level.dots.map((on, index) => (
                  <div
                    key={`${level.label}-${index}`}
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: on ? GOLD : '#2a2a2a',
                      border: `0.5px solid ${on ? GOLD : '#333'}`,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '10px', color: level.current ? '#888' : '#3a3a3a' }}>{level.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 18px 14px', borderTop: '0.5px solid #1e1e1e', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.06em' }}>サイクル実行回数</span>
        <div>
          <span style={{ fontSize: '24px', color: GOLD, fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif', fontWeight: 500, lineHeight: 1 }}>1</span>
          <span style={{ fontSize: '10px', color: '#555', marginLeft: '2px' }}>回</span>
        </div>
      </div>
    </aside>
  )
}

function ChatPanel({
  chatOpen,
  activePhase,
  progress,
  onClose,
  onAdvanceProgress,
}: {
  chatOpen: boolean
  activePhase: PhaseId
  progress: number
  onClose: () => void
  onAdvanceProgress: () => void
}) {
  const currentPhase = phaseMeta[activePhase]

  return (
    <div className={`chat-panel ${chatOpen ? 'open' : ''}`}>
      <div
        style={{
          background: '#111',
          padding: '14px 16px',
          borderBottom: '0.5px solid #1e1e1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={REVIEW_ICON}
            alt="黒川聖羅"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid rgba(201,168,76,0.3)',
              objectFit: 'cover',
              objectPosition: 'center top',
              flexShrink: 0,
              background: '#1a1a1a',
            }}
          />
          <div>
            <div style={{ fontSize: '13px', color: '#e8e0d0', fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, serif' }}>黒川聖羅</div>
            <span
              style={{
                fontSize: '9px',
                color: GOLD,
                background: 'rgba(201,168,76,0.12)',
                border: '0.5px solid rgba(201,168,76,0.3)',
                padding: '2px 8px',
                borderRadius: '8px',
                display: 'inline-block',
                marginTop: '2px',
              }}
            >
              {currentPhase.badge}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#1a1a1a',
            border: '0.5px solid #2a2a2a',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '8px 14px', background: '#0d0d0d', borderBottom: '0.5px solid #1e1e1e', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#555', marginBottom: '5px' }}>
          <span>問診の進捗</span>
          <span style={{ color: GOLD }}>{progress} / 17 項目</span>
        </div>
        <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              background: GOLD,
              width: `${Math.round((progress / 17) * 100)}%`,
              transition: 'width 0.4s',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', color: '#333', fontSize: '12px', lineHeight: 1.7 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', border: '0.5px solid #2a2a2a', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6A2.5 2.5 0 0 1 16.5 16H11l-3.8 2.8c-.4.3-1 .01-1-.49V16A2.5 2.5 0 0 1 4 13.5v-6Z" stroke="#c9a84c" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
          チャット機能は
          <br />
          次のフェーズで実装されます
        </div>
      </div>

      <div style={{ padding: '12px 14px', borderTop: '0.5px solid #1e1e1e', background: '#0d0d0d', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div
            style={{
              flex: 1,
              background: '#1a1a1a',
              border: '0.5px solid #2a2a2a',
              borderRadius: '10px',
              padding: '10px 13px',
              color: '#444',
              fontSize: '13px',
            }}
          >
            メッセージを入力...
          </div>
          <button
            onClick={onAdvanceProgress}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: GOLD,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.5,
              cursor: 'pointer',
            }}
            aria-label="進捗を進めるダミー送信"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={BLACK} aria-hidden="true">
              <path d="M2 21 23 12 2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function KarteDemoPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [activePhase, setActivePhase] = useState<PhaseId>('step0')
  const [progress, setProgress] = useState(0)
  const [activeItem, setActiveItem] = useState<NavId>('souhyo')
  const karteRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)')

    const applyOverflow = (matches: boolean) => {
      document.body.style.overflow = matches ? 'hidden' : ''
      document.documentElement.style.overflow = matches ? 'hidden' : ''
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      applyOverflow(event.matches)
    }

    applyOverflow(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  useEffect(() => {
    const container = karteRef.current
    if (!container) return

    const handleScroll = () => {
      let current: NavId = NAV_IDS[0]
      const containerTop = container.getBoundingClientRect().top

      NAV_IDS.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) return

        if (section.getBoundingClientRect().top - containerTop <= 100) {
          current = id
        }
      })

      setActiveItem(current)
    }

    handleScroll()
    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavClick = (id: NavId) => {
    const container = karteRef.current
    const target = document.getElementById(id)
    if (!container || !target) return

    container.scrollTo({
      top: Math.max(target.offsetTop - 12, 0),
      behavior: 'smooth',
    })
    setActiveItem(id)
  }

  const openChat = (phase: PhaseId) => {
    setActivePhase(phase)
    setProgress(0)
    setChatOpen(true)
  }

  return (
    <PreviewShell showKarteMenu={false} showSidebar={false} showRightCol={false}>
      <div
        className="seira-bg-overlay"
        style={{
          position: 'fixed',
          left: `calc(${NAV_W}px + (100vw - ${NAV_W}px - ${STEPPER_W}px) / 2)`,
          top: `${HEADER_H}px`,
          width: `calc((100vw - ${NAV_W}px - ${STEPPER_W}px) / 2)`,
          height: `calc(100vh - ${HEADER_H}px)`,
          zIndex: 10,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seira-advisor.png"
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'auto',
            height: '100%',
            maxWidth: 'none',
            opacity: 0.15,
          }}
        />
      </div>
      <div className="karte-body-wrap">
        <div className={`chat-overlay ${chatOpen ? 'show' : ''}`} onClick={() => setChatOpen(false)} />
        <ColNav activeItem={activeItem} onNavClick={handleNavClick} />
        <ColKarte ref={karteRef} chatOpen={chatOpen} />
        <ColStepper chatOpen={chatOpen} activePhase={activePhase} onOpenChat={openChat} />
        <ChatPanel
          chatOpen={chatOpen}
          activePhase={activePhase}
          progress={progress}
          onClose={() => setChatOpen(false)}
          onAdvanceProgress={() => setProgress((prev) => Math.min(prev + 1, 17))}
        />
      </div>
    </PreviewShell>
  )
}
