export function isSafeHref(value: string): boolean {
  if (!value || value !== value.trim() || /[\u0000-\u001f\u007f]/.test(value))
    return false
  if (value.startsWith('#')) return value.length > 1
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\'))
    return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function isSafeImageSrc(value: string): boolean {
  return isSafeHref(value) && !value.startsWith('#')
}
