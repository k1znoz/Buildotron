import { Card, Text } from '@buildotron/design-system'
import type { SectionContentProps } from '../../src/types'

export function Product({ title, body }: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--product">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      <Card as="div" className="product-preview">
        <Text as="p">
          Les produits publiés du catalogue CMS seront affichés ici.
        </Text>
      </Card>
    </div>
  )
}
