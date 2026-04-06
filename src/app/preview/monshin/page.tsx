'use client'

// デザイン確認専用ページ。認証不要・Supabase未使用・モックデータのみ使用。
// 本番コード（/dashboard/monshin）には影響しません。
import { useState, useRef } from 'react'
import Header from '@/components/ui/Header'
import Link from 'next/link'

const QUESTIONS = [
  { key: 'q1', axis: '明確化', text: '今一番解決したい経営の問題を、一文で書いてください。' },
  { key: 'q2', axis: '前提条件', text: 'その問題が「問題だ」と判断した根拠は何ですか？数字・感覚・誰かの意見、どれですか？' },
  { key: 'q3', axis: '仮定', text: '解決策がうまくいくと思っているのは、どんな前提があるからですか？その前提は本当に正しいですか？' },
  { key: 'q4', axis: '根拠', text: '過去に似た問題に取り組んだことがありますか？その時どうなりましたか？' },
  { key: 'q5', axis: '期限', text: 'いつからその問題を抱えていますか？なぜ今まで解決できなかったと思いますか？' },
  { key: 'q6', axis: '影響', text: 'この問題が6ヶ月後も解決しなかった場合、サロンはどうなっていますか？逆に解決できたら何が変わりますか？' },
  { key: 'q7', axis: '視点', text: 'あなたのサロンの一番のリピーター客は、あなたのサロンの何に価値を感じていると思いますか？その人の目線で今の問題を見るとどう見えますか？' },
] as const

type Answers = Record<string, string>

const MOCK_ANSWERS: Answers = {
  q1: '新規集客が月5件以下に落ちており、このままでは来月の家賃が払えない。',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  q6: '',
  q7: '',
}

export default function PreviewMonshinPage() {
  const [answers, setAnswers] = useState<Answers>(MOCK_ANSWERS)
  const [toast, setToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSave = () => {
    setToast(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(false), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8' }}>
      <Header />

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#888', fontFamily: 'Noto Sans JP, sans-serif', marginBottom: '12px' }}>
            SELF CHECK
          </p>
          <h1 style={{
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '24px',
            fontWeight: 400,
            letterSpacing: '0.12em',
            color: '#0a0a0a',
            marginBottom: '12px',
          }}>
            自己問診
          </h1>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.9, fontFamily: 'Noto Sans JP, sans-serif' }}>
            7つの質問に答えることで、経営課題の輪郭を明確にします。<br />
            回答は随時保存され、次回アクセス時に続きから編集できます。
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {QUESTIONS.map((q, i) => (
            <section key={q.key} style={{
              backgroundColor: '#fff',
              border: '0.5px solid #ddd5c8',
              borderRadius: '10px',
              padding: '28px 28px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#c9a84c',
                  fontFamily: 'Noto Sans JP, sans-serif',
                  border: '0.5px solid rgba(201,168,76,0.35)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                }}>
                  {q.axis}
                </span>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'Noto Sans JP, sans-serif' }}>Q{i + 1}</span>
              </div>

              <p style={{
                fontSize: '14px',
                lineHeight: 1.9,
                color: '#0a0a0a',
                letterSpacing: '0.06em',
                fontFamily: 'Noto Sans JP, sans-serif',
                marginBottom: '16px',
              }}>
                {q.text}
              </p>

              <textarea
                rows={4}
                value={answers[q.key]}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
                placeholder="ここに入力してください..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '13px',
                  lineHeight: 1.8,
                  color: '#0a0a0a',
                  fontFamily: 'Noto Sans JP, sans-serif',
                  border: '0.5px solid #ddd5c8',
                  borderRadius: '6px',
                  resize: 'vertical',
                  outline: 'none',
                  backgroundColor: '#faf8f4',
                  boxSizing: 'border-box',
                }}
              />
            </section>
          ))}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '14px 40px',
              backgroundColor: '#c9a84c',
              color: '#0a0a0a',
              fontSize: '13px',
              letterSpacing: '0.15em',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 500,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            回答を保存する
          </button>
        </div>

        {/* 他のプレビューへのリンク */}
        <div style={{ marginTop: '40px', padding: '20px 24px', backgroundColor: '#f0e8d8', borderRadius: '8px', border: '0.5px solid #ddd5c8' }}>
          <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif', marginBottom: '12px' }}>
            ▼ 他のプレビューページ
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/preview/dashboard" style={{ fontSize: '13px', color: '#c9a84c', fontFamily: 'Noto Sans JP, sans-serif' }}>ダッシュボード →</Link>
            <Link href="/preview/karte-demo" style={{ fontSize: '13px', color: '#c9a84c', fontFamily: 'Noto Sans JP, sans-serif' }}>カルテ詳細レイアウト →</Link>
          </div>
        </div>
      </main>

      {/* トースト */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#0a0a0a',
          color: '#c9a84c',
          fontSize: '13px',
          letterSpacing: '0.1em',
          fontFamily: 'Noto Sans JP, sans-serif',
          padding: '14px 28px',
          borderRadius: '6px',
          border: '0.5px solid rgba(201,168,76,0.35)',
          zIndex: 200,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
          回答を保存しました
        </div>
      )}
    </div>
  )
}
