import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import LeftNav from './LeftNav.jsx'
import RightSidebar from './RightSidebar.jsx'
import CreatePostModal from './CreatePostModal.jsx'

export default function Layout() {
  const [createOpen, setCreateOpen] = useState(false)
  const [draft, setDraft] = useState(null)

  const { pathname } = useLocation()

  const openCreate = (initial = null) => {
    setDraft(initial)
    setCreateOpen(true)
  }

  // Right rail (Trending / Upcoming) only belongs on the Feed; other pages go full width.
  const showRight = pathname === '/'

  return (
    <div className="min-h-full">
      <Header />
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
