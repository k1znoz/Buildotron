import { Navbar } from '../react/Navbar'
import type { SectionContentProps } from '../../src/types'

export function NavbarPreview(props: SectionContentProps) {
  return <Navbar {...props} preview />
}
