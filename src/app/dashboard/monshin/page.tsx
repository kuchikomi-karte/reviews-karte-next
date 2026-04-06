'use client'

import { useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Header from '@/components/ui/Header'
import brandStyles from '@/styles/brand.module.css'
import { USER_LOGIN_PATH, hasUserAuthConfig } from '@/lib/auth/user'

const QUESTIONS = [
  {
    key: 'q1',
    axis: '明確化',
    text: '今一番解決したい経営の問題を、一文で書いてください。',
  },
  {
    key: 'q2',
    axis: '前提条件',
    text: 'その問題が「問題だ」と判断した根拠は何ですか？数字・感覚・誰かの意見、どれですか？',
  },
  {
    key: 'q3',
    axis: '仮定',
    text: '解決策がうまくいくと思っているのは、どんな前提があるからですか？その前提は本当に正しいですか？',
  },
  {
    key: 'q4',
    axis: '根拠',
    text: '過去に似た問題に取り組んだことがありますか？その時どうなりましたか？',
  },
  {
    key: 'q5',
    axis: '期限',
    text: 'いつからその問題を抱えていますか？なぜ今まで解決できなかったと思いますか？',
  },
  {
    key: 'q6',
    axis: '影響',
    text: 'この問題が6ヶ月後も解決しなかった場合、サロンはどうなっていますか？逆に解決できたら何が変わりますか？',
  },
  {
    key: 'q7',
    axis: '視点',
    text: 'あなたのサロンの一番のリピーター客は、あなたのサロンの何に価値を感じていると思いますか？その人の目線で今の問題を見るとどう見えますか？',
  },
] as const

type QuestionKey = (typeof QUESTIONS)[number]['key']

type Answers = Record<QuestionKey, string>

const emptyAnswers: Answers = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  q6: '',
  q7: '',
}

export default function MonshinPage() {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const hasSupabaseConfig = hasUserAuthConfig()
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!hasSupabaseConfig) {
        setLoading(false)
        return
      }

      const supabase = createClientComponentClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(USER_LOGIN_PATH)
        return
      }

      const { data, error } = await supabase
        .from('monshin')
        .select('q1, q2, q3, q4, q5, q6, q7')
        .eq('user_id', user.id)
        .maybeSingle<Answers>()

      if (error) {
        console.error('Monshin load error:', error)
      }

      if (data) {
        setAnswers({
          q1: data.q1 ?? '',
          q2: data.q2 ?? '',
          q3: data.q3 ?? '',
          q4: data.q4 ?? '',
          q5: data.q5 ?? '',
          q6: data.q6 ?? '',
          q7: data.q7 ?? '',
        })
      }

      setLoading(false)
    }

    void load()

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [hasSupabaseConfig, router])

  const showToast = (message: string) => {
    setToastMessage(message)

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setToastMessage('')
    }, 3000)
  }

  const handleSave = async () => {
    if (!hasSupabaseConfig || saving) {
      return
    }

    setSaving(true)

    try {
      const supabase = createClientComponentClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(USER_LOGIN_PATH)
        return
      }

      const { error } = await supabase.from('monshin').upsert(
        {
          user_id: user.id,
          ...answers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )

      if (error) {
        throw error
      }

      showToast('回答を保存しました')
    } catch (error) {
      console.error('Monshin save error:', error)
      showToast('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f0e8' }}>
        <p style={{ fontSize: '13px', color: '#888', letterSpacing: '0.1em', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
          読み込み中...
        </p>
      </div>
    )
  }

  return (
    <div className={brandStyles.wrapper}>
      <Header />

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#888', fontFamily: 'var(--font-noto-sans-jp), sans-serif', marginBottom: '12px' }}>
            SELF CHECK
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-noto-serif-jp), serif',
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              color: '#0a0a0a',
              marginBottom: '12px',
            }}
          >
            自己問診
          </h1>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.9, fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
            7つの質問に答えることで、経営課題の輪郭を明確にします。
            <br />
            回答は随時保存され、次回アクセス時に続きから編集できます。
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {QUESTIONS.map((question, index) => (
            <section
              key={question.key}
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #ddd5c8',
                borderRadius: '10px',
                padding: '28px 28px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#c9a84c',
                    fontFamily: 'var(--font-noto-sans-jp), sans-serif',
                    border: '0.5px solid rgba(201,168,76,0.35)',
                    padding: '2px 8px',
                    borderRadius: '3px',
                  }}
                >
                  {question.axis}
                </span>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
                  Q{index + 1}
                </span>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.9,
                  color: '#0a0a0a',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-noto-sans-jp), sans-serif',
                  marginBottom: '16px',
                }}
              >
                {question.text}
              </p>

              <textarea
                rows={4}
                value={answers[question.key]}
                onChange={(event) =>
                  setAnswers((prev) => ({ ...prev, [question.key]: event.target.value }))
                }
                placeholder="ここに入力してください..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '13px',
                  lineHeight: 1.8,
                  color: '#0a0a0a',
                  fontFamily: 'var(--font-noto-sans-jp), sans-serif',
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
            disabled={saving}
            onClick={handleSave}
            style={{
              padding: '14px 40px',
              backgroundColor: saving ? '#98855a' : '#c9a84c',
              color: '#0a0a0a',
              fontSize: '13px',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-noto-sans-jp), sans-serif',
              fontWeight: 500,
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'default' : 'pointer',
              transition: 'background 0.15s',
            }}
            type="button"
          >
            {saving ? '保存中...' : '回答を保存する'}
          </button>
        </div>
      </main>

      {toastMessage ? (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            zIndex: 200,
            padding: '14px 24px',
            border: '0.5px solid rgba(201,168,76,0.35)',
            borderRadius: '6px',
            backgroundColor: '#0a0a0a',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            color: '#c9a84c',
            fontSize: '13px',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-noto-sans-jp), sans-serif',
          }}
        >
          {toastMessage}
        </div>
      ) : null}
    </div>
  )
}
