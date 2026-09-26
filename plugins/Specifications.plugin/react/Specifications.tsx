import { Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Specifications({
  title,
  body,
  specifications = [],
}: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--specifications">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      <dl className="specifications-list">
        {specifications.map((item, index) => (
          <div className="specifications-list__item" key={index}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
