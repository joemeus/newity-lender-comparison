import { useState } from 'react'
import { BorrowerForm } from './components/BorrowerForm.tsx'
import csvText from './data/lenders.csv?raw'
import type { BorrowerInput } from './domain/borrower.ts'
import { parseAndNormalizeLenders } from './domain/normalize.ts'
import './App.css'

const lenderPrograms = parseAndNormalizeLenders(csvText)
const uniqueLenderCount = new Set(
  lenderPrograms.map((program) => program.lenderName),
).size

function App() {
  const [submittedBorrower, setSubmittedBorrower] = useState<BorrowerInput | null>(null)

  return (
    <section id="center">
      <h1>Lender comparison</h1>
      <p>Enter the borrower details, then find matching programs.</p>
      <BorrowerForm onSubmit={setSubmittedBorrower} />
      {submittedBorrower !== null && (
        <div style={{ textAlign: 'left' }}>
          <h2>Submitted borrower</h2>
          <p>Loan amount: {submittedBorrower.loanAmount}</p>
          <p>Business type: {submittedBorrower.businessType}</p>
          <p>Years in business: {submittedBorrower.yearsInBusiness}</p>
          <p>Credit tier: {submittedBorrower.creditTier}</p>
        </div>
      )}
      <p>Total lender programs loaded: {lenderPrograms.length}</p>
      <p>Total unique lenders loaded: {uniqueLenderCount}</p>
    </section>
  )
}

export default App
