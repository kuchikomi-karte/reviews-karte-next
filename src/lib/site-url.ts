export function getAuthCallbackUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  return `${siteUrl ?? ''}/auth/callback`
}
