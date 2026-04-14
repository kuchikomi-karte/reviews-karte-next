export const USER_AVATAR_STORAGE_KEY = 'reviews-karte-user-avatar'
export const USER_AVATAR_UPDATED_EVENT = 'reviews-karte-avatar-updated'

export function getStoredUserAvatar() {
  if (typeof window === 'undefined') {
    return ''
  }

  try {
    return window.localStorage.getItem(USER_AVATAR_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveStoredUserAvatar(value: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(USER_AVATAR_STORAGE_KEY, value)
  window.dispatchEvent(new CustomEvent(USER_AVATAR_UPDATED_EVENT, { detail: value }))
}

export function clearStoredUserAvatar() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(USER_AVATAR_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(USER_AVATAR_UPDATED_EVENT, { detail: '' }))
}
