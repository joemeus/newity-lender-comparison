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

type FieldErrors = {
  loanAmount?: string
  businessType?: string
  yearsInBusiness?: string
  creditTier?: string
}

export function BorrowerForm({ onSubmit }: BorrowerFormProps) {
  const [loanAmount, setLoanAmount] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [yearsInBusiness, setYearsInBusiness] = useState('')
  const [creditTier, setCreditTier] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateBorrowerForm({
      loanAmount,
      businessType,
      yearsInBusiness,
      creditTier,
    })
    setErrors(nextErrors)

    if (nextErrors.loanAmount || nextErrors.businessType || nextErrors.yearsInBusiness || nextErrors.creditTier) {
      return
    }

    onSubmit({
      loanAmount: Number(loanAmount),
      businessType: businessType as BorrowerBusinessType,
      yearsInBusiness: Number(yearsInBusiness),
      creditTier: creditTier as BorrowerCreditTier,
    })
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{ textAlign: 'left', width: '100%', maxWidth: 420 }}
    >
      <label style={{ display: 'block', marginBottom: 16 }}>
        Loan amount
        <input
          type="number"
          name="loanAmount"
          step={1}
          value={loanAmount}
          aria-invalid={errors.loanAmount ? true : undefined}
          aria-describedby={errors.loanAmount ? 'loanAmount-error' : undefined}
          onChange={(event) => {
            setLoanAmount(event.target.value)
            setErrors((current) => ({ ...current, loanAmount: undefined }))
          }}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8, boxSizing: 'border-box' }}
        />
        <FieldError id="loanAmount-error" message={errors.loanAmount} />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Business type
        <select
          name="businessType"
          value={businessType}
          aria-invalid={errors.businessType ? true : undefined}
          aria-describedby={errors.businessType ? 'businessType-error' : undefined}
          onChange={(event) => {
            setBusinessType(event.target.value)
            setErrors((current) => ({ ...current, businessType: undefined }))
          }}
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
        <FieldError id="businessType-error" message={errors.businessType} />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Years in business
        <input
          type="number"
          name="yearsInBusiness"
          step={1}
          value={yearsInBusiness}
          aria-invalid={errors.yearsInBusiness ? true : undefined}
          aria-describedby={errors.yearsInBusiness ? 'yearsInBusiness-error' : undefined}
          onChange={(event) => {
            setYearsInBusiness(event.target.value)
            setErrors((current) => ({ ...current, yearsInBusiness: undefined }))
          }}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: 8, boxSizing: 'border-box' }}
        />
        <FieldError id="yearsInBusiness-error" message={errors.yearsInBusiness} />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Credit tier
        <select
          name="creditTier"
          value={creditTier}
          aria-invalid={errors.creditTier ? true : undefined}
          aria-describedby={errors.creditTier ? 'creditTier-error' : undefined}
          onChange={(event) => {
            setCreditTier(event.target.value)
            setErrors((current) => ({ ...current, creditTier: undefined }))
          }}
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
        <FieldError id="creditTier-error" message={errors.creditTier} />
      </label>

      <button type="submit" className="counter">
        Find Programs
      </button>
    </form>
  )
}

function validateBorrowerForm(values: {
  loanAmount: string
  businessType: string
  yearsInBusiness: string
  creditTier: string
}): FieldErrors {
  const errors: FieldErrors = {}

  const loanAmountText = values.loanAmount.trim()
  if (loanAmountText === '') {
    errors.loanAmount = 'Enter a loan amount.'
  } else {
    const loanAmount = Number(loanAmountText)
    if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
      errors.loanAmount = 'Loan amount must be greater than 0.'
    }
  }

  if (values.businessType === '') {
    errors.businessType = 'Select a business type.'
  }

  const yearsText = values.yearsInBusiness.trim()
  if (yearsText === '') {
    errors.yearsInBusiness = 'Enter years in business.'
  } else {
    const yearsInBusiness = Number(yearsText)
    if (!Number.isFinite(yearsInBusiness) || yearsInBusiness < 0) {
      errors.yearsInBusiness = 'Years in business must be 0 or greater.'
    }
  }

  if (values.creditTier === '') {
    errors.creditTier = 'Select a credit tier.'
  }

  return errors
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p id={id} role="alert" style={{ marginTop: 6, fontSize: 14, color: '#c62828' }}>
      {message}
    </p>
  )
}
