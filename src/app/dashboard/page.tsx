'use client'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', padding: '48px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 400, letterSpacing: '0.1em' }}>
          口コミ経営カルテ
        </h1>
      </header>
      <main>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
          <Link href="/dashboard/reviews" style={{ padding: '24px', backgroundColor: 'white', border: '1px solid #ddd', textDecoration: 'none', color: '#000' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>🖊️</div>
            <div style={{ fontFamily: 'serif', fontSize: '14px' }}>AI口コミ返信案</div>
          </Link>
          <Link href="/dashboard/consultation" style={{ padding: '24px', backgroundColor: 'white', border: '1px solid #ddd', textDecoration: 'none', color: '#000' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontFamily: 'serif', fontSize: '14px' }}>経営相談</div>
          </Link>
        </div>
      </main>
    </div>
  )
}
