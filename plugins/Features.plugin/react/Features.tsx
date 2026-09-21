import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Features({ title, body, items = [] }: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--features">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      <div className="features-grid">
        {items.map((item, index) => (
          <Card as="article" key={index}>
            <Text as="h3" className="features-grid__title">
              {item.title}
            </Text>
            <Text as="p">{item.body}</Text>
          </Card>
        ))}
      </div>
    </div>
  )
}
