import { avatarColor, initials } from '../lib/tags.js'

export default function Avatar({ member, name, size = 40, tick = 0, className = '' }) {
  const label = member?.name || name || '?'
  const seed = label + ':' + ((member?.avatarTick ?? tick) || 0)
  const bg = avatarColor(seed)
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white select-none ${className}`}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
      title={label}
    >
      {initials(label)}
    </span>
  )
}
