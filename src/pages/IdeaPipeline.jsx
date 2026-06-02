import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import GateBar from '../components/GateBar.jsx'
import { Icon } from '../components/Icons.jsx'
import { HardBadge, SuperTag } from '../components/Badge.jsx'
import { gateFull, gateMeaning, gateSteps } from '../lib/tags.js'

export default function IdeaPipeline() {
  const { data, currentUser } = useStore()
  const { openCreate } = useOutletContext()

  const ideas = useMemo(
    () =>
      data.posts
        .filter((p) => p.authorId === 'me' && p.status === 'published' && p.gate != null)
        .sort((a, b) => b.gate - a.gate),
    [data.posts]
  )
  const drafts = data.posts.filter((p) => p.authorId === 'me' && p.status === 'draft')

  const [sel, setSel] = useState(ideas[0]?.id || null)
  const selected = ideas.find((p) => p.id === sel) || ideas[0] || null

  return (
    <div className="space-y-4">
      <PageTitle
        icon="pipeline"
        title="Idea Pipeline"
        subtitle="Every published idea runs the 6 gates from Submission to Incubation. Autopsy posts are excluded."
      />

      {drafts.length > 0 && (
        <section className="card p-4">
          <h3 className="mb-2 text-sm font-extrabold">Drafts ({drafts.length})</h3>
          <div className="flex flex-wrap gap-2">
            {drafts.map((d) => (
              <button
                key={d.id}
                onClick={() => openCreate(d)}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-black/5"
              >
                <Icon name="edit" size={14} className="text-muted" />
                {d.title}
              </button>
            ))}
          </div>
        </section>
      )}

      {ideas.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-bold">No ideas in the pipeline yet.</p>
          <p className="mt-1 text-sm text-muted">Publish a post (without #IdeaAutopsy) to enter at G1.</p>
          <button className="btn-primary mt-3" onClick={() => openCreate()}>
            <Icon name="plus" size={16} /> Create Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            {ideas.map((p) => (
              <button
                key={p.id}
                onClick={() => setSel(p.id)}
                className={`card p-3 text-left transition-colors ${
                  selected?.id === p.id ? 'ring-2 ring-accent' : 'hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-extrabold">{p.startup || p.title}</span>
                  <span className="ml-2 shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                    G{p.gate}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{p.title}</p>
                <div className="mt-2">
                  <GateBar gate={p.gate} compact />
                </div>
              </button>
            ))}
          </div>

          {selected && <IdeaDetail key={selected.id} post={selected} canEdit={['mentor', 'admin'].includes(currentUser.role)} />}
        </div>
      )}
    </div>
  )
}

function IdeaDetail({ post, canEdit }) {
  const { setActionableSteps } = useStore()
  const toast = useToast()
  const defaults = gateSteps(post.gate)
  const displaySteps = post.actionableSteps.length ? post.actionableSteps : defaults
  const isCustom = post.actionableSteps.length > 0
  const [steps, setSteps] = useState(post.actionableSteps.length ? post.actionableSteps : defaults)
  const [editing, setEditing] = useState(false)

  const save = () => {
    setActionableSteps(post.id, steps.map((s) => s.trim()).filter(Boolean))
    setEditing(false)
    toast('Actionable steps saved')
  }

  return (
    <div className="card p-5">
      <div className="mb-4 rounded-xl border border-line bg-page/50 p-4">
        <GateBar gate={post.gate} />
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="chip">{post.startup || 'Idea'}</span>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
          G{post.gate} · {gateFull(post.gate)}
        </span>
        <span className="text-xs font-semibold text-muted">Status: {post.gateStatus}</span>
        {post.badges.map((b) => (
          <HardBadge key={b} badge={b} />
        ))}
      </div>

      <p className="mb-3 rounded-lg bg-accent-soft px-3 py-2 text-sm leading-relaxed text-ink">
        <span className="font-bold">What this gate means: </span>
        {gateMeaning(post.gate)}
      </p>

      <h2 className="text-xl font-extrabold leading-snug">{post.title}</h2>
      <div className="mt-2 space-y-1.5 text-sm text-muted">
        <p><span className="font-semibold text-ink">Problem: </span>{post.problem}</p>
        <p><span className="font-semibold text-ink">Solution: </span>{post.solution}</p>
      </div>

      <SubmissionDetails post={post} />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <SuperTag key={t} tag={t} />
        ))}
      </div>

      {post.mentorFeedback && (
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent-soft p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
            <Icon name="review" size={14} /> Mentor feedback
          </div>
          <p className="text-sm text-ink">{post.mentorFeedback}</p>
        </div>
      )}

      {/* actionable steps */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold">Actionable steps</h3>
          {canEdit && !editing && (
            <button className="btn-outline px-3 py-1.5 text-xs" onClick={() => setEditing(true)}>
              <Icon name="edit" size={13} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <>
            <ul className="space-y-1.5">
              {displaySteps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            {!isCustom && (
              <p className="mt-2 text-xs text-faint">
                Default checklist for this gate.{canEdit ? ' Click Edit to tailor it for this idea.' : ''}
              </p>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input"
                  value={s}
                  onChange={(e) => setSteps(steps.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Step ${i + 1}`}
                />
                <button
                  className="btn-ghost px-2"
                  onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                  aria-label="remove step"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <button className="btn-outline px-3 py-1.5 text-xs" onClick={() => setSteps([...steps, ''])}>
                <Icon name="plus" size={13} /> Add step
              </button>
              <div className="ml-auto flex gap-2">
                <button className="btn-ghost text-xs" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn-primary px-3 py-1.5 text-xs" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SubmissionDetails({ post }) {
  const rows = [
    ['Target users', post.targetUsers],
    ['Solution hypothesis', post.solutionHypothesis],
    ['Market size', post.marketSize],
    ['Team', post.team],
    ['Tests done so far', post.testsDone],
  ].filter(([, v]) => v && v.trim())
  if (!rows.length) return null
  return (
    <div className="mt-4 rounded-xl border border-line bg-page/40 p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Submission details</div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-bold text-ink">{label}</dt>
            <dd className="text-sm text-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function PageTitle({ icon, title, subtitle, action }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon name={icon} size={22} />
      </span>
      <div className="min-w-0">
        <h1 className="text-lg font-extrabold leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}
