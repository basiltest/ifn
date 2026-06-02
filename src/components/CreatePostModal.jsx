import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import { useToast } from './Toast.jsx'
import Modal from './Modal.jsx'
import { Icon } from './Icons.jsx'
import { BADGES } from '../lib/tags.js'

const MAXLEN = 5000

export default function CreatePostModal({ open, onClose, initial = null }) {
  const { createPost, deletePost } = useStore()
  const toast = useToast()

  const [startup, setStartup] = useState(initial?.startup || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [problem, setProblem] = useState(initial?.problem || '')
  const [solution, setSolution] = useState(initial?.solution || '')
  const [tags, setTags] = useState(initial?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [selfBadges, setSelfBadges] = useState(
    (initial?.badges || []).filter((b) => BADGES[b]?.selfApply)
  )
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [targetUsers, setTargetUsers] = useState(initial?.targetUsers || '')
  const [solutionHypothesis, setSolutionHypothesis] = useState(initial?.solutionHypothesis || '')
  const [marketSize, setMarketSize] = useState(initial?.marketSize || '')
  const [team, setTeam] = useState(initial?.team || '')
  const [testsDone, setTestsDone] = useState(initial?.testsDone || '')
  const [showMore, setShowMore] = useState(
    !!(initial?.targetUsers || initial?.solutionHypothesis || initial?.marketSize || initial?.team || initial?.testsDone)
  )

  const tooLong = [problem, solution].some((t) => t.length > MAXLEN)
  const valid = title.trim() && problem.trim() && solution.trim() && !tooLong

  const addTag = () => {
    const t = tagInput.replace(/^#/, '').trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) setTags([...tags, t])
    setTagInput('')
  }
  const toggleSelf = (b) =>
    setSelfBadges((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]))

  const submit = (asDraft) => {
    const fields = {
      startup, title, problem, solution, tags, badges: selfBadges, requestSuccess,
      targetUsers, solutionHypothesis, marketSize, team, testsDone,
    }
    createPost(fields, { asDraft })
    if (initial?.id) deletePost(initial.id) // resumed draft replaced
    toast(asDraft ? 'Draft saved' : 'Post published')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit draft' : 'Create post'} maxWidth="max-w-xl">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Startup name (optional)">
            <input className="input" value={startup} onChange={(e) => setStartup(e.target.value)} placeholder="e.g. AgriPrice" />
          </Field>
          <Field label="Title *">
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Specific, clear headline" />
          </Field>
        </div>

        <Field label="Problem statement *">
          <textarea className="input min-h-[70px] resize-y" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="The real-world problem this addresses" />
        </Field>
        <Field label="Solution *">
          <textarea className="input min-h-[70px] resize-y" value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="What you're building" />
        </Field>
        {tooLong && <p className="text-xs font-semibold text-down">Text too long — keep under {MAXLEN} characters.</p>}

        {/* G1 structured submission fields (optional) */}
        <div className="rounded-lg border border-line">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:bg-black/5"
          >
            <span>G1 submission details (optional)</span>
            <Icon name="chevronDown" size={16} className={showMore ? 'rotate-180' : ''} />
          </button>
          {showMore && (
            <div className="space-y-3 border-t border-line p-3">
              <Field label="Target users">
                <textarea className="input min-h-[48px] resize-y" value={targetUsers} onChange={(e) => setTargetUsers(e.target.value)} placeholder="Who has this problem, and how often?" />
              </Field>
              <Field label="Solution hypothesis">
                <textarea className="input min-h-[48px] resize-y" value={solutionHypothesis} onChange={(e) => setSolutionHypothesis(e.target.value)} placeholder="Your starting assumption — not a final answer" />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Market size">
                  <input className="input" value={marketSize} onChange={(e) => setMarketSize(e.target.value)} placeholder="TAM / SAM / SOM or a rough sizing" />
                </Field>
                <Field label="Team">
                  <input className="input" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Who's building — names, roles" />
                </Field>
              </div>
              <Field label="Tests done so far">
                <textarea className="input min-h-[48px] resize-y" value={testsDone} onChange={(e) => setTestsDone(e.target.value)} placeholder="Experiments, interviews, validation already done" />
              </Field>
            </div>
          )}
        </div>

        <Field label={`Supertags (${tags.length}/10)`}>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="chip">
                #{t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`remove ${t}`}>
                  <Icon name="x" size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex gap-2">
            <input
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Type a tag, press Enter"
            />
            <button className="btn-outline" onClick={addTag} type="button">Add</button>
          </div>
        </Field>

        <Field label="Special badges">
          <div className="flex flex-wrap gap-2">
            {['IdeaValidation', 'IdeaAutopsy'].map((b) => {
              const on = selfBadges.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleSelf(b)}
                  className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
                  style={{
                    color: on ? '#fff' : BADGES[b].color,
                    background: on ? BADGES[b].color : BADGES[b].bg,
                  }}
                >
                  {on ? '✓ ' : ''}{BADGES[b].label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setRequestSuccess((v) => !v)}
              className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
              style={{
                color: requestSuccess ? '#fff' : BADGES.Success.color,
                background: requestSuccess ? BADGES.Success.color : BADGES.Success.bg,
              }}
            >
              {requestSuccess ? '✓ ' : ''}Request #Success
            </button>
          </div>
          <p className="mt-1 text-xs text-faint">
            #IdeaValidation / #IdeaAutopsy apply instantly. #Success needs admin approval.
            {selfBadges.includes('IdeaAutopsy') && ' Autopsy posts are excluded from the pipeline.'}
          </p>
        </Field>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-outline" onClick={() => submit(true)} disabled={!title.trim()}>
            Save as draft
          </button>
          <button className="btn-primary" onClick={() => submit(false)} disabled={!valid}>
            Publish
          </button>
        </div>
      </div>
    </Modal>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  )
}
