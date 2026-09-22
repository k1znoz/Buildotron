import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function FAQ({ title, body, questions = [] }: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--faq">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      <div className="faq-list">
        {questions.map((item, index) => (
          <Card as="div" key={index}>
            <details>
              <summary>{item.question}</summary>
              <Text as="p">{item.answer}</Text>
            </details>
          </Card>
        ))}
      </div>
    </div>
  )
}
