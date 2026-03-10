'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>

      {/* ロゴ */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gray)', fontFamily: 'Noto Sans JP, sans-serif', marginBottom: '8px' }}>ai×me lab</p>
        <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '20px', fontWeight: 400, letterSpacing: '0.15em', color: 'var(--black)' }}>口コミ経営カルテ</h1>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--gray)', marginTop: '8px', fontFamily: 'Noto Sans JP, sans-serif' }}>監修｜黒川聖羅</p>
      </div>

      {/* フォーム */}
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#fff0f0', border: '1px solid #ffcccc', marginBottom: '24px', fontSize: '12px', color: '#cc0000', fontFamily: 'Noto Sans JP, sans-serif' }}>
            {error}
          </div>
        )}

        {/* Googleログイン */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--black)',
            color: 'var(--cream)',
            border: 'none',
            fontSize: '13px',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            fontFamily: 'Noto Sans JP, sans-serif',
            marginBottom: '24px',
          }}
        >
          Googleアカウントでログイン
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--gray-light)' }} />
          <span style={{ fontSize: '11px', color: 'var(--gray)', letterSpacing: '0.1em', fontFamily: 'Noto Sans JP, sans-serif' }}>または</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--gray-light)' }} />
        </div>

        {/* メール */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--black)', marginBottom: '8px', fontFamily: 'Noto Sans JP, sans-serif' }}>
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--gray-light)',
              backgroundColor: 'white',
              fontSize: '14px',
              fontFamily: 'Noto Sans JP, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--black)', marginBottom: '8px', fontFamily: 'Noto Sans JP, sans-serif' }}>
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--gray-light)',
              backgroundColor: 'white',
              fontSize: '14px',
              fontFamily: 'Noto Sans JP, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--gold)',
            color: 'var(--black)',
            border: 'none',
            fontSize: '13px',
            letterSpacing: '0.1em',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontWeight: 500,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>

      </div>
    </div>
  )
}
