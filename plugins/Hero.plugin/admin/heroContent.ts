import { validateActionContent } from '../../src/admin/actionContent.ts'
import type { ActionContent } from '../../src/admin/actionContent.ts'

export type HeroContent = ActionContent

export function validateHeroContent(content: HeroContent): string | null {
  return validateActionContent(content, false)
}
