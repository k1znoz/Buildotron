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
  if (
    value.length <= 7_000_000 &&
    /^data:image\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/]+=*$/i.test(value)
  )
    return true
  return isSafeHref(value) && !value.startsWith('#')
}

export const pluginSlots = [
  'header',
  'hero',
  'content',
  'conversion',
  'footer',
] as const

export type PluginSlot = (typeof pluginSlots)[number]

export type PluginManifest = {
  id: string
  name: string
  category: string
  version: string
  supports: string[]
  defaultSlot: PluginSlot
  defaults: Record<string, unknown>
}

export type PluginFieldType = 'text' | 'textarea' | 'url' | 'list'

export type PluginField = {
  name: string
  type: PluginFieldType
  required: boolean
}

export type PluginSchema = {
  fields: PluginField[]
}
