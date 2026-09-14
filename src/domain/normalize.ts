import Papa from 'papaparse'
import {
  CREDIT_TIERS,
  ELIGIBLE_BUSINESS_TYPES,
  PROGRAM_TYPES,
  REQUIRES_COLLATERAL,
  type LenderProgram,
  type RawLenderCsvRow,
} from './lender.ts'

export function parseAndNormalizeLenders(csvText: string): LenderProgram[] {
  const result = Papa.parse<RawLenderCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    const details = result.errors
      .map((error) => error.message)
      .join('; ')
    throw new Error(`Failed to parse lenders CSV: ${details}`)
  }

  return result.data.map((row, index) => normalizeLenderProgram(row, index))
}

export function normalizeLenderProgram(
  row: RawLenderCsvRow,
  index: number,
): LenderProgram {
  const rowLabel = `row ${index + 2}`

  return {
    lenderName: requiredString(row.lender_name, 'lender_name', rowLabel),
    programType: asUnion(row.program_type, PROGRAM_TYPES, 'program_type', rowLabel),
    minLoanAmount: requiredNumber(row.min_loan_amount, 'min_loan_amount', rowLabel),
    maxLoanAmount: requiredNumber(row.max_loan_amount, 'max_loan_amount', rowLabel),
    minCreditScore: requiredNumber(row.min_credit_score, 'min_credit_score', rowLabel),
    creditTierRequired: asUnion(
      row.credit_tier_required,
      CREDIT_TIERS,
      'credit_tier_required',
      rowLabel,
    ),
    minYearsInBusiness: requiredNumber(
      row.min_years_in_business,
      'min_years_in_business',
      rowLabel,
    ),
    interestRateMinPct: requiredNumber(
      row.interest_rate_min,
      'interest_rate_min',
      rowLabel,
    ),
    interestRateMaxPct: requiredNumber(
      row.interest_rate_max,
      'interest_rate_max',
      rowLabel,
    ),
    maxTermMonths: requiredNumber(row.max_term_months, 'max_term_months', rowLabel),
    sbaGuaranteePct: requiredNumber(
      row.sba_guarantee_pct,
      'sba_guarantee_pct',
      rowLabel,
    ),
    eligibleBusinessTypes: asUnion(
      row.eligible_business_types,
      ELIGIBLE_BUSINESS_TYPES,
      'eligible_business_types',
      rowLabel,
    ),
    requiresCollateral: asUnion(
      row.requires_collateral,
      REQUIRES_COLLATERAL,
      'requires_collateral',
      rowLabel,
    ),
    maxExistingDebtRatio: optionalNumber(
      row.max_existing_debt_ratio,
      'max_existing_debt_ratio',
      rowLabel,
    ),
    turnaroundDays: requiredNumber(row.turnaround_days, 'turnaround_days', rowLabel),
    specialRequirements: optionalString(row.special_requirements),
    lastUpdated: parseLastUpdated(row.last_updated, rowLabel),
  }
}

function requiredString(value: string | undefined, field: string, rowLabel: string): string {
  const trimmed = value?.trim() ?? ''
  if (trimmed === '') {
    throw new Error(`Missing ${field} in ${rowLabel}`)
  }
  return trimmed
}

function optionalString(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? ''
  return trimmed === '' ? null : trimmed
}

function requiredNumber(value: string | undefined, field: string, rowLabel: string): number {
  const trimmed = requiredString(value, field, rowLabel)
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${field} in ${rowLabel}: ${value}`)
  }
  return parsed
}

function optionalNumber(
  value: string | undefined,
  field: string,
  rowLabel: string,
): number | null {
  const trimmed = value?.trim() ?? ''
  if (trimmed === '') {
    return null
  }
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${field} in ${rowLabel}: ${value}`)
  }
  return parsed
}

function asUnion<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  field: string,
  rowLabel: string,
): T {
  const trimmed = requiredString(value, field, rowLabel)
  if ((allowed as readonly string[]).includes(trimmed)) {
    return trimmed as T
  }
  throw new Error(`Invalid ${field} in ${rowLabel}: ${value}`)
}

function parseLastUpdated(value: string | undefined, rowLabel: string): string {
  const trimmed = requiredString(value, 'last_updated', rowLabel)
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (!match) {
    throw new Error(`Invalid last_updated in ${rowLabel}: ${value}`)
  }

  const month = match[1].padStart(2, '0')
  const day = match[2].padStart(2, '0')
  return `${match[3]}-${month}-${day}`
}
