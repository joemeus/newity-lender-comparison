export type RawLenderCsvRow = {
  lender_name: string
  program_type: string
  min_loan_amount: string
  max_loan_amount: string
  min_credit_score: string
  credit_tier_required: string
  min_years_in_business: string
  interest_rate_min: string
  interest_rate_max: string
  max_term_months: string
  sba_guarantee_pct: string
  eligible_business_types: string
  requires_collateral: string
  max_existing_debt_ratio: string
  turnaround_days: string
  special_requirements: string
  last_updated: string
}

export const PROGRAM_TYPES = [
  'Community Advantage',
  'SBA Express',
  '504 Loan',
  '7(a) Small Loan',
  '7(a) Standard',
] as const

export const CREDIT_TIERS = ['Fair', 'Good'] as const

export const ELIGIBLE_BUSINESS_TYPES = [
  'All',
  'Manufacturing',
  'Restaurant/Food Service',
  'Professional Services',
  'Construction',
  'Retail',
  'Healthcare',
] as const

export const REQUIRES_COLLATERAL = ['Yes', 'No', 'Varies'] as const

export type ProgramType = (typeof PROGRAM_TYPES)[number]
export type CreditTier = (typeof CREDIT_TIERS)[number]
export type EligibleBusinessType = (typeof ELIGIBLE_BUSINESS_TYPES)[number]
export type RequiresCollateral = (typeof REQUIRES_COLLATERAL)[number]

export type LenderProgram = {
  lenderName: string
  programType: ProgramType
  minLoanAmount: number
  maxLoanAmount: number
  minCreditScore: number
  creditTierRequired: CreditTier
  minYearsInBusiness: number
  interestRateMinPct: number
  interestRateMaxPct: number
  maxTermMonths: number
  sbaGuaranteePct: number
  eligibleBusinessTypes: EligibleBusinessType
  requiresCollateral: RequiresCollateral
  maxExistingDebtRatio: number | null
  turnaroundDays: number
  specialRequirements: string | null
  lastUpdated: string
}
