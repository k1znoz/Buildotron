import type { HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLElement> & { as?: 'article' | 'div' }

export function Card({
  as: Element = 'article',
  className = '',
  ...props
}: CardProps) {
  return (
    <Element
      {...props}
      className={['ds-card', className].filter(Boolean).join(' ')}
    />
  )
}
