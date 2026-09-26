import { Product } from '../react/Product'
import type { SectionContentProps } from '../../src/types'

export function ProductPreview(props: SectionContentProps) {
  return <Product {...props} />
}
