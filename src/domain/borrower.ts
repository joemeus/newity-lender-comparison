import { ELIGIBLE_BUSINESS_TYPES, type EligibleBusinessType } from './lender.ts'

export const BORROWER_BUSINESS_TYPES = ELIGIBLE_BUSINESS_TYPES.filter(
  (type) => type !== 'All',
) as Exclude<EligibleBusinessType, 'All'>[]

export const BORROWER_CREDIT_TIERS = ['Fair', 'Good', 'Excellent'] as const

export type BorrowerBusinessType = (typeof BORROWER_BUSINESS_TYPES)[number]
export type BorrowerCreditTier = (typeof BORROWER_CREDIT_TIERS)[number]

export type BorrowerInput = {
  loanAmount: number
  businessType: BorrowerBusinessType
  yearsInBusiness: number
  creditTier: BorrowerCreditTier
}
