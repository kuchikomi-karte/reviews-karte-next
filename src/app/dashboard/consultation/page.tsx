'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  content: string
  created_at: string
}

export default function ConsultationPage() {
  const session = useSession()
  const { data, status } = session
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      created_at: new Date().toISOString(),
    }])
    setInput('')
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSubmit = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      created_at: new Date().toISOString(),
    }])
    setInput('')
    setLoading(false)
  }

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
        <div style={{ color: '#737372', fontSize: '13px' }}>読み込み中...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <header style={{ borderBottom: '1px solid #e5e5e5', backgroundColor: '#ffffff', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#737372' }}>ai×me lab</span>
          <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.05em', color: '#1a1a1a', margin: 0 }}>
            口コミ経営カルテ
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '12px', color: '#6b726b' }}>{data?.user?.email || ''}</span>
            <button
              onClick={() => router.push('/login')}
              style={{
                fontSize: '12px',
                color: '#6b726b',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                fontFamily: 'Noto Sans JP, sans-serif'
              }}
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '2rem', fontWeight: 400, letterSpacing: '0.1em', color: '#1a1a1a', marginBottom: '2rem' }}>
          経営相談
        </h1>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e5e5', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '14px', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              黒川聖羅に経営に関する相談をしましょう
            </div>

            <div style={{ fontSize: '13px', color: '#6b726b', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              メッセージを送信すると、AIが分析して返信します。<br />
              回答は通常5〜10分程度で表示されます。
            </div>

            <div style={{ backgroundColor: '#f9f9f5', borderRadius: '0.375rem', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="相談したいことを入力してください..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #d4d4d4',
                    fontSize: '14px',
                    fontFamily: 'Noto Sans JP, sans-serif',
                    resize: 'vertical',
                    color: '#1a1a1a',
                    backgroundColor: '#fafafa'
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    backgroundColor: '#9a7b3f',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.05em',
                    fontFamily: 'Noto Sans JP, sans-serif'
                  }}
                >
                  {loading ? '送信中...' : '送信'}
                </button>
              </div>
            </div>

            {messages.length > 0 && (
              <div style={{ marginTop: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((message) => (
                  <div key={message.id} style={{
                    backgroundColor: message.sender === 'user' ? '#f0f0f0' : '#ffffff',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    borderLeft: message.sender === 'user' ? '3px solid #9a7b3f' : 'none'
                    marginLeft: message.sender === 'user' ? '0' : 'auto'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '0.25rem', color: '#1a1a1a' }}>
                      {message.sender === 'user' ? 'あなた' : '黒川聖羅'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '12px', color: '#6b726b' }}>
              ※ 現在、返信はシミュレーションです。<br />
              実際の運用では、LINE Botを通じてご相談ください。
            </div>
          </div>
        </main>

      <footer style={{ textAlign: 'center', padding: '2rem', fontSize: '10px', color: '#6b726b', borderTop: '1px solid #e5e5e5' }}>
        © ai×me lab / 監修｜黒川聖羅
      </footer>
    </div>
  )
}
