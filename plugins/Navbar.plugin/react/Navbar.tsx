import { Text } from '@buildotron/design-system'
import { isSafeHref } from '@buildotron/plugin-sdk'
import type { SectionContentProps } from '../../src/types'

export function Navbar({
  title,
  body,
  links = [],
  preview = false,
}: SectionContentProps & { preview?: boolean }) {
  return (
    <nav className="navbar-content" aria-label="Navigation principale">
      <div className="navbar-content__brand">
        <Text as="span" className="navbar-content__title">
          {title}
        </Text>
        <Text as="span" className="navbar-content__body">
          {body}
        </Text>
      </div>
      {links.length > 0 && (
        <ul className="navbar-links">
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
      )}
    </nav>
  )
}
