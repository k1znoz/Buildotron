import { ActionAdminForm } from '../../src/admin/ActionAdminForm'
import type { HeroContent } from './heroContent'

type Props = {
  initialContent: HeroContent
  onApply: (content: HeroContent) => void
}

export function HeroAdminForm(props: Props) {
  return <ActionAdminForm {...props} requiredAction={false} />
}
