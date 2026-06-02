import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import { useToast } from './Toast.jsx'
import { Icon } from './Icons.jsx'
import { ROLES, ROLE_META } from '../lib/tags.js'

export default function RoleSwitcher() {
  const { currentUser, setRole } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const m = ROLE_META[currentUser.role]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5 text-xs font-bold hover:bg-black/5"
        title="Switch role (demo)"
      >
        <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
        {m.label}
        <Icon name="chevronDown" size={14} className="text-muted" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-20 mt-1.5 w-44 animate-pop-in rounded-xl border border-line bg-card py-1 shadow-pop">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-faint">
              View app as
            </div>
            {ROLES.map((r) => {
              const rm = ROLE_META[r]
              const active = currentUser.role === r
              return (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r)
                    setOpen(false)
                    toast(`Now viewing as ${rm.label}`)
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold hover:bg-black/5"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: rm.color }} />
                    {rm.label}
                  </span>
                  {active && <Icon name="check" size={15} className="text-accent" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
