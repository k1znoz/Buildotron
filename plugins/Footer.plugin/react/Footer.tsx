import { Text } from '@buildotron/design-system'
import { isSafeHref } from '@buildotron/plugin-sdk'
import type { SectionContentProps } from '../../src/types'

export function Footer({
  title,
  body,
  links = [],
  preview = false,
}: SectionContentProps & { preview?: boolean }) {
  return (
    <footer className="plugin-content plugin-content--footer">
      <Text as="p" className="plugin-content__title">
        {title}
      </Text>
      <Text as="p" className="plugin-content__body">
        {body}
      </Text>
      {links.length > 0 && (
        <nav aria-label="Liens de pied de page">
          <ul className="footer-links">
            {links.map((link, index) =>
              isSafeHref(link.href) && link.label.trim() ? (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={
                      preview ? (event) => event.preventDefault() : undefined
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
      )}
    </footer>
  )
}
