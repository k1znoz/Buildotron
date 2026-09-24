import { ActionAdminForm } from '../../src/admin/ActionAdminForm'
import type { CTAContent } from './ctaContent'

type Props = {
  initialContent: CTAContent
  onApply: (content: CTAContent) => void
}

export function CTAAdminForm(props: Props) {
  return <ActionAdminForm {...props} requiredAction />
}
