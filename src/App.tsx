import csvText from './data/lenders.csv?raw'
import { parseAndNormalizeLenders } from './domain/normalize.ts'
import './App.css'

const lenderPrograms = parseAndNormalizeLenders(csvText)
const uniqueLenderCount = new Set(
  lenderPrograms.map((program) => program.lenderName),
).size

function App() {
  return (
    <section id="center">
      <h1>Lender comparison</h1>
      <p>Total lender programs loaded: {lenderPrograms.length}</p>
      <p>Total unique lenders loaded: {uniqueLenderCount}</p>
    </section>
  )
}

export default App
