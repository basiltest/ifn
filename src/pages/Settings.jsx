import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Avatar from '../components/Avatar.jsx'
import { Icon } from '../components/Icons.jsx'
import { RoleBadge } from '../components/Badge.jsx'
import { PageTitle } from './IdeaPipeline.jsx'

const NOTIF_ROWS = [
  { key: 'emailEvents', label: 'Email me about new events', hint: 'Calendar invites & reminders' },
  { key: 'emailGate', label: 'Email me on pipeline gate changes', hint: 'When my idea advances or needs revision' },
  { key: 'inappVotes', label: 'In-app: votes on my posts', hint: 'Upvotes & downvotes' },
  { key: 'inappMentions', label: 'In-app: mentions & replies', hint: 'When someone tags me' },
]

export default function Settings() {
  const { currentUser, data, toggleNotif, toggleTheme, resetData, logout } = useStore()
  const isDark = data.theme === 'dark'
  const toast = useToast()
  const navigate = useNavigate()

  const doReset = () => {
    if (window.confirm('Reset all demo data? This clears your posts, events and edits, then re-seeds the mock data. This cannot be undone.')) {
      resetData()
      toast('Demo data reset')
    }
  }
  const doLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-4">
      <PageTitle icon="settings" title="Settings" subtitle="Account, notifications & demo controls." />

      {/* Account */}
      <section className="card p-5">
        <h2 className="mb-3 text-base font-extrabold">Account</h2>
        <div className="flex items-center gap-4">
          <Avatar member={currentUser} size={56} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold">{currentUser.name}</span>
              <RoleBadge role={currentUser.role} />
            </div>
            <div className="text-sm text-muted">{currentUser.email}</div>
          </div>
          <button className="btn-outline ml-auto" onClick={() => navigate('/profile')}>
            <Icon name="edit" size={15} /> Edit in Profile
          </button>
        </div>
        <p className="mt-3 text-xs text-faint">
          Email and role are managed by IFN. Role can be switched from the header for this demo.
        </p>
      </section>

      {/* Appearance */}
      <section className="card p-5">
        <h2 className="mb-3 text-base font-extrabold">Appearance</h2>
        <div className="flex items-center gap-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Icon name={isDark ? 'moon' : 'sun'} size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Dark mode</div>
            <div className="text-xs text-muted">{isDark ? 'On — easy on the eyes' : 'Off — light theme'}</div>
          </div>
          <Toggle on={isDark} onClick={toggleTheme} />
        </div>
      </section>

      {/* Notifications */}
      <section className="card p-5">
        <h2 className="mb-3 text-base font-extrabold">Notifications</h2>
        <div className="divide-y divide-line">
          {NOTIF_ROWS.map((r) => (
            <div key={r.key} className="flex items-center gap-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{r.label}</div>
                <div className="text-xs text-muted">{r.hint}</div>
              </div>
              <Toggle on={!!data.notifications[r.key]} onClick={() => toggleNotif(r.key)} />
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="card border-down/30 p-5">
        <h2 className="mb-1 text-base font-extrabold text-down">Danger zone</h2>
        <p className="mb-3 text-sm text-muted">Demo-only controls.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="btn-outline text-down" onClick={doReset}>
            <Icon name="trash" size={15} /> Reset demo data
          </button>
          <button className="btn-outline" onClick={doLogout}>
            <Icon name="logout" size={15} /> Log out
          </button>
        </div>
      </section>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`ml-auto inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${on ? 'bg-accent' : 'bg-line'}`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}
