import { Text } from '@buildotron/design-system'
import { isSafeHref } from '@buildotron/plugin-sdk'
import type { SectionContentProps } from '../../src/types'

export type HeroProps = SectionContentProps & { preview?: boolean }

export function Hero({
  title,
  body,
  actionLabel = 'Learn more',
  actionHref = '',
  preview = false,
}: HeroProps) {
  return (
    <div className="hero-content">
      <Text as="h1" className="hero-content__title">
        {title}
      </Text>
      <Text as="p" className="hero-content__body">
        {body}
      </Text>
      {isSafeHref(actionHref) && actionLabel.trim() && (
        <a
          className="ds-button ds-button--primary"
          href={actionHref}
          onClick={preview ? (event) => event.preventDefault() : undefined}
        >
          {actionLabel}
        </a>
      )}
    </div>
  )
}
