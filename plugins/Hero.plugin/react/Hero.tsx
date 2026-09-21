import { Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export type HeroProps = SectionContentProps

export function Hero({ title, body }: HeroProps) {
  return <div className="hero-content">
    <Text as="h1" className="hero-content__title">{title}</Text>
    <Text as="p" className="hero-content__body">{body}</Text>
  </div>
}
