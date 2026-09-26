import type { SectionType } from '../project'
import { Button } from '@buildotron/design-system'
import { sectionPreviewImages } from '@buildotron/plugins'

const libraryGroups: { title: string; items: SectionType[] }[] = [
  { title: 'Navigation', items: ['Navbar'] },
  {
    title: 'Sections',
    items: [
      'Hero',
      'Features',
      'Gallery',
      'Product',
      'Steps',
      'Specifications',
      'FAQ',
      'CTA',
    ],
  },
  { title: 'Footer', items: ['Footer'] },
]

export function Library({ onAdd }: { onAdd: (type: SectionType) => void }) {
  return (
    <aside className="panel panel--library" aria-labelledby="library-title">
      <h2 className="panel__heading" id="library-title">
        Library
      </h2>
      {libraryGroups.map((group) => (
        <section
          className="library-group"
          key={group.title}
          aria-label={group.title}
        >
          <h3 className="library-group__title">{group.title}</h3>
          {group.items.map((item) => (
            <Button
              className="library-item"
              key={item}
              onClick={() => onAdd(item)}
            >
              <img
                className="library-item__preview"
                src={sectionPreviewImages[item]}
                alt=""
                aria-hidden="true"
              />
              <span>+ {item}</span>
            </Button>
          ))}
        </section>
      ))}
    </aside>
  )
}
