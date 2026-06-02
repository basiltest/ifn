import { useMemo } from 'react'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Avatar from '../components/Avatar.jsx'
import { Icon } from '../components/Icons.jsx'
import { HardBadge, SuperTag } from '../components/Badge.jsx'
import { PageTitle } from './IdeaPipeline.jsx'

export default function AdminTagRequests() {
  const { data, getMember, approveSuccess, rejectSuccess } = useStore()
  const toast = useToast()
  const pending = useMemo(
    () => data.posts.filter((p) => p.successRequest === 'pending'),
    [data.posts]
  )

  return (
    <div className="space-y-4">
      <PageTitle
        icon="tag"
        title="Tag Requests"
        subtitle="Students request the verified #Success badge. Review the post, then approve or reject."
      />
      {pending.length === 0 ? (
        <div className="card p-10 text-center text-muted">No pending requests. 🎉</div>
      ) : (
        pending.map((p) => {
          const author = getMember(p.authorId) || { name: 'Unknown', role: 'student' }
          return (
            <div key={p.id} className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Avatar member={author} size={28} />
                <span className="text-sm font-bold">{author.name}</span>
                {p.startup && <span className="chip">{p.startup}</span>}
                <span className="ml-auto"><HardBadge badge="Success" pending /></span>
              </div>
              <h3 className="text-base font-extrabold">{p.title}</h3>
              <div className="mt-1 space-y-1 text-sm text-muted">
                <p><span className="font-semibold text-ink">Problem: </span>{p.problem}</p>
                <p><span className="font-semibold text-ink">Solution: </span>{p.solution}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t) => <SuperTag key={t} tag={t} />)}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="btn-outline text-down"
                  onClick={() => { rejectSuccess(p.id); toast('Request rejected') }}
                >
                  <Icon name="x" size={15} /> Reject
                </button>
                <button
                  className="btn-primary"
                  style={{ background: '#00BA7C', backgroundImage: 'none' }}
                  onClick={() => { approveSuccess(p.id); toast('#Success approved') }}
                >
                  <Icon name="check" size={15} /> Approve #Success
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
