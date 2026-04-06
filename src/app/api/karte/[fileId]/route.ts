import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  KarteAccessError,
  fetchPreparedDriveHtml,
  getPublishedKarteByFileIdForUser,
} from '@/lib/server/karte-drive'

type RouteContext = {
  params: Promise<{ fileId: string }>
}

export async function GET(_: Request, { params }: RouteContext) {
  const { fileId } = await params
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 })
  }

  try {
    await getPublishedKarteByFileIdForUser(supabase, user.id, fileId)
    const html = await fetchPreparedDriveHtml(fileId)

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    if (error instanceof KarteAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('Karte API error:', error)
    return NextResponse.json(
      { error: 'ファイルの取得に失敗しました。' },
      { status: 500 },
    )
  }
}
