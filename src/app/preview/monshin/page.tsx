'use client'

import { useRef, useState } from 'react'
import PreviewShell from '@/components/preview/PreviewShell'

const QUESTIONS = [
  { key: 'q1', axis: '明確化',   text: '今一番解決したい経営の問題を、一文で書いてください。' },
  { key: 'q2', axis: '前提条件', text: 'その問題が「問題だ」と判断した根拠は何ですか？数字・感覚・誰かの意見、どれですか？' },
  { key: 'q3', axis: '仮定',     text: '解決策がうまくいくと思っているのは、どんな前提があるからですか？その前提は本当に正しいですか？' },
  { key: 'q4', axis: '根拠',     text: '過去に似た問題に取り組んだことがありますか？その時どうなりましたか？' },
  { key: 'q5', axis: '期限',     text: 'いつからその問題を抱えていますか？なぜ今まで解決できなかったと思いますか？' },
  { key: 'q6', axis: '影響',     text: 'この問題が6ヶ月後も解決しなかった場合、サロンはどうなっていますか？逆に解決できたら何が変わりますか？' },
  { key: 'q7', axis: '視点',     text: 'あなたのサロンの一番のリピーター客は、あなたのサロンの何に価値を感じていると思いますか？その人の目線で今の問題を見るとどう見えますか？' },
] as const

export default function PreviewMonshinPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: '新規集客が月5件以下に落ちており、このままでは来月の家賃が払えない。',
    q2: '', q3: '', q4: '', q5: '', q6: '', q7: '',
  })
  const [toast, setToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSave = () => {
    setToast(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(false), 3000)
  }

  return (
    <PreviewShell>
      {/* Page heading */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'var(--font-shippori-mincho), Shippori Mincho, Noto Serif JP, serif',
          fontSize: '20px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: '#1a1a1a',
          marginBottom: '8px',
        }}>
          自己問診
        </h1>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {QUESTIONS.map((q, i) => (
          <div key={q.key} style={{
            backgroundColor: '#1a1a1a',
            border: '0.5px solid #2a2a2a',
            borderRadius: '10px',
            padding: '16px 18px',
          }}>
            {/* Axis badge + question number */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '9px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(201,168,76,0.15)',
                border: '0.5px solid rgba(201,168,76,0.35)',
                color: '#c9a84c',
                marginRight: '8px',
                letterSpacing: '0.08em',
              }}>
                {q.axis}
              </span>
              <span style={{ fontSize: '10px', color: '#555' }}>Q{i + 1}</span>
            </div>

            {/* Question text */}
            <p style={{
              fontSize: '13px',
              color: '#c8bfb0',
              marginBottom: '10px',
              lineHeight: 1.7,
              letterSpacing: '0.04em',
            }}>
              {q.text}
            </p>

            {/* Textarea */}
            <textarea
              rows={3}
              value={answers[q.key]}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
              placeholder="ここに入力してください..."
              style={{
                width: '100%',
                background: '#111',
                border: '0.5px solid #333',
                borderRadius: '6px',
                color: '#e8e0d0',
                fontSize: '13px',
                lineHeight: 1.7,
                padding: '10px 12px',
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'var(--font-noto-sans-jp), Noto Sans JP, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: '0.03em',
              }}
            />
          </div>
        ))}
      </div>

      {/* Save button */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleSave}
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '240px',
            padding: '12px 24px',
            backgroundColor: '#c9a84c',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            fontFamily: 'var(--font-noto-sans-jp), Noto Sans JP, sans-serif',
          }}
        >
          回答を保存する
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#141414',
          color: '#c9a84c',
          fontSize: '13px',
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-noto-sans-jp), Noto Sans JP, sans-serif',
          padding: '14px 24px',
          borderRadius: '8px',
          border: '1px solid rgba(201,168,76,0.3)',
          zIndex: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          回答を保存しました
        </div>
      )}
    </PreviewShell>
  )
}
