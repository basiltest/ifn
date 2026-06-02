import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { Logo } from '../components/Header.jsx'
import { EMAIL_DOMAIN } from '../lib/tags.js'

export default function Login() {
  const { isAuthed, login } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (isAuthed) return <Navigate to="/" replace />

  const submit = (e) => {
    e.preventDefault()
    const res = login(name, email)
    if (res.ok) navigate('/')
    else setError(res.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#E8F5FE_0%,transparent_70%)]" />
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">ICFAI Founders Network</h1>
          <p className="mt-1 text-sm text-muted">
            Where student ideas meet mentors, alumni & funding.
          </p>
        </div>

        <form onSubmit={submit} className="card space-y-3 p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Full name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Chen"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">College email</span>
            <input
              className="input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder={`name${EMAIL_DOMAIN}`}
            />
            <span className="mt-1 block text-xs text-faint">Must end with {EMAIL_DOMAIN}</span>
          </label>

          {error && (
            <p className="rounded-lg bg-down/10 px-3 py-2 text-sm font-semibold text-down">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full py-2.5">
            Enter IFN
          </button>
          <p className="text-center text-xs text-faint">
            Demo login — no password. You start as a Student; switch roles from the header.
          </p>
        </form>
      </div>
    </div>
  )
}
