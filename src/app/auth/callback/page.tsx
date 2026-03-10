'use client'

import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      await supabase.auth.getSession()
      router.push('/dashboard')
      router.refresh()
    }
    handleCallback()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Noto Sans JP, sans-serif', fontSize: '13px', color: '#888888', letterSpacing: '0.1em' }}>
      ログイン中...
    </div>
  )
}
