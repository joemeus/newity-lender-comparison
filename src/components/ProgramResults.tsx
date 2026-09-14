import type { ProgramMatch } from '../domain/matching.ts'
import { ProgramCard } from './ProgramCard.tsx'

type ProgramResultsProps = {
  matches: ProgramMatch[]
}

export function ProgramResults({ matches }: ProgramResultsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        maxWidth: 560,
        textAlign: 'left',
      }}
    >
      {matches.length === 0 ? (
        <p>
          No programs in the current lender dataset match the information provided.
          Adjust the borrower criteria and try again.
        </p>
      ) : (
        matches.map(({ program, matchReasons }) => (
          <ProgramCard
            key={`${program.lenderName}-${program.programType}`}
            program={program}
            matchReasons={matchReasons}
          />
        ))
      )}
    </div>
  )
}
