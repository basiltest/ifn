import { Link } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { Icon } from './Icons.jsx'
import { EVENT_TYPES } from '../lib/tags.js'

export function visibleEvents(data) {
  return data.events
    .filter(
      (e) => (e.audience === 'all' || e.creatorId === 'me') && !data.removedEventIds.includes(e.id)
    )
    .sort((a, b) => new Date(a.start) - new Date(b.start))
}

export default function RightSidebar() {
  const { data } = useStore()

  const counts = {}
  data.posts
    .filter((p) => p.status === 'published')
    .forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)))
  const trending = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const upcoming = visibleEvents(data).slice(0, 4)

  return (
    <div className="sticky top-[72px] flex flex-col gap-4">
      <section className="card p-4">
        <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold">
          <Icon name="trend" size={18} className="text-accent" /> Trending Topics
        </h3>
        <ul className="-mx-2">
          {trending.map(([tag, n]) => (
            <li key={tag}>
              <Link
                to={`/?tag=${tag}`}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-black/5"
              >
                <span className="text-sm font-bold text-accent">#{tag}</span>
                <span className="text-xs text-faint">{n} {n === 1 ? 'post' : 'posts'}</span>
              </Link>
            </li>
          ))}
          {trending.length === 0 && <li className="px-2 text-sm text-faint">No tags yet</li>}
        </ul>
      </section>

      <section className="card p-4">
        <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold">
          <Icon name="calendar" size={18} className="text-accent" /> Upcoming Events
        </h3>
        <ul className="space-y-2.5">
          {upcoming.map((e) => (
            <li key={e.id} className="flex gap-2.5">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ background: EVENT_TYPES[e.type] }}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{e.title}</div>
                <div className="text-xs text-faint">
                  {new Date(e.start).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {!e.allDay &&
                    ' · ' +
                      new Date(e.start).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                  {' · '}
                  {e.type}
                </div>
              </div>
            </li>
          ))}
          {upcoming.length === 0 && <li className="text-sm text-faint">Nothing scheduled</li>}
        </ul>
        <Link to="/calendar" className="mt-3 block text-sm font-bold text-accent hover:underline">
          See full calendar →
        </Link>
      </section>

      <p className="px-2 text-xs leading-relaxed text-faint">
        IFN · ICFAI Founders Network · Frontend demo. Data is mock and stored in your browser.
      </p>
    </div>
  )
}
