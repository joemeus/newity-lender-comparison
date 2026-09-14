import { useState } from 'react'
import { BorrowerForm } from './components/BorrowerForm.tsx'
import { ProgramResults } from './components/ProgramResults.tsx'
import csvText from './data/lenders.csv?raw'
import type { BorrowerInput } from './domain/borrower.ts'
import { findMatchingPrograms, type ProgramMatch } from './domain/matching.ts'
import { parseAndNormalizeLenders } from './domain/normalize.ts'
import './App.css'

const lenderPrograms = parseAndNormalizeLenders(csvText)
const uniqueLenderCount = new Set(
  lenderPrograms.map((program) => program.lenderName),
).size

function App() {
  const [matches, setMatches] = useState<ProgramMatch[] | null>(null)

  function handleSubmit(borrower: BorrowerInput) {
    setMatches(findMatchingPrograms(borrower, lenderPrograms))
  }

  return (
    <section id="center">
      <h1>Lender comparison</h1>
      <p>Enter the borrower details, then find matching programs.</p>
      <BorrowerForm onSubmit={handleSubmit} />
      {matches !== null && <ProgramResults matches={matches} />}
      <p>Total lender programs loaded: {lenderPrograms.length}</p>
      <p>Total unique lenders loaded: {uniqueLenderCount}</p>
    </section>
  )
}

export default App
