import { useMemo, useState } from 'react'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Modal from '../components/Modal.jsx'
import Avatar from '../components/Avatar.jsx'
import { Icon } from '../components/Icons.jsx'
import { PageTitle } from './IdeaPipeline.jsx'
import { timeAgo } from '../lib/tags.js'

export default function TeamBoard() {
  const { data, getMember, addTeamPost } = useStore()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [applyTo, setApplyTo] = useState(null)
  const [posting, setPosting] = useState(false)

  const posts = useMemo(() => {
    const list = [...data.teamPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (!q.trim()) return list
    const n = q.toLowerCase()
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(n) ||
        t.startup.toLowerCase().includes(n) ||
        t.description.toLowerCase().includes(n) ||
        t.skills.some((s) => s.toLowerCase().includes(n))
    )
  }, [data.teamPosts, q])

  return (
    <div className="space-y-4">
      <PageTitle
        icon="team"
        title="Team Board"
        subtitle="Founders post role needs. Find a co-founder or join a team."
        action={
          <button className="btn-primary" onClick={() => setPosting(true)}>
            <Icon name="plus" size={16} /> Post a need
          </button>
        }
      />

      <div className="card p-3">
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            className="input pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search roles, skills, startups…"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((t) => {
          const author = getMember(t.authorId) || { name: 'Unknown', role: 'student' }
          return (
            <div key={t.id} className="card flex flex-col p-4">
              <div className="mb-2 flex items-center gap-2">
                <Avatar member={author} size={28} />
                <span className="text-sm font-bold">{author.name}</span>
                {t.startup && <span className="chip">{t.startup}</span>}
                <span className="ml-auto text-xs text-faint">{timeAgo(t.createdAt)}</span>
              </div>
              <h3 className="text-base font-extrabold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted">{t.description}</p>

              <dl className="mt-3 space-y-1.5 text-sm">
                <Row label="Looking for" value={t.lookingFor} />
                {t.commitment && <Row label="Commitment" value={t.commitment} />}
                {t.stage && <Row label="Stage" value={t.stage} />}
              </dl>

              <div className="mt-3">
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">Skills required</div>
                <div className="flex flex-wrap gap-1.5">
                  {t.skills.map((s) => (
                    <span key={s} className="rounded-full bg-page px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-line">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button className="btn-primary mt-4 self-start" onClick={() => setApplyTo({ ...t, author })}>
                Apply
              </button>
            </div>
          )
        })}
        {posts.length === 0 && (
          <div className="card col-span-full p-10 text-center text-muted">No matching role needs.</div>
        )}
      </div>

      {applyTo && (
        <ApplyModal post={applyTo} onClose={() => setApplyTo(null)} onSent={(name) => {
          setApplyTo(null)
          toast(`Application sent to ${name} ✓`)
        }} />
      )}
      {posting && <PostNeedModal onClose={() => setPosting(false)} onSubmit={(f) => {
        addTeamPost(f)
        setPosting(false)
        toast('Role need posted')
      }} />}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

function ApplyModal({ post, onClose, onSent }) {
  const [msg, setMsg] = useState('')
  return (
    <Modal open onClose={onClose} title={`Apply · ${post.title}`}>
      <p className="mb-3 text-sm text-muted">
        Applying to <span className="font-bold text-ink">{post.author.name}</span> for{' '}
        <span className="font-bold text-ink">{post.startup || post.title}</span>.
      </p>
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Message (optional)</span>
        <textarea
          className="input min-h-[90px] resize-y"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Why you're a fit, links, availability…"
        />
      </label>
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={() => onSent(post.author.name)}>Send application</button>
      </div>
    </Modal>
  )
}

function PostNeedModal({ onClose, onSubmit }) {
  const [f, setF] = useState({ title: '', startup: '', description: '', lookingFor: '', commitment: '', stage: 'Idea' })
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const valid = f.title.trim() && f.lookingFor.trim() && f.description.trim()

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills([...skills, s])
    setSkillInput('')
  }

  return (
    <Modal open onClose={onClose} title="Post a role need" maxWidth="max-w-xl">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <L label="Role title *"><input className="input" value={f.title} onChange={set('title')} placeholder="e.g. Full-Stack Developer" /></L>
          <L label="Startup"><input className="input" value={f.startup} onChange={set('startup')} placeholder="e.g. FarmSense" /></L>
        </div>
        <L label="Description *"><textarea className="input min-h-[70px] resize-y" value={f.description} onChange={set('description')} placeholder="What you need and why" /></L>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <L label="Looking for *"><input className="input" value={f.lookingFor} onChange={set('lookingFor')} placeholder="Co-founder / Designer…" /></L>
          <L label="Commitment"><input className="input" value={f.commitment} onChange={set('commitment')} placeholder="Part-time…" /></L>
          <L label="Stage">
            <select className="input" value={f.stage} onChange={set('stage')}>
              <option>Idea</option><option>Prototype</option><option>Revenue</option>
            </select>
          </L>
        </div>
        <L label="Skills required">
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="chip">{s}
                <button onClick={() => setSkills(skills.filter((x) => x !== s))}><Icon name="x" size={12} /></button>
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex gap-2">
            <input className="input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add skill, press Enter" />
            <button className="btn-outline" type="button" onClick={addSkill}>Add</button>
          </div>
        </L>
        <div className="flex justify-end gap-2 border-t border-line pt-3">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!valid} onClick={() => onSubmit({ ...f, skills })}>Post</button>
        </div>
      </div>
    </Modal>
  )
}

function L({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  )
}
