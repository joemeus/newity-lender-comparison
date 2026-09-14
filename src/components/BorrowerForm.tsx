import { type FormEvent, useState } from 'react'
import {
  BORROWER_BUSINESS_TYPES,
  BORROWER_CREDIT_TIERS,
  type BorrowerBusinessType,
  type BorrowerCreditTier,
  type BorrowerInput,
} from '../domain/borrower.ts'

type BorrowerFormProps = {
  onSubmit: (borrower: BorrowerInput) => void
}

export function BorrowerForm({ onSubmit }: BorrowerFormProps) {
  const [loanAmount, setLoanAmount] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [yearsInBusiness, setYearsInBusiness] = useState('')
  const [creditTier, setCreditTier] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit({
      loanAmount: Number(loanAmount),
      businessType: businessType as BorrowerBusinessType,
      yearsInBusiness: Number(yearsInBusiness),
      creditTier: creditTier as BorrowerCreditTier,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'left', width: '100%', maxWidth: 420 }}>
      <label style={{ display: 'block', marginBottom: 16 }}>
        Loan amount
        <input
          type="number"
          name="loanAmount"
          required
          min={0}
          step={1}
          value={loanAmount}
          onChange={(event) => setLoanAmount(event.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8, boxSizing: 'border-box' }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Business type
        <select
          name="businessType"
          required
          value={businessType}
          onChange={(event) => setBusinessType(event.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8, boxSizing: 'border-box' }}
        >
          <option value="" disabled>
            Select a business type
          </option>
          {BORROWER_BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Years in business
        <input
          type="number"
          name="yearsInBusiness"
          required
          min={0}
          step={1}
          value={yearsInBusiness}
          onChange={(event) => setYearsInBusiness(event.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8, boxSizing: 'border-box' }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Credit tier
        <select
          name="creditTier"
          required
          value={creditTier}
          onChange={(event) => setCreditTier(event.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8, boxSizing: 'border-box' }}
        >
          <option value="" disabled>
            Select a credit tier
          </option>
          {BORROWER_CREDIT_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="counter">
        Find Programs
      </button>
    </form>
  )
}
