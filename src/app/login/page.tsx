'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/ui/Header'
import { getAuthCallbackUrl } from '@/lib/site-url'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) { setError('メールアドレスとパスワードを入力してください'); return }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getAuthCallbackUrl() },
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', display: 'flex', flexDirection: 'column', fontFamily: 'Noto Sans JP, sans-serif' }}>
      <Header authLinkHref="/register" authLinkLabel="新規登録" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#fff5f5', border: '1px solid #ffdddd', marginBottom: '20px', fontSize: '12px', color: '#cc3333', letterSpacing: '0.05em' }}>
            {error}
          </div>
        )}
        <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '15px', backgroundColor: '#0a0a0a', color: '#f5f0e8', border: 'none', fontSize: '13px', letterSpacing: '0.12em', cursor: 'pointer', marginBottom: '28px', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 500 }}>
          Googleアカウントで登録・ログイン
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#cccccc' }} />
          <span style={{ fontSize: '10px', color: '#888888', letterSpacing: '0.15em' }}>または</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#cccccc' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px' }}>メールアドレス</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a' }} />
        </div>
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px' }}>パスワード</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a' }} />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#cccccc' : '#c9a84c', color: '#0a0a0a', border: 'none', fontSize: '13px', letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 500 }}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
        </div>
      </div>
    </div>
  )
}
