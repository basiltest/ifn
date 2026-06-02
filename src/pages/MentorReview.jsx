import { useMemo } from 'react'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import { Icon } from '../components/Icons.jsx'
import { SuperTag } from '../components/Badge.jsx'
import { PageTitle } from './IdeaPipeline.jsx'
import { CRITERIA } from '../lib/tags.js'

export default function MentorReview() {
  const { data } = useStore()
  const queue = useMemo(
    () => data.posts.filter((p) => p.gate === 2 && p.mentorId === 'me'),
    [data.posts]
  )

  return (
    <div className="space-y-4">
      <PageTitle
        icon="review"
        title="Mentor Review"
        subtitle="Ideas assigned to you at Gate 2. Give feedback, then approve to G3 or request a revision."
      />
      {queue.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          Nothing assigned to you right now. (Demo: switch to a Mentor to see assigned ideas.)
        </div>
      ) : (
        queue.map((p) => <ReviewCard key={p.id} post={p} />)
      )}
    </div>
  )
}

function ReviewCard({ post }) {
  const { getMember, mentorApprove, mentorRequestRevision, saveMentorFeedback, toggleCriterion } = useStore()
  const toast = useToast()
  const [fb, setFb] = useState(post.mentorFeedback || '')
  const author = getMember(post.authorId) || { name: 'Unknown', role: 'student' }
  const mc = post.mentorCriteria || {}
  const metCount = CRITERIA.filter((c) => mc[c.key]).length

  const approve = () => {
    if (fb.trim()) saveMentorFeedback(post.id, fb.trim())
    mentorApprove(post.id)
    toast(`${post.startup || 'Idea'} approved → G3 Prototyping`)
  }
  const revise = () => {
    if (!fb.trim()) return toast('Add feedback before requesting a revision', 'error')
    mentorRequestRevision(post.id, fb.trim())
    toast('Revision requested')
  }

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Avatar member={author} size={28} />
        <span className="text-sm font-bold">{author.name}</span>
        {post.startup && <span className="chip">{post.startup}</span>}
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
            post.gateStatus === 'Revision Requested' ? 'bg-warn/20 text-[#7a5b00]' : 'bg-accent-soft text-accent'
          }`}
        >
          {post.gateStatus}
        </span>
      </div>

      <h3 className="text-base font-extrabold">{post.title}</h3>
      <div className="mt-1 space-y-1 text-sm text-muted">
        <p><span className="font-semibold text-ink">Problem: </span>{post.problem}</p>
        <p><span className="font-semibold text-ink">Solution: </span>{post.solution}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {post.tags.map((t) => <SuperTag key={t} tag={t} />)}
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
          Evaluate · {metCount}/{CRITERIA.length} met
        </span>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {CRITERIA.map((c) => {
            const on = !!mc[c.key]
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleCriterion(post.id, c.key)}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                  on ? 'border-accent bg-accent-soft text-accent' : 'border-line text-muted hover:bg-black/5'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    on ? 'border-accent bg-accent text-white' : 'border-line'
                  }`}
                >
                  {on && <Icon name="check" size={11} strokeWidth={3} />}
                </span>
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Your feedback</span>
        <textarea
          className="input min-h-[70px] resize-y"
          value={fb}
          onChange={(e) => setFb(e.target.value)}
          placeholder="Clarity, feasibility, market, next steps…"
        />
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button className="btn-outline text-[#7a5b00]" onClick={revise}>
          <Icon name="edit" size={15} /> Request Revision
        </button>
        <button className="btn-primary" onClick={approve}>
          <Icon name="check" size={15} /> Approve → G3
        </button>
      </div>
    </div>
  )
}
