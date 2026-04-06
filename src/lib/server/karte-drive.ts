import 'server-only'

import { google } from 'googleapis'
import type { SupabaseClient } from '@supabase/supabase-js'
import { prepareKarteHtml } from '@/lib/karte-html'

const ALLOWED_HTML_MIME_TYPES = new Set(['text/html', 'application/xhtml+xml'])

type KarteRow = {
  id: string
  file_id: string
  title?: string | null
  period?: string | null
  created_at?: string | null
}

export class KarteAccessError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'KarteAccessError'
    this.status = status
  }
}

function getDriveAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    throw new KarteAccessError('Google Drive 連携の環境変数が設定されていません。', 500)
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
}

function getDriveClient() {
  return google.drive({ version: 'v3', auth: getDriveAuth() })
}

async function verifyDriveFileMetadata(fileId: string) {
  const drive = getDriveClient()
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim()

  if (!folderId) {
    throw new KarteAccessError('Google Drive 保存先フォルダが設定されていません。', 500)
  }

  const { data } = await drive.files.get({
    fileId,
    fields: 'id, mimeType, name, parents',
    supportsAllDrives: true,
  })

  if (!data.mimeType || !ALLOWED_HTML_MIME_TYPES.has(data.mimeType)) {
    throw new KarteAccessError('HTML ファイルのみ表示できます。', 415)
  }

  if (!data.parents?.includes(folderId)) {
    throw new KarteAccessError('許可されていない Drive フォルダ内のファイルです。', 403)
  }
}

export async function fetchPreparedDriveHtml(fileId: string) {
  await verifyDriveFileMetadata(fileId)

  const drive = getDriveClient()
  const response = await drive.files.get(
    {
      fileId,
      alt: 'media',
      supportsAllDrives: true,
    },
    { responseType: 'text' },
  )

  if (typeof response.data !== 'string') {
    throw new KarteAccessError('HTML コンテンツの取得に失敗しました。', 500)
  }

  const html = String(response.data).trim()

  if (!html || !/<(html|body|div|section|article|main|h1|h2|h3|p)\b/i.test(html)) {
    throw new KarteAccessError('HTML コンテンツとして解釈できません。', 415)
  }

  return prepareKarteHtml(html)
}

export async function getPublishedKarteByIdForUser(
  supabase: SupabaseClient,
  userId: string,
  karteId: string,
) {
  const { data, error } = await supabase
    .from('karte')
    .select('id, file_id, title, period, created_at')
    .eq('id', karteId)
    .eq('user_id', userId)
    .eq('status', 'published')
    .maybeSingle<KarteRow>()

  if (error) {
    throw new KarteAccessError('カルテ情報の取得に失敗しました。', 500)
  }

  if (!data) {
    throw new KarteAccessError('対象のカルテを参照できません。', 403)
  }

  return data
}

export async function getPublishedKarteByFileIdForUser(
  supabase: SupabaseClient,
  userId: string,
  fileId: string,
) {
  const { data, error } = await supabase
    .from('karte')
    .select('id, file_id')
    .eq('file_id', fileId)
    .eq('user_id', userId)
    .eq('status', 'published')
    .maybeSingle<KarteRow>()

  if (error) {
    throw new KarteAccessError('カルテ情報の取得に失敗しました。', 500)
  }

  if (!data) {
    throw new KarteAccessError('対象のカルテを参照できません。', 403)
  }

  return data
}
