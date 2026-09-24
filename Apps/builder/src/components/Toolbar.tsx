import { useRef } from 'react'
import { Button } from '@buildotron/design-system'

type Props = {
  projectName: string
  blueprintName: string
  onSave: () => void | Promise<void>
  onOpen: (file: File) => void
  onCheckSections: () => void
  onExport: () => void
  exporting: boolean
}

export function Toolbar({
  projectName,
  blueprintName,
  onSave,
  onOpen,
  onCheckSections,
  onExport,
  exporting,
}: Props) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <header className="toolbar">
      <strong className="toolbar__brand">Buildotron</strong>
      <span className="toolbar__project">
        {blueprintName} / {projectName}
      </span>
      <nav className="toolbar__actions" aria-label="Project actions">
        <input
          ref={input}
          className="visually-hidden"
          type="file"
          accept=".json,.zip,application/json,application/zip"
          aria-label="Ouvrir un projet Buildotron"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onOpen(file)
            event.target.value = ''
          }}
        />
        <Button onClick={() => input.current?.click()}>Ouvrir projet</Button>
        <Button onClick={() => void onSave()}>Enregistrer projet</Button>
        <Button onClick={onCheckSections}>Contrôler les sections</Button>
        <Button variant="primary" onClick={onExport} disabled={exporting}>
          {exporting ? 'Export en cours…' : 'Exporter React'}
        </Button>
      </nav>
    </header>
  )
}
