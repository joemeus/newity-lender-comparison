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

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const lenderPrograms = parseAndNormalizeLenders(csvText)
const uniqueLenderCount = new Set(
  lenderPrograms.map((program) => program.lenderName),
).size

function programKey(program: LenderProgram) {
  return `${program.lenderName}-${program.programType}`
}

function formatBorrowerSummary(borrower: BorrowerInput) {
  const yearsLabel =
    borrower.yearsInBusiness === 1 ? '1 year' : `${borrower.yearsInBusiness} years`

  return `${currency.format(borrower.loanAmount)} · ${borrower.businessType} · ${yearsLabel} · ${borrower.creditTier} credit`
}

function App() {
  const [matches, setMatches] = useState<ProgramMatch[] | null>(null)
  const [submittedBorrower, setSubmittedBorrower] = useState<BorrowerInput | null>(null)
  const [comparedPrograms, setComparedPrograms] = useState<LenderProgram[]>([])

  function handleSubmit(borrower: BorrowerInput) {
    setSubmittedBorrower(borrower)
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
      <header className="app-header">
        <h1>Lender comparison</h1>
        <p>Enter the borrower details, then find matching programs.</p>
      </header>

      <div className="workspace">
        <aside className="workspace-form">
          <div className="borrower-panel">
            <BorrowerForm onSubmit={handleSubmit} />
          </div>
          <p>Total lender programs loaded: {lenderPrograms.length}</p>
          <p>Total unique lenders loaded: {uniqueLenderCount}</p>
        </aside>

        <div className="workspace-results">
          {matches === null || submittedBorrower === null ? (
            <p>Potential Matches will appear here after you search.</p>
          ) : (
            <>
              <div className="results-header">
                <h2>
                  {`${matches.length} Potential Match${matches.length === 1 ? '' : 'es'}`}
                </h2>
                <p>{formatBorrowerSummary(submittedBorrower)}</p>
              </div>
              <ProgramComparison programs={comparedPrograms} onRemove={toggleCompare} />
              <ProgramResults
                matches={matches}
                selectedKeys={selectedKeys}
                compareLimitReached={comparedPrograms.length >= COMPARE_LIMIT}
                onToggleCompare={toggleCompare}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default App
