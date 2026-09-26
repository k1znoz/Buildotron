import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Steps({ title, body, items = [] }: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--steps">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      <ol className="steps-list">
        {items.map((item, index) => (
          <li key={index}>
            <Card as="div" className="steps-list__card">
              <span className="steps-list__number" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <Text as="h3" className="features-grid__title">
                  {item.title}
                </Text>
                <Text as="p">{item.body}</Text>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  )
}
