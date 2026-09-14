import type { LenderProgram } from '../domain/lender.ts'
import type { ProgramMatch } from '../domain/matching.ts'
import { ProgramCard } from './ProgramCard.tsx'

type ProgramResultsProps = {
  matches: ProgramMatch[]
  selectedKeys: string[]
  compareLimitReached: boolean
  onToggleCompare: (program: LenderProgram) => void
}

export function ProgramResults({
  matches,
  selectedKeys,
  compareLimitReached,
  onToggleCompare,
}: ProgramResultsProps) {
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
        <>
          {compareLimitReached && (
            <p>You can compare up to 3 programs. Remove one to add another.</p>
          )}
          {matches.map(({ program, matchReasons }) => {
            const key = `${program.lenderName}-${program.programType}`
            return (
              <ProgramCard
                key={key}
                program={program}
                matchReasons={matchReasons}
                isSelected={selectedKeys.includes(key)}
                compareLimitReached={compareLimitReached}
                onToggleCompare={() => onToggleCompare(program)}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
