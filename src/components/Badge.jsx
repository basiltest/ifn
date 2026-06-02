import { BADGES, ROLE_META } from '../lib/tags.js'

export function RoleBadge({ role, className = '' }) {
  const m = ROLE_META[role] || ROLE_META.student
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}
      style={{ color: m.color, background: m.bg }}
    >
      {m.label}
    </span>
  )
}

export function HardBadge({ badge, pending = false }) {
  const m = BADGES[badge]
  if (!m) return null
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ color: m.color, background: m.bg, opacity: pending ? 0.6 : 1 }}
    >
      {m.label}
      {pending && <span className="font-medium">· pending</span>}
    </span>
  )
}

export function SuperTag({ tag, active = false, onClick }) {
  const Cmp = onClick ? 'button' : 'span'
  return (
    <Cmp
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-accent text-white'
          : 'bg-accent-soft text-accent hover:bg-accent/15'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      #{tag}
    </Cmp>
  )
}
