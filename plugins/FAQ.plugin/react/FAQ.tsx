import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function FAQ({ title, body }: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--faq">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Card as="div">
        <Text as="p" className="plugin-content__body">
          {body}
        </Text>
      </Card>
    </div>
  )
}
