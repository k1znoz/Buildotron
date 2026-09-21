import type { HTMLAttributes } from 'react'

type TextElement = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TextProps = HTMLAttributes<HTMLElement> & { as?: TextElement }

export function Text({ as: Element = 'p', className = '', ...props }: TextProps) {
  return <Element {...props} className={['ds-text', className].filter(Boolean).join(' ')} />
}
