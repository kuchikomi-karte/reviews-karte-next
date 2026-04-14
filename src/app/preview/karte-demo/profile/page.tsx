'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type CSSProperties } from 'react'
import PreviewShell from '@/components/preview/PreviewShell'

type ProfileForm = {
  name: string
  salon_name: string
  business_type: string
  google_review_url: string
  other_review_url_1: string
}

export default function ProfilePage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    salon_name: '',
    business_type: '',
    google_review_url: '',
    other_review_url_1: '',
  })

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('name, salon_name, business_type, google_review_url, other_review_url_1')
        .eq('id', session.user.id)
        .maybeSingle()

      if (data) {
        setForm({
          name: data.name || '',
          salon_name: data.salon_name || '',
          business_type: data.business_type || '',
          google_review_url: data.google_review_url || '',
          other_review_url_1: data.other_review_url_1 || '',
        })
      }
      setLoading(false)
    }

    void load()
  }, [router, supabase])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSaving(false)
      router.push('/login')
      return
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle()

    const payload = { ...form }
    let error
    if (existing) {
      const result = await supabase.from('users').update(payload).eq('id', session.user.id)
      error = result.error
    } else {
      const result = await supabase.from('users').insert({
        id: session.user.id,
        email: session.user.email,
        ...payload,
      })
      error = result.error
    }

    setSaving(false)
    setMessage(error ? `保存に失敗しました: ${error.message}` : '保存しました ✓')
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('登録データを削除してリセットしますか？\nこの操作は取り消せません。')) {
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return
    }

    await supabase.from('users').delete().eq('id', session.user.id)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    background: '#111',
    border: '0.5px solid #2a2a2a',
    color: '#ddd',
    borderRadius: '2px',
    outline: 'none',
    marginTop: '6px',
    fontFamily: 'Noto Sans JP, sans-serif',
    boxSizing: 'border-box',
  }

  const labelStyle: CSSProperties = {
    fontSize: '11px',
    color: '#666',
    letterSpacing: '0.06em',
    display: 'block',
  }

  if (loading) {
    return (
      <PreviewShell showSidebar={false}>
        <div style={{ padding: '40px', color: '#666', fontSize: '12px' }}>読み込み中...</div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell showSidebar={false}>
      <div style={{ background: '#0a0a0a', minHeight: 'calc(100vh - 102px)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: '36px' }}>
            <p style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '0.12em', marginBottom: '8px' }}>
              PROFILE SETTINGS
            </p>
            <h1
              style={{
                fontSize: '20px',
                color: '#e8e8e8',
                fontFamily: 'Shippori Mincho, serif',
                fontWeight: 400,
                letterSpacing: '0.06em',
              }}
            >
              プロフィール設定
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>担当者名</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="山田 花子"
              />
            </div>

            <div>
              <label style={labelStyle}>
                サロン名 <span style={{ color: '#c9a84c' }}>*</span>
              </label>
              <input
                style={inputStyle}
                value={form.salon_name}
                onChange={(e) => setForm({ ...form, salon_name: e.target.value })}
                placeholder="サロン名を入力"
              />
            </div>

            <div>
              <label style={labelStyle}>業種</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                value={form.business_type}
                onChange={(e) => setForm({ ...form, business_type: e.target.value })}
              >
                <option value="">業種を選択</option>
                <option value="美容室">美容室</option>
                <option value="ネイルサロン">ネイルサロン</option>
                <option value="エステサロン">エステサロン</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Google口コミURL</label>
              <input
                style={inputStyle}
                value={form.google_review_url}
                onChange={(e) => setForm({ ...form, google_review_url: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label style={labelStyle}>その他口コミサイトURL</label>
              <input
                style={inputStyle}
                value={form.other_review_url_1}
                onChange={(e) => setForm({ ...form, other_review_url_1: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '14px 0',
              background: saving ? '#1a1a1a' : '#c9a84c',
              color: saving ? '#555' : '#0a0a0a',
              border: 'none',
              fontSize: '12px',
              letterSpacing: '0.1em',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Noto Sans JP, sans-serif',
              transition: 'background 0.2s',
            }}
            type="button"
          >
            {saving ? '保存中...' : '保存する'}
          </button>

          {message && (
            <p
              style={{
                marginTop: '12px',
                fontSize: '12px',
                textAlign: 'center',
                color: message.includes('失敗') ? '#c55' : '#c9a84c',
                letterSpacing: '0.04em',
              }}
            >
              {message}
            </p>
          )}

          <div style={{ marginTop: '32px' }}>
            <button
              onClick={() => router.push('/preview/karte-demo')}
              style={{
                fontSize: '11px',
                color: '#555',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                padding: 0,
              }}
              type="button"
            >
              ← カルテに戻る
            </button>
          </div>

          <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '0.5px solid #1a1a1a' }}>
            <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.1em', marginBottom: '16px' }}>
              DANGER ZONE
            </p>
            <button
              onClick={handleDeleteAccount}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: '0.5px solid #3a1818',
                color: '#7a3030',
                fontSize: '11px',
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
              type="button"
            >
              アカウントデータを削除してリセット
            </button>
            <p style={{ fontSize: '10px', color: '#333', marginTop: '8px', letterSpacing: '0.02em' }}>
              登録データを削除してテスト環境をリセットできます
            </p>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}
