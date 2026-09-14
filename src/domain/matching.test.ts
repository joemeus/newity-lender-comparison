import { describe, expect, it } from 'vitest'
import type { BorrowerInput } from './borrower.ts'
import type { LenderProgram } from './lender.ts'
import { doesProgramMatch, explainMatch } from './matching.ts'

const baseProgram: LenderProgram = {
  lenderName: 'Test Lender',
  programType: 'SBA Express',
  minLoanAmount: 25000,
  maxLoanAmount: 500000,
  minCreditScore: 650,
  creditTierRequired: 'Good',
  minYearsInBusiness: 2,
  interestRateMinPct: 10,
  interestRateMaxPct: 12,
  maxTermMonths: 84,
  sbaGuaranteePct: 50,
  eligibleBusinessTypes: 'Manufacturing',
  requiresCollateral: 'No',
  maxExistingDebtRatio: 0.45,
  turnaroundDays: 10,
  specialRequirements: null,
  lastUpdated: '2026-01-01',
}

const baseBorrower: BorrowerInput = {
  loanAmount: 100000,
  businessType: 'Manufacturing',
  yearsInBusiness: 3,
  creditTier: 'Good',
}

function program(overrides: Partial<LenderProgram> = {}): LenderProgram {
  return { ...baseProgram, ...overrides }
}

function borrower(overrides: Partial<BorrowerInput> = {}): BorrowerInput {
  return { ...baseBorrower, ...overrides }
}

describe('doesProgramMatch', () => {
  it('loan amount exactly at minimum qualifies', () => {
    expect(
      doesProgramMatch(program({ minLoanAmount: 25000 }), borrower({ loanAmount: 25000 })),
    ).toBe(true)
  })

  it('loan amount exactly at maximum qualifies', () => {
    expect(
      doesProgramMatch(program({ maxLoanAmount: 500000 }), borrower({ loanAmount: 500000 })),
    ).toBe(true)
  })

  it('loan amount below minimum does not qualify', () => {
    expect(
      doesProgramMatch(program({ minLoanAmount: 25000 }), borrower({ loanAmount: 24999 })),
    ).toBe(false)
  })

  it('loan amount above maximum does not qualify', () => {
    expect(
      doesProgramMatch(program({ maxLoanAmount: 500000 }), borrower({ loanAmount: 500001 })),
    ).toBe(false)
  })

  it('years in business exactly at minimum qualifies', () => {
    expect(
      doesProgramMatch(program({ minYearsInBusiness: 2 }), borrower({ yearsInBusiness: 2 })),
    ).toBe(true)
  })

  it('years below minimum does not qualify', () => {
    expect(
      doesProgramMatch(program({ minYearsInBusiness: 2 }), borrower({ yearsInBusiness: 1 })),
    ).toBe(false)
  })

  it('All accepts any business type', () => {
    expect(
      doesProgramMatch(
        program({ eligibleBusinessTypes: 'All' }),
        borrower({ businessType: 'Retail' }),
      ),
    ).toBe(true)
  })

  it('matching specific business type qualifies', () => {
    expect(
      doesProgramMatch(
        program({ eligibleBusinessTypes: 'Healthcare' }),
        borrower({ businessType: 'Healthcare' }),
      ),
    ).toBe(true)
  })

  it('non-matching specific business type does not qualify', () => {
    expect(
      doesProgramMatch(
        program({ eligibleBusinessTypes: 'Healthcare' }),
        borrower({ businessType: 'Retail' }),
      ),
    ).toBe(false)
  })

  it('Excellent satisfies Good', () => {
    expect(
      doesProgramMatch(program({ creditTierRequired: 'Good' }), borrower({ creditTier: 'Excellent' })),
    ).toBe(true)
  })

  it('Good satisfies Good', () => {
    expect(
      doesProgramMatch(program({ creditTierRequired: 'Good' }), borrower({ creditTier: 'Good' })),
    ).toBe(true)
  })

  it('Fair does not satisfy Good', () => {
    expect(
      doesProgramMatch(program({ creditTierRequired: 'Good' }), borrower({ creditTier: 'Fair' })),
    ).toBe(false)
  })
})

describe('explainMatch', () => {
  it('describes loan amount against the program range', () => {
    expect(
      explainMatch(
        program({ minLoanAmount: 10000, maxLoanAmount: 250000 }),
        borrower({ loanAmount: 250000 }),
      )[0],
    ).toBe("$250,000 is within this program's $10,000–$250,000 range")
  })

  it('describes years in business against the program minimum', () => {
    expect(
      explainMatch(program({ minYearsInBusiness: 1 }), borrower({ yearsInBusiness: 3 }))[1],
    ).toBe('3 years in business meets the 1-year minimum')
  })

  it('explains All as accepting any business type', () => {
    expect(
      explainMatch(
        program({ eligibleBusinessTypes: 'All' }),
        borrower({ businessType: 'Retail' }),
      )[2],
    ).toBe('Retail is accepted because this program accepts all business types')
  })

  it('explains a specific matching business type', () => {
    expect(
      explainMatch(
        program({ eligibleBusinessTypes: 'Retail' }),
        borrower({ businessType: 'Retail' }),
      )[2],
    ).toBe("Retail matches this program's eligible business type")
  })

  it('explains credit tier against the required tier', () => {
    expect(
      explainMatch(program({ creditTierRequired: 'Fair' }), borrower({ creditTier: 'Good' }))[3],
    ).toBe('Good credit meets the Fair tier requirement')
  })
})
