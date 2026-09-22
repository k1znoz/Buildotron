import { Hero } from '../react/Hero'
import type { HeroProps } from '../react/Hero'

export function HeroPreview(props: HeroProps) {
  return (
    <div className="hero-preview">
      <Hero {...props} preview />
    </div>
  )
}
