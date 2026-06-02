import { GATES } from '../lib/tags.js'
import { Icon } from './Icons.jsx'

const GATE_ICON = {
  Submitted: 'check',
  'Mentor Review': 'review',
  Prototyping: 'flask',
  Validation: 'shield',
  Notified: 'mail',
  Incubation: 'rocket',
}

export default function GateBar({ gate = 1, compact = false }) {
  return (
    <div className={`flex items-start ${compact ? 'gap-1' : 'gap-2 sm:gap-3'}`}>
      {GATES.map((g, i) => {
        const completed = g.n < gate
        const active = g.n === gate
        const ring = completed
          ? 'border-success bg-white text-success'
          : active
            ? 'border-accent bg-accent text-white'
            : 'border-line bg-page text-faint'
        return (
          <div key={g.n} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 && (
                <div
                  className={`h-0.5 flex-1 ${completed || active ? 'bg-success/60' : 'bg-line'}`}
                />
              )}
              <div
                className={`flex items-center justify-center rounded-full border-2 ${ring} ${
                  compact ? 'h-7 w-7' : 'h-9 w-9'
                }`}
              >
                <Icon name={completed ? 'check' : GATE_ICON[g.key]} size={compact ? 14 : 17} />
              </div>
              {i < GATES.length - 1 && (
                <div className={`h-0.5 flex-1 ${completed ? 'bg-success/60' : 'bg-line'}`} />
              )}
            </div>
            {!compact && (
              <div className="mt-1.5 text-center">
                <div
                  className={`text-[11px] font-bold ${active ? 'text-accent' : completed ? 'text-ink' : 'text-faint'}`}
                >
                  G{g.n}
                </div>
                <div
                  className={`text-[10px] leading-tight ${active ? 'text-accent' : 'text-muted'}`}
                >
                  {g.key}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
