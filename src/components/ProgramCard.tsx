import type { LenderProgram } from '../domain/lender.ts'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type ProgramCardProps = {
  program: LenderProgram
  matchReasons: string[]
  isSelected: boolean
  compareLimitReached: boolean
  onToggleCompare: () => void
}

export function ProgramCard({
  program,
  matchReasons,
  isSelected,
  compareLimitReached,
  onToggleCompare,
}: ProgramCardProps) {
  const addDisabled = !isSelected && compareLimitReached

  return (
    <article
      style={{
        textAlign: 'left',
        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--bg)',
      }}
    >
      <header style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <p
            style={{
              display: 'inline-block',
              margin: 0,
              padding: '2px 8px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              borderRadius: 4,
            }}
          >
            Potential Match
          </p>
          {isSelected && (
            <p
              style={{
                display: 'inline-block',
                margin: 0,
                padding: '2px 8px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-h)',
                background: 'var(--code-bg)',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
            >
              Selected for compare
            </p>
          )}
        </div>
        <h2 style={{ margin: '0 0 4px' }}>{program.lenderName}</h2>
        <p>{program.programType}</p>
      </header>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(9rem, 40%) 1fr',
          gap: '6px 12px',
          margin: '0 0 16px',
        }}
      >
        <Fact label="Interest rate" value={`${program.interestRateMinPct}% – ${program.interestRateMaxPct}%`} />
        <Fact
          label="Loan amount"
          value={`${currency.format(program.minLoanAmount)} – ${currency.format(program.maxLoanAmount)}`}
        />
        <Fact label="Maximum term" value={`${program.maxTermMonths} months`} />
        <Fact label="Turnaround" value={`${program.turnaroundDays} days`} />
        <Fact label="Collateral" value={program.requiresCollateral} />
        {program.specialRequirements !== null && (
          <Fact label="Special requirements" value={program.specialRequirements} />
        )}
        <Fact label="Last updated" value={program.lastUpdated} />
      </dl>

      <section style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Why this matched</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {matchReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Additional requirements to confirm</h3>
        <p style={{ marginBottom: 8, fontSize: 14 }}>
          These items were not automatically evaluated.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Minimum credit score: {program.minCreditScore}</li>
          {program.specialRequirements !== null && (
            <li>Special requirements: {program.specialRequirements}</li>
          )}
        </ul>
      </section>

      <button
        type="button"
        className="counter"
        onClick={onToggleCompare}
        disabled={addDisabled}
        style={{ marginTop: 16, marginBottom: 0, opacity: addDisabled ? 0.55 : 1 }}
      >
        {isSelected ? 'Remove from compare' : 'Add to compare'}
      </button>
    </article>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt style={{ color: 'var(--text)', fontSize: 14 }}>{label}</dt>
      <dd style={{ margin: 0, color: 'var(--text-h)' }}>{value}</dd>
    </>
  )
}
