import { useState } from 'react'
import { BorrowerForm } from './components/BorrowerForm.tsx'
import { ProgramComparison } from './components/ProgramComparison.tsx'
import { ProgramResults } from './components/ProgramResults.tsx'
import csvText from './data/lenders.csv?raw'
import type { BorrowerInput } from './domain/borrower.ts'
import type { LenderProgram } from './domain/lender.ts'
import { findMatchingPrograms, type ProgramMatch } from './domain/matching.ts'
import { parseAndNormalizeLenders } from './domain/normalize.ts'
import './App.css'

const COMPARE_LIMIT = 3

const lenderPrograms = parseAndNormalizeLenders(csvText)
const uniqueLenderCount = new Set(
  lenderPrograms.map((program) => program.lenderName),
).size

function programKey(program: LenderProgram) {
  return `${program.lenderName}-${program.programType}`
}

function App() {
  const [matches, setMatches] = useState<ProgramMatch[] | null>(null)
  const [comparedPrograms, setComparedPrograms] = useState<LenderProgram[]>([])

  function handleSubmit(borrower: BorrowerInput) {
    setMatches(findMatchingPrograms(borrower, lenderPrograms))
    setComparedPrograms([])
  }

  function toggleCompare(program: LenderProgram) {
    setComparedPrograms((current) => {
      const key = programKey(program)
      if (current.some((item) => programKey(item) === key)) {
        return current.filter((item) => programKey(item) !== key)
      }
      if (current.length >= COMPARE_LIMIT) {
        return current
      }
      return [...current, program]
    })
  }

  const selectedKeys = comparedPrograms.map(programKey)

  return (
    <section id="center">
      <h1>Lender comparison</h1>
      <p>Enter the borrower details, then find matching programs.</p>
      <BorrowerForm onSubmit={handleSubmit} />
      {matches !== null && (
        <>
          <ProgramComparison programs={comparedPrograms} onRemove={toggleCompare} />
          <ProgramResults
            matches={matches}
            selectedKeys={selectedKeys}
            compareLimitReached={comparedPrograms.length >= COMPARE_LIMIT}
            onToggleCompare={toggleCompare}
          />
        </>
      )}
      <p>Total lender programs loaded: {lenderPrograms.length}</p>
      <p>Total unique lenders loaded: {uniqueLenderCount}</p>
    </section>
  )
}

export default App
