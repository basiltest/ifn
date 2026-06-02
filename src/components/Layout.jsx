import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import LeftNav from './LeftNav.jsx'
import RightSidebar from './RightSidebar.jsx'
import CreatePostModal from './CreatePostModal.jsx'
import { Icon } from './Icons.jsx'

export default function Layout() {
  const [createOpen, setCreateOpen] = useState(false)
  const [draft, setDraft] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const { pathname } = useLocation()

  const openCreate = (initial = null) => {
    setDraft(initial)
    setCreateOpen(true)
  }

  // Close the mobile drawer on route change.
  useEffect(() => setNavOpen(false), [pathname])

  // Close on Escape; lock body scroll while the drawer is open.
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [navOpen])

  // Right rail (Trending / Upcoming) only belongs on the Feed; other pages go full width.
  const showRight = pathname === '/'

  return (
    <div className="min-h-full">
      <Header onMenu={() => setNavOpen(true)} />

      {/* Mobile nav drawer (below lg). Desktop uses the static aside below. */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto border-r border-line bg-card p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[15px] font-extrabold">ICFAI Founders Network</span>
              <button
                onClick={() => setNavOpen(false)}
                className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-ink"
                aria-label="Close navigation"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <LeftNav onCreate={() => openCreate()} onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-5 ${
          showRight
            ? 'lg:grid-cols-[220px_minmax(0,1fr)_300px]'
            : 'lg:grid-cols-[220px_minmax(0,1fr)]'
        }`}
      >
        <aside className="hidden lg:block">
          <LeftNav onCreate={() => openCreate()} />
        </aside>

        <main className="min-w-0">
          <Outlet context={{ openCreate }} />
        </main>

        {showRight && (
          <aside className="hidden lg:block">
            <RightSidebar />
          </aside>
        )}
      </div>

      <CreatePostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initial={draft}
      />
    </div>
  )
}
