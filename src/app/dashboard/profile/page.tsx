'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/ui/Header'

interface Profile {
  salon_name?: string
  business_type?: string
  google_review_url?: string
  other_review_url_1?: string
  other_review_url_2?: string
  other_review_url_3?: string
}

const bizLabel: Record<string, string> = {
  hair: '美容室',
  nail: 'ネイルサロン',
  esthetic: 'エステサロン',
  other: 'その他'
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [salonName, setSalonName] = useState('')
  const [businessType, setBusinessType] = useState<'hair' | 'nail' | 'esthetic' | 'other'>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null)
  const [otherUrls, setOtherUrls] = useState(['', '', '', ''])
  const [showApiKeyMessage, setShowApiKeyMessage] = useState(false)

  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        if (data.salon_name) setSalonName(data.salon_name)
        if (data.business_type) setBusinessType(data.business_type)
        const urls = [data.other_review_url_1 || '', data.other_review_url_2 || '', data.other_review_url_3 || '']
        setOtherUrls(urls)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !process.env.GOOGLE_MAPS_API_KEY) {
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        setShowApiKeyMessage(true)
      }
      return
    }

    setShowApiKeyMessage(false)
    setIsSearching(true)
    setSearchResults([])
    setSelectedPlace(null)

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${process.env.GOOGLE_MAPS_API_KEY}&language=ja&region=JP`
      )
      const data = await response.json()

      if (data.candidates && data.candidates.length > 0) {
        setSearchResults(data.candidates)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectPlace = (place: any) => {
    setSelectedPlace(place)
    if (place.formatted_address) {
      setSalonName(place.formatted_address)
    }
  }

  const addUrlField = () => {
    const emptyIndex = otherUrls.findIndex(url => url === '')
    if (emptyIndex !== -1) {
      const newUrls = [...otherUrls]
      newUrls[emptyIndex] = ''
      setOtherUrls(newUrls)
    }
  }

  const removeUrlField = (index: number) => {
    const newUrls = otherUrls.filter((_, i) => i !== index)
    setOtherUrls(newUrls)
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updateData: any = {
        salon_name: salonName || profile?.salon_name,
        business_type: businessType || profile?.business_type,
      }

      // 口コミサイトURLを更新
      otherUrls.forEach((url, index) => {
        if (url) {
          updateData[`other_review_url_${index + 1}`] = url
        }
      })

      const { error } = await supabase.from('users').update(updateData).eq('id', user.id)

      if (!error) {
        alert('店舗情報を保存しました')
        setProfile({ ...profile, ...updateData })
      } else {
        alert('保存に失敗しました')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f0e8', flexDirection: 'column', fontFamily: 'Noto Sans JP, sans-serif' }}>
      <Header onLogout={handleLogout} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 24px' }}>
        <p style={{ fontSize: '13px', color: '#888888' }}>読み込み中...</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f0e8', flexDirection: 'column', fontFamily: 'Noto Sans JP, sans-serif' }}>
      <Header onLogout={handleLogout} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', flex: 1 }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h1 style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '28px', fontWeight: 700, letterSpacing: '0.1em', color: '#0a0a0a', margin: '0 0 12px 0' }}>
            店舗情報の登録
          </h1>
          <p style={{ fontSize: '13px', color: '#666666', lineHeight: '1.8', marginBottom: '32px' }}>
            口コミ分析を始めるために、店舗の基本情報と口コミ導線を登録してください。
          </p>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px', fontWeight: 600 }}>
              店舗名
            </label>
            <input
              type="text"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              placeholder="例：サロン・ヘアサロン"
              style={{ width: '100%', padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px', fontWeight: 600 }}>
              業種
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#0a0a0a', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="business_type"
                  value="hair"
                  checked={businessType === 'hair'}
                  onChange={() => setBusinessType('hair')}
                  style={{ marginRight: '8px' }}
                />
                <span>{bizLabel.hair}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#0a0a0a', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="business_type"
                  value="nail"
                  checked={businessType === 'nail'}
                  onChange={() => setBusinessType('nail')}
                  style={{ marginRight: '8px' }}
                />
                <span>{bizLabel.nail}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#0a0a0a', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="business_type"
                  value="esthetic"
                  checked={businessType === 'esthetic'}
                  onChange={() => setBusinessType('esthetic')}
                  style={{ marginRight: '8px' }}
                />
                <span>{bizLabel.esthetic}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#0a0a0a', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="business_type"
                  value="other"
                  checked={businessType === 'other'}
                  onChange={() => setBusinessType('other')}
                  style={{ marginRight: '8px' }}
                />
                <span>{bizLabel.other}</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px', fontWeight: 600 }}>
              Google店舗検索
            </label>
            <div style={{ border: '1px solid #cccccc', borderRadius: '6px', padding: '16px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="店舗名または住所を入力"
                  disabled={!process.env.GOOGLE_MAPS_API_KEY}
                  style={{ flex: 1, padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a', opacity: process.env.GOOGLE_MAPS_API_KEY ? 1 : 0.5 }}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim() || !process.env.GOOGLE_MAPS_API_KEY}
                  style={{ padding: '13px 24px', backgroundColor: isSearching ? '#cccccc' : (process.env.GOOGLE_MAPS_API_KEY ? '#0a0a0a' : '#cccccc'), color: '#f5f0e8', border: 'none', fontSize: '13px', cursor: isSearching || !searchQuery.trim() || !process.env.GOOGLE_MAPS_API_KEY ? 'not-allowed' : 'pointer', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 600 }}
                >
                  {isSearching ? '検索中...' : 'Google店舗を検索'}
                </button>
              </div>

              {showApiKeyMessage && (
                <p style={{ fontSize: '12px', color: '#cc3333', marginTop: '12px' }}>
                  ⚠️ Google APIキーが未設定のため検索は利用できません。管理者にお問い合わせください。
                </p>
              )}

              {searchResults.length > 0 && (
                <div style={{ maxHeight: '200px', overflowY: 'auto', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
                  {searchResults.map((place, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPlace(place)}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        backgroundColor: selectedPlace === place ? '#f5f0e8' : 'white',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>{place.name}</div>
                      <div style={{ fontSize: '12px', color: '#666666' }}>{place.formatted_address || place.vicinity || ''}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPlace && (
                <div style={{ padding: '12px', backgroundColor: '#f5f0e8', borderRadius: '4px', marginTop: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>選択した店舗:</div>
                  <div style={{ fontSize: '13px', color: '#0a0a0a' }}>{selectedPlace.formatted_address}</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#0a0a0a', marginBottom: '8px', fontWeight: 600 }}>
              その他の口コミサイトURL
            </label>
            {otherUrls.map((url, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...otherUrls]
                    newUrls[index] = e.target.value
                    setOtherUrls(newUrls)
                  }}
                  placeholder="https://..."
                  style={{ flex: 1, padding: '13px 16px', border: '1px solid #cccccc', backgroundColor: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Noto Sans JP, sans-serif', color: '#0a0a0a' }}
                />
                {otherUrls.length > 1 && (
                  <button
                    onClick={() => removeUrlField(index)}
                    style={{ padding: '8px 12px', backgroundColor: '#ffdddd', color: '#cc3333', border: 'none', fontSize: '12px', cursor: 'pointer', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 600 }}
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button
                onClick={addUrlField}
                style={{ padding: '13px 24px', backgroundColor: '#0a0a0a', color: '#f5f0e8', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 600 }}
              >
                ＋追加
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '48px', marginBottom: '32px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '15px 40px', backgroundColor: saving ? '#cccccc' : '#c9a84c', color: '#0a0a0a', border: 'none', fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 600, minWidth: '200px' }}
            >
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/dashboard" style={{ fontSize: '12px', color: '#888888', textDecoration: 'none' }}>
              ダッシュボードへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
