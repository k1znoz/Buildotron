export type SectionContentProps = {
  title: string
  body: string
  actionLabel?: string
  actionHref?: string
  items?: { title: string; body: string }[]
  images?: { src: string; alt: string }[]
  questions?: { question: string; answer: string }[]
  links?: { label: string; href: string }[]
  specifications?: { label: string; value: string }[]
}
