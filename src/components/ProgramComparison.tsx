import type { CSSProperties } from 'react'
import type { LenderProgram } from '../domain/lender.ts'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type ProgramComparisonProps = {
  programs: LenderProgram[]
  onRemove: (program: LenderProgram) => void
}

export function ProgramComparison({ programs, onRemove }: ProgramComparisonProps) {
  if (programs.length === 0) {
    return null
  }

  return (
    <section
      style={{
        width: '100%',
        maxWidth: 960,
        textAlign: 'left',
        overflowX: 'auto',
      }}
    >
      <h2 style={{ marginBottom: 8 }}>Compare programs</h2>
      <p style={{ marginBottom: 12, fontSize: 14 }}>{programs.length} of 3 selected</p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            <th style={headerCell}></th>
            {programs.map((program) => (
              <th
                key={`${program.lenderName}-${program.programType}`}
                style={{ ...headerCell, minWidth: 160, verticalAlign: 'top' }}
              >
                <div>{program.lenderName}</div>
                <button
                  type="button"
                  onClick={() => onRemove(program)}
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            label="Program type"
            values={programs.map((program) => program.programType)}
          />
          <ComparisonRow
            label="Interest rate"
            values={programs.map(
              (program) => `${program.interestRateMinPct}% – ${program.interestRateMaxPct}%`,
            )}
          />
          <ComparisonRow
            label="Loan amount"
            values={programs.map(
              (program) =>
                `${currency.format(program.minLoanAmount)} – ${currency.format(program.maxLoanAmount)}`,
            )}
          />
          <ComparisonRow
            label="Maximum term"
            values={programs.map((program) => `${program.maxTermMonths} months`)}
          />
          <ComparisonRow
            label="Turnaround"
            values={programs.map((program) => `${program.turnaroundDays} days`)}
          />
          <ComparisonRow
            label="Collateral"
            values={programs.map((program) => program.requiresCollateral)}
          />
          <ComparisonRow
            label="Special requirements"
            values={programs.map((program) => program.specialRequirements ?? 'None listed')}
          />
        </tbody>
      </table>
    </section>
  )
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <th style={rowLabelCell}>{label}</th>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} style={valueCell}>
          {value}
        </td>
      ))}
    </tr>
  )
}

const headerCell: CSSProperties = {
  borderBottom: '1px solid var(--border)',
  padding: '8px 10px',
  textAlign: 'left',
  color: 'var(--text-h)',
  fontWeight: 600,
}

const rowLabelCell: CSSProperties = {
  borderBottom: '1px solid var(--border)',
  padding: '8px 10px',
  textAlign: 'left',
  color: 'var(--text)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

const valueCell: CSSProperties = {
  borderBottom: '1px solid var(--border)',
  padding: '8px 10px',
  color: 'var(--text-h)',
  verticalAlign: 'top',
}
