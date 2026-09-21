import type { ImgHTMLAttributes } from 'react'

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> & {
  alt: string
}

export function Image({
  alt,
  loading = 'lazy',
  className = '',
  ...props
}: ImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      loading={loading}
      className={['ds-image', className].filter(Boolean).join(' ')}
    />
  )
}
