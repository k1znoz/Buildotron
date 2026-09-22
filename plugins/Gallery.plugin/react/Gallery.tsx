import { Card, Image, Text } from '@buildotron/design-system'
import { isSafeImageSrc } from '@buildotron/plugin-sdk'
import type { SectionContentProps } from '../../src/types'

export function Gallery({ title, body, images = [] }: SectionContentProps) {
  return (
    <div className="plugin-content plugin-content--gallery">
      <Text as="h2" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      {images.length ? (
        <div className="gallery-grid">
          {images.map((image, index) =>
            isSafeImageSrc(image.src) && image.alt.trim() ? (
              <Card as="div" key={index} className="gallery-grid__item">
                <Image src={image.src} alt={image.alt} />
              </Card>
            ) : null,
          )}
        </div>
      ) : (
        <Text as="p" className="plugin-content__body">
          Ajoutez une image dans l'inspecteur.
        </Text>
      )}
    </div>
  )
}
