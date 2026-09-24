import { validateActionContent } from '../../src/admin/actionContent.ts'
import type { ActionContent } from '../../src/admin/actionContent.ts'

export type CTAContent = ActionContent

export function validateCTAContent(content: CTAContent): string | null {
  return validateActionContent(content, true)
}
