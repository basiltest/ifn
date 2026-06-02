import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import PostCard from '../components/PostCard.jsx'
import { Icon } from '../components/Icons.jsx'

export default function Feed() {
  const { data } = useStore()
  const { openCreate } = useOutletContext()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('new')
  const [tagFilter, setTagFilter] = useState(params.get('tag'))

  useEffect(() => {
    setTagFilter(params.get('tag'))
  }, [params])

  const allTags = useMemo(() => {
    const s = new Set()
    data.posts.forEach((p) => p.status === 'published' && p.tags.forEach((t) => s.add(t)))
    return [...s].sort()
  }, [data.posts])

  const isTagQuery = q.startsWith('#')
  const frag = q.replace(/^#/, '').trim().toLowerCase()
  const suggestions = isTagQuery ? allTags.filter((t) => t.includes(frag)).slice(0, 8) : []

  const applyTag = (t) => {
    setTagFilter(t)
    setParams(t ? { tag: t } : {})
    setQ('')
  }
  const clearTag = () => {
    setTagFilter(null)
    setParams({})
  }

  const posts = useMemo(() => {
    let list = data.posts.filter((p) => p.status === 'published')
    if (tagFilter) list = list.filter((p) => p.tags.includes(tagFilter))
    if (q && !isTagQuery) {
      const needle = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.startup.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.includes(needle))
      )
    }
    const pinned = list.filter((p) => p.pinned)
    const rest = list.filter((p) => !p.pinned)
    const cmp =
      sort === 'top'
        ? (a, b) => b.up - b.down - (a.up - a.down)
        : (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    return [...pinned.sort(cmp), ...rest.sort(cmp)]
  }, [data.posts, tagFilter, q, isTagQuery, sort])

  return (
    <div className="space-y-4">
      {/* search */}
      <div className="card sticky top-14 z-30 p-3">
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            className="input pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts, or type # to filter by supertag"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-30 mt-1 animate-pop-in rounded-xl border border-line bg-card py-1 shadow-pop">
              {suggestions.map((t) => (
                <button
                  key={t}
                  onClick={() => applyTag(t)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold hover:bg-black/5"
                >
                  <span className="text-accent">#{t}</span>
                  <span className="ml-auto text-xs text-faint">
                    {data.posts.filter((p) => p.status === 'published' && p.tags.includes(t)).length} posts
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <SortTab active={sort === 'new'} onClick={() => setSort('new')} icon="clock" label="Newest" />
          <SortTab active={sort === 'top'} onClick={() => setSort('top')} icon="arrowUp" label="Top" />
          {tagFilter && (
            <button onClick={clearTag} className="chip ml-auto">
              #{tagFilter}
              <Icon name="x" size={12} />
            </button>
          )}
        </div>
      </div>

      {/* posts */}
      {posts.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-base font-bold">No posts match.</p>
          <p className="text-sm text-muted">
            {tagFilter || q ? 'Try clearing the filter.' : 'Be the first to share an idea.'}
          </p>
          <button className="btn-primary" onClick={() => openCreate()}>
            <Icon name="plus" size={16} /> Create Post
          </button>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard key={p.id} post={p} onTagClick={applyTag} activeTag={tagFilter} />
        ))
      )}
    </div>
  )
}

function SortTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
        active ? 'bg-accent text-white' : 'text-muted hover:bg-black/5'
      }`}
    >
      <Icon name={icon} size={15} /> {label}
    </button>
  )
}
