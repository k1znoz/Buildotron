import type { SectionType } from '../project'
import { Button } from '@buildotron/design-system'
import { pluginCatalog } from '@buildotron/plugins'

const groupTitle = (slot: string) =>
  slot === 'header' ? 'Navigation' : slot === 'footer' ? 'Footer' : 'Sections'

const libraryGroups = ['Navigation', 'Sections', 'Footer'].map((title) => ({
  title,
  items: pluginCatalog.filter(
    (plugin) => groupTitle(plugin.manifest.defaultSlot) === title,
  ),
}))

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
          {group.items.map((plugin) => (
            <Button
              className="library-item"
              key={plugin.manifest.id}
              onClick={() => onAdd(plugin.manifest.name as SectionType)}
            >
              <img
                className="library-item__preview"
                src={plugin.previewImage}
                alt=""
                aria-hidden="true"
              />
              <span>+ {plugin.manifest.name}</span>
            </Button>
          ))}
        </section>
      ))}
    </aside>
  )
}
