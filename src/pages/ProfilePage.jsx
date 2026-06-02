import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Avatar from '../components/Avatar.jsx'
import { Icon } from '../components/Icons.jsx'
import { RoleBadge } from '../components/Badge.jsx'

export default function ProfilePage() {
  const { data, currentUser, updateProfile, cycleAvatar } = useStore()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(pick(currentUser))

  const myPosts = data.posts.filter((p) => p.authorId === 'me' && p.status === 'published')
  const myDrafts = data.posts.filter((p) => p.authorId === 'me' && p.status === 'draft')
  const upvotes = myPosts.reduce((s, p) => s + p.up, 0)

  const startEdit = () => {
    setForm(pick(currentUser))
    setEditing(true)
  }
  const save = () => {
    if (!form.name.trim()) return toast('Name is required', 'error')
    updateProfile({ name: form.name.trim(), phone: form.phone, location: form.location, bio: form.bio })
    setEditing(false)
    toast('Profile updated successfully')
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* identity card */}
      <div className="card flex flex-col items-center p-5 text-center">
        <Avatar member={currentUser} size={96} />
        <button onClick={() => { cycleAvatar(); toast('Avatar updated') }} className="btn-ghost mt-2 px-3 py-1 text-xs">
          <Icon name="edit" size={13} /> Change photo
        </button>
        <h2 className="mt-1 text-xl font-extrabold">{currentUser.name}</h2>
        <div className="mt-1"><RoleBadge role={currentUser.role} /></div>
        {currentUser.startup && <p className="mt-1 text-sm font-semibold text-muted">{currentUser.startup}</p>}

        <a
          href={currentUser.linkedin && currentUser.linkedin !== '#' ? currentUser.linkedin : undefined}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            if (!currentUser.linkedin || currentUser.linkedin === '#') {
              e.preventDefault()
              toast('No LinkedIn linked yet')
            }
          }}
          className="btn-outline mt-4 w-full"
        >
          <Icon name="link" size={15} /> Connect on LinkedIn
        </a>

        <div className="mt-5 grid w-full grid-cols-3 gap-1 border-t border-line pt-4">
          <Stat n={myPosts.length} label="Posts" />
          <Stat n={myDrafts.length} label="Drafts" />
          <Stat n={upvotes} label="Upvotes" />
        </div>
      </div>

      {/* detail panel */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-5 border-b border-line">
          <button className="border-b-2 border-accent px-1 pb-2 text-sm font-extrabold text-accent">
            Basic Info
          </button>
          {['Academic Info', 'Startup Info', 'My Posts'].map((t) => (
            <span key={t} className="cursor-not-allowed px-1 pb-2 text-sm font-semibold text-faint" title="Coming soon">
              {t}
            </span>
          ))}
          {!editing && (
            <button className="btn-outline ml-auto mb-1.5 px-3 py-1.5 text-xs" onClick={startEdit}>
              <Icon name="edit" size={13} /> Edit Profile
            </button>
          )}
        </div>

        {!editing ? (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <ViewField label="Full name" value={currentUser.name} />
            <ViewField label="Email address (locked)" value={currentUser.email} />
            <ViewField label="Phone number" value={currentUser.phone || '—'} />
            <ViewField label="Location" value={currentUser.location || '—'} />
            <div className="sm:col-span-2">
              <ViewField label="About me" value={currentUser.bio || '—'} />
            </div>
          </dl>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EditField label="Full name *">
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </EditField>
            <EditField label="Email address (locked)">
              <input className="input bg-page text-faint" value={currentUser.email} disabled />
            </EditField>
            <EditField label="Phone number">
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </EditField>
            <EditField label="Location">
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </EditField>
            <div className="sm:col-span-2">
              <EditField label="About me">
                <textarea className="input min-h-[80px] resize-y" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </EditField>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button className="btn-primary" onClick={save}>Save changes</button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const pick = (u) => ({ name: u.name || '', phone: u.phone || '', location: u.location || '', bio: u.bio || '' })

function Stat({ n, label }) {
  return (
    <div>
      <div className="text-lg font-extrabold text-accent">{n}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}
function ViewField({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
    </div>
  )
}
function EditField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  )
}
