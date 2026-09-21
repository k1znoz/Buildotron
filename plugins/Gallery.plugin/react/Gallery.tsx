import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Gallery({ title, body }: SectionContentProps) {
  return <div className="plugin-content plugin-content--gallery">
    <Text as="h2" className="plugin-content__title">{title}</Text>
    <Text as="p" className="plugin-content__body">{body}</Text>
    <div className="gallery-grid" aria-hidden="true">
      <Card as="div" className="gallery-grid__placeholder">Image placeholder</Card>
      <Card as="div" className="gallery-grid__placeholder">Image placeholder</Card>
    </div>
  </div>
}
