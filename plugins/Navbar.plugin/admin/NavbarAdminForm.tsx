import { LinksAdminForm } from '../../src/admin/LinksAdminForm'
import type { NavbarContent } from './navbarContent'

type Props = {
  initialContent: NavbarContent
  onApply: (content: NavbarContent) => void
}

export function NavbarAdminForm(props: Props) {
  return <LinksAdminForm {...props} sectionName="La Navbar" />
}
