import type { BorrowerCreditTier, BorrowerInput } from './borrower.ts'
import type { CreditTier, LenderProgram } from './lender.ts'

/** Explicit V1 credit ranking. Higher rank meets or exceeds a lower required tier. */
const CREDIT_TIER_RANK = {
  Fair: 0,
  Good: 1,
  Excellent: 2,
} as const satisfies Record<BorrowerCreditTier, number>

export function findMatchingPrograms(
  borrower: BorrowerInput,
  programs: readonly LenderProgram[],
): LenderProgram[] {
  return programs.filter((program) => doesProgramMatch(program, borrower))
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
