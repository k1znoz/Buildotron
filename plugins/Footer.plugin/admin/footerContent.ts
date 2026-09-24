import { validateLinksContent } from '../../src/admin/linksContent.ts'
import type { LinksContent } from '../../src/admin/linksContent.ts'

export type FooterContent = LinksContent

export function validateFooterContent(content: FooterContent): string | null {
  return validateLinksContent(content, 'Le Footer')
}
