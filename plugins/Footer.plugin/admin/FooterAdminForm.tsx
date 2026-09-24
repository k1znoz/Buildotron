import { LinksAdminForm } from '../../src/admin/LinksAdminForm'
import type { FooterContent } from './footerContent'

type Props = {
  initialContent: FooterContent
  onApply: (content: FooterContent) => void
}

export function FooterAdminForm(props: Props) {
  return <LinksAdminForm {...props} sectionName="Le Footer" />
}
