import { Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Footer({ title, body }: SectionContentProps) {
  return (
    <footer className="plugin-content plugin-content--footer">
      <Text as="p" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
    </footer>
  )
}
