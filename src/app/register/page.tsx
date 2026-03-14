'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/ui/Header'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleRegister = async () => {
    if (!email || !password) { setError('メールアドレスとパスワードを入力してください'); return }
    if (password.length < 6) { setError('パスワードは6文字以上で設定してください'); return }
    if (!agreedToTerms) { setError('利用規約への同意が必須です'); return }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('登録に失敗しました。もう一度お試しください。')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (!agreedToTerms) {
      alert('利用規約への同意が必須です')
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', display: 'flex', flexDirection: 'column', fontFamily: 'Noto Sans JP, sans-serif' }}>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#888888', marginBottom: '12px' }}>ai×me lab</p>
          <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '22px', fontWeight: 400, letterSpacing: '0.2em', color: '#0a0a0a', margin: '0 0 12px 0' }}>口コミ経営カルテ</h1>
          <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a84c', margin: '0 auto 12px' }} />
          <h2 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '28px', fontWeight: 700, letterSpacing: '0.1em', color: '#0a0a0a', margin: '0 0 32px 0' }}>新規会員登録</h2>
        </div>
        <div style={{ width: '100%', maxWidth: '380px' }}>
        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#fff5f5', border: '1px solid #ffdddd', marginBottom: '20px', fontSize: '12px', color: '#cc3333' }}>
            {error}
          </div>
        )}

        <div style={{ border: '1px solid #d4c9b0', borderRadius: '6px', height: '140px', overflowY: 'scroll', padding: '16px', fontSize: '12px', color: '#555', lineHeight: '1.8', marginBottom: '20px', backgroundColor: '#ffffff' }}>
          <strong>【利用規約 要約】</strong><br />
          本サービス「口コミ経営カルテ」は、美容サロン向けの口コミ管理・経営支援サービスです。<br /><br />
          ・本サービスは経営成果（集客・売上・利益）を一切保証しません<br />
          ・提供する返信案・アドバイスはご参考情報です<br />
          ・月額料金はStripeにて自動課金されます<br />
          ・解約は月末申請で翌月末に終了します<br /><br />
          <a href="/terms" target="_blank" style={{ color: '#c9a84c' }}>▶ 利用規約の全文はこちら</a><br />
          <a href="/privacy" target="_blank" style={{ color: '#c9a84c' }}>▶ プライバシーポリシーの全文はこちら</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#c9a84c', marginTop: '2px', flexShrink: 0 }}
          />
          <label htmlFor="agreeTerms" style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>
            利用規約およびプライバシーポリシーを確認し、同意します（必須）
          </label>
        </div>

        <div style={{ height: '1px', backgroundColor: '#cccccc', marginBottom: '24px' }} />

        <button onClick={handleGoogleLogin} disabled={!agreedToTerms} style={{ width: '100%', padding: '15px', backgroundColor: agreedToTerms ? '#0a0a0a' : '#cccccc', color: '#f5f0e8', border: 'none', fontSize: '13px', letterSpacing: '0.12em', cursor: agreedToTerms ? 'pointer' : 'not-allowed', marginBottom: '24px', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 500, opacity: agreedToTerms ? 1 : 0.5 }}>
          Googleアカウントで登録
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#cccccc' }} />
          <span style={{ fontSize: '10px', color: '#888888', letterSpacing: '0.15em' }}>または</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#cccccc' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px' }}>メールアドレス</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px' }}>パスワード（6文字以上）</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && handleRegister()} style={{ width: '100%', padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a' }} />
        </div>

        <button onClick={handleRegister} disabled={loading || !agreedToTerms} style={{ width: '100%', padding: '15px', backgroundColor: (loading || !agreedToTerms) ? '#cccccc' : '#c9a84c', color: '#0a0a0a', border: 'none', fontSize: '13px', letterSpacing: '0.12em', cursor: (loading || !agreedToTerms) ? 'not-allowed' : 'pointer', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 500, opacity: (loading || !agreedToTerms) ? 0.5 : 1 }}>
          {loading ? '登録中...' : '新規登録'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#888888', fontFamily: 'Noto Sans JP, sans-serif' }}>
          すでにアカウントをお持ちの方は
          <a href="/login" style={{ color: '#c9a84c', textDecoration: 'none', marginLeft: '4px' }}>ログイン</a>
        </p>
        </div>
      </div>
    </div>
  )
}
