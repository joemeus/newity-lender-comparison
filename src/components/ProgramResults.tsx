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
      }}
    >
      {matches.map(({ program, matchReasons }) => (
        <ProgramCard
          key={`${program.lenderName}-${program.programType}`}
          program={program}
          matchReasons={matchReasons}
        />
      ))}
    </div>
  )
}
