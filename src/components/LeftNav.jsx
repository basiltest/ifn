import { NavLink } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { Icon } from './Icons.jsx'

const ITEMS = [
  { to: '/', icon: 'home', label: 'Feed', end: true },
  { to: '/pipeline', icon: 'pipeline', label: 'Idea Pipeline' },
  { to: '/team', icon: 'team', label: 'Team Board' },
  { to: '/calendar', icon: 'calendar', label: 'Calendar' },
  { to: '/review', icon: 'review', label: 'Mentor Review', roles: ['mentor', 'admin'] },
  { to: '/tags', icon: 'tag', label: 'Tag Requests', roles: ['admin'] },
  { to: '/profile', icon: 'user', label: 'Profile' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function LeftNav({ onCreate, onNavigate }) {
  const { currentUser, data } = useStore()
  const role = currentUser.role
  const pendingTags = data.posts.filter((p) => p.successRequest === 'pending').length
  const reviewCount = data.posts.filter((p) => p.gate === 2 && p.mentorId === 'me').length

  return (
    <nav className="sticky top-[72px] flex flex-col gap-1">
      {ITEMS.filter((it) => !it.roles || it.roles.includes(role)).map((it) => {
        const badge =
          it.to === '/tags' ? pendingTags : it.to === '/review' ? reviewCount : 0
        return (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                isActive ? 'bg-accent-soft text-accent' : 'text-ink hover:bg-black/5'
              }`
            }
          >
            <Icon name={it.icon} size={22} />
            <span>{it.label}</span>
            {badge > 0 && (
              <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </NavLink>
        )
      })}

      <button
        onClick={() => {
          onNavigate?.()
          onCreate()
        }}
        className="btn-primary mt-3 w-full py-3 text-[15px]"
      >
        <Icon name="plus" size={18} strokeWidth={2.4} /> Create Post
      </button>
    </nav>
  )
}
