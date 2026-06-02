import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { Icon } from './Icons.jsx'
import Avatar from './Avatar.jsx'
import RoleSwitcher from './RoleSwitcher.jsx'

export function Logo({ size = 'md' }) {
  const s = size === 'lg' ? 'h-10 w-10 text-base' : 'h-8 w-8 text-sm'
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-grad font-extrabold tracking-tight text-white shadow-glow ${s}`}
    >
      IFN
    </span>
  )
}

export default function Header() {
  const { currentUser } = useStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden text-[15px] font-extrabold sm:block">
            ICFAI Founders Network
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <RoleSwitcher />
          <button
            onClick={() => navigate('/settings')}
            className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-ink"
            aria-label="Settings"
          >
            <Icon name="settings" size={20} />
          </button>
          <button onClick={() => navigate('/profile')} aria-label="Profile">
            <Avatar member={currentUser} size={34} className="ring-2 ring-transparent hover:ring-accent/40" />
          </button>
        </div>
      </div>
    </header>
  )
}
