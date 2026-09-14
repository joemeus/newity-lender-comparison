import type { BorrowerCreditTier, BorrowerInput } from './borrower.ts'
import type { CreditTier, LenderProgram } from './lender.ts'

/** Explicit V1 credit ranking. Higher rank meets or exceeds a lower required tier. */
const CREDIT_TIER_RANK = {
  Fair: 0,
  Good: 1,
  Excellent: 2,
} as const satisfies Record<BorrowerCreditTier, number>

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export type ProgramMatch = {
  program: LenderProgram
  matchReasons: string[]
}

export function findMatchingPrograms(
  borrower: BorrowerInput,
  programs: readonly LenderProgram[],
): ProgramMatch[] {
  return programs
    .filter((program) => doesProgramMatch(program, borrower))
    .map((program) => ({
      program,
      matchReasons: explainMatch(program, borrower),
    }))
}

export function doesProgramMatch(program: LenderProgram, borrower: BorrowerInput): boolean {
  return (
    borrower.loanAmount >= program.minLoanAmount &&
    borrower.loanAmount <= program.maxLoanAmount &&
    borrower.yearsInBusiness >= program.minYearsInBusiness &&
    businessTypeMatches(program, borrower) &&
    creditTierMeetsOrExceeds(borrower.creditTier, program.creditTierRequired)
  )
}

export function explainMatch(program: LenderProgram, borrower: BorrowerInput): string[] {
  return [
    explainLoanAmount(program, borrower),
    explainYearsInBusiness(program, borrower),
    explainBusinessType(program, borrower),
    explainCreditTier(program, borrower),
  ]
}

function explainLoanAmount(program: LenderProgram, borrower: BorrowerInput): string {
  return `${money.format(borrower.loanAmount)} is within this program's ${money.format(program.minLoanAmount)}–${money.format(program.maxLoanAmount)} range`
}

function explainYearsInBusiness(program: LenderProgram, borrower: BorrowerInput): string {
  return `${formatYears(borrower.yearsInBusiness)} in business meets the ${program.minYearsInBusiness}-year minimum`
}

function explainBusinessType(program: LenderProgram, borrower: BorrowerInput): string {
  if (program.eligibleBusinessTypes === 'All') {
    return `${borrower.businessType} is accepted because this program accepts all business types`
  }
  return `${borrower.businessType} matches this program's eligible business type`
}

function explainCreditTier(program: LenderProgram, borrower: BorrowerInput): string {
  return `${borrower.creditTier} credit meets the ${program.creditTierRequired} tier requirement`
}

function formatYears(years: number): string {
  return years === 1 ? '1 year' : `${years} years`
}

function businessTypeMatches(program: LenderProgram, borrower: BorrowerInput): boolean {
  return (
    program.eligibleBusinessTypes === 'All' ||
    program.eligibleBusinessTypes === borrower.businessType
  )
}

function creditTierMeetsOrExceeds(
  borrowerTier: BorrowerCreditTier,
  requiredTier: CreditTier,
): boolean {
  return CREDIT_TIER_RANK[borrowerTier] >= CREDIT_TIER_RANK[requiredTier]
}
