import { useState } from 'react'
import { BorrowerForm } from './components/BorrowerForm.tsx'
import csvText from './data/lenders.csv?raw'
import type { BorrowerInput } from './domain/borrower.ts'
import type { LenderProgram } from './domain/lender.ts'
import { findMatchingPrograms } from './domain/matching.ts'
import { parseAndNormalizeLenders } from './domain/normalize.ts'
import './App.css'

const lenderPrograms = parseAndNormalizeLenders(csvText)
const uniqueLenderCount = new Set(
  lenderPrograms.map((program) => program.lenderName),
).size

function App() {
  const [matches, setMatches] = useState<LenderProgram[] | null>(null)

  function handleSubmit(borrower: BorrowerInput) {
    setMatches(findMatchingPrograms(borrower, lenderPrograms))
  }

  return (
    <section id="center">
      <h1>Lender comparison</h1>
      <p>Enter the borrower details, then find matching programs.</p>
      <BorrowerForm onSubmit={handleSubmit} />
      {matches !== null && (
        <ul style={{ textAlign: 'left' }}>
          {matches.map((program) => (
            <li key={`${program.lenderName}-${program.programType}`}>
              {program.lenderName} — {program.programType}
            </li>
          ))}
        </ul>
      )}
      <p>Total lender programs loaded: {lenderPrograms.length}</p>
      <p>Total unique lenders loaded: {uniqueLenderCount}</p>
    </section>
  )
}

export default App
