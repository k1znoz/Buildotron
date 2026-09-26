import type { DragEvent } from 'react'
import { Text } from '@buildotron/design-system'
import { SectionPreview, sectionPreviews } from '@buildotron/plugins'
import { defaultSlot, slotLabels, slots } from '../project'
import { insertionBeforeId } from '../projectActions'
import type { Project, Slot } from '../project'
import { blueprints } from '../../../../blueprints/index.ts'

type Props = {
  project: Project
  selectedId: string | null
  onSelect: (id: string) => void
  onMove: (id: string, slot: Slot, beforeId?: string) => void
  onMoveBy: (id: string, offset: -1 | 1) => void
}

export function Canvas({
  project,
  selectedId,
  onSelect,
  onMove,
  onMoveBy,
}: Props) {
  function drop(event: DragEvent, slot: Slot, beforeId?: string) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (id) onMove(id, slot, beforeId)
  }

  return (
    <section className="canvas" aria-label="Page canvas">
      <article
        className="page-preview"
        aria-label={`${blueprints[project.blueprint].name} preview`}
      >
        <div className="page-preview__bar">
          <span>{blueprints[project.blueprint].name}</span>
          <span>Desktop</span>
        </div>
        {slots.map((slot) => (
          <div
            className="preview-slot"
            key={slot}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => drop(event, slot)}
          >
            <div className="preview-slot__heading">{slotLabels[slot]}</div>
            {project.sections
              .filter((section) => section.slot === slot)
              .map((section) => (
                <section
                  className={`preview-section ${section.type === 'Hero' ? 'preview-section--hero' : ''} ${selectedId === section.id ? 'preview-section--selected' : ''}`}
                  key={section.id}
                  draggable
                  onClick={() => onSelect(section.id)}
                  onDragStart={(event) =>
                    event.dataTransfer.setData('text/plain', section.id)
                  }
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.stopPropagation()
                    const draggedId = event.dataTransfer.getData('text/plain')
                    const bounds = event.currentTarget.getBoundingClientRect()
                    const lowerHalf =
                      event.clientY > bounds.top + bounds.height / 2
                    drop(
                      event,
                      slot,
                      insertionBeforeId(
                        project,
                        draggedId,
                        section.id,
                        lowerHalf,
                      ),
                    )
                  }}
                >
                  <button
                    className="preview-section__select"
                    type="button"
                    onClick={() => onSelect(section.id)}
                    onFocus={() => onSelect(section.id)}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'ArrowUp' ||
                        event.key === 'ArrowDown'
                      ) {
                        event.preventDefault()
                        onMoveBy(section.id, event.key === 'ArrowUp' ? -1 : 1)
                      }
                    }}
                    aria-keyshortcuts="ArrowUp ArrowDown"
                    aria-pressed={selectedId === section.id}
                    aria-label={`Sélectionner ${section.type}`}
                  >
                    <span className="preview-section__label">
                      {section.type}
                      {section.slot !== defaultSlot[section.type]
                        ? ' · override'
                        : ''}
                    </span>
                    {!sectionPreviews[section.type] && (
                      <>
                        <Text
                          as="span"
                          className="preview-section__placeholder"
                        >
                          {section.properties.title}
                        </Text>
                        <Text as="span" className="preview-section__copy">
                          {section.properties.body}
                        </Text>
                      </>
                    )}
                  </button>
                  {sectionPreviews[section.type] && (
                    <SectionPreview
                      type={section.type}
                      title={section.properties.title}
                      body={section.properties.body}
                      actionLabel={section.properties.actionLabel}
                      actionHref={section.properties.actionHref}
                      items={section.properties.items}
                      images={section.properties.images}
                      questions={section.properties.questions}
                      links={section.properties.links}
                      specifications={section.properties.specifications}
                    />
                  )}
                </section>
              ))}
            {project.sections.every((section) => section.slot !== slot) && (
              <p className="preview-slot__empty">Déposez une section ici</p>
            )}
          </div>
        ))}
      </article>
    </section>
  )
}
