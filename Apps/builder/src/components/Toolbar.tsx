import { useRef } from 'react'
import { Button } from '@buildotron/design-system'

type Props = {
  projectName: string
  onSave: () => void
  onOpen: (file: File) => void
  onCheckSections: () => void
}

export function Toolbar({
  projectName,
  onSave,
  onOpen,
  onCheckSections,
}: Props) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <header className="toolbar">
      <strong className="toolbar__brand">Buildotron</strong>
      <span className="toolbar__project">Product Landing / {projectName}</span>
      <nav className="toolbar__actions" aria-label="Project actions">
        <input
          ref={input}
          className="visually-hidden"
          type="file"
          accept=".json,application/json"
          aria-label="Ouvrir un projet JSON"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onOpen(file)
            event.target.value = ''
          }}
        />
        <Button onClick={() => input.current?.click()}>Ouvrir JSON</Button>
        <Button onClick={onSave}>Enregistrer JSON</Button>
        <Button onClick={onCheckSections}>Contrôler les sections</Button>
        <Button
          variant="primary"
          disabled
          title="Disponible au jalon Code Generator"
        >
          Export React
        </Button>
      </nav>
    </header>
  )
}
