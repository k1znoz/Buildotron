import { validateLinksContent } from '../../src/admin/linksContent.ts'
import type { LinksContent } from '../../src/admin/linksContent.ts'

export type NavbarContent = LinksContent

export function validateNavbarContent(content: NavbarContent): string | null {
  return validateLinksContent(content, 'La Navbar')
}
