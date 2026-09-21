import { Button, Text } from '@buildotron/design-system'
import { isSafeHref } from '@buildotron/plugin-sdk'
import type { SectionContentProps } from '../../src/types'

export function CTA({ title, body, actionLabel = 'Get started', actionHref = '', preview = false }: SectionContentProps & { preview?: boolean }) {
  const linkReady = isSafeHref(actionHref) && Boolean(actionLabel.trim())
  return <div className="plugin-content plugin-content--cta">
    <Text as="h2" className="plugin-content__title">{title}</Text>
    <Text as="p" className="plugin-content__body">{body}</Text>
    {linkReady
      ? <a className="ds-button ds-button--primary" href={actionHref} onClick={preview ? (event) => event.preventDefault() : undefined}>{actionLabel}</a>
      : <Button variant="primary" disabled title="Action disponible après configuration du lien">Action à configurer</Button>}
  </div>
}
