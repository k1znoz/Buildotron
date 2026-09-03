import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { Library } from './components/Library'
import { Toolbar } from './components/Toolbar'
import './App.css'

function App() {
  return (
    <main className="builder-shell" aria-label="Buildotron Builder">
      <Toolbar />
      <div className="builder-workspace">
        <Library />
        <Canvas />
        <Inspector />
      </div>
    </main>
  )
}

export default App
