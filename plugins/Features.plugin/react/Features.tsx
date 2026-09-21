import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Features({ title, body }: SectionContentProps) {
  return <div className="plugin-content plugin-content--features">
    <Text as="h2" className="plugin-content__title">{title}</Text>
    <Text as="p" className="plugin-content__body">{body}</Text>
    <div className="features-grid" aria-hidden="true">
      <Card as="div">Feature 1</Card><Card as="div">Feature 2</Card><Card as="div">Feature 3</Card>
    </div>
  </div>
}
