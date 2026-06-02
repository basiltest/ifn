import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { buildSeed, SCHEMA_VERSION } from '../data/seed.js'
import { EMAIL_DOMAIN } from '../lib/tags.js'

const DATA_KEY = 'ifn_data'
const AUTH_KEY = 'ifn_auth'

const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

const uid = (p = 'id') =>
  `${p}_${(crypto?.randomUUID?.() || Math.random().toString(36).slice(2))}`

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.version === SCHEMA_VERSION) return parsed
    }
  } catch {
    /* ignore */
  }
  return buildSeed()
}

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(loadData)
  const [auth, setAuth] = useState(loadAuth)

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  }, [data])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.theme === 'dark')
  }, [data.theme])
  useEffect(() => {
    if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    else localStorage.removeItem(AUTH_KEY)
  }, [auth])

  // ---- immutable post helper ----
  const patchPost = (id, fn) =>
    setData((d) => ({ ...d, posts: d.posts.map((p) => (p.id === id ? fn({ ...p }) : p)) }))

  // ---- auth ----
  const login = (name, email) => {
    const clean = email.trim().toLowerCase()
    if (!clean.endsWith(EMAIL_DOMAIN)) {
      return { ok: false, error: `Email must end with ${EMAIL_DOMAIN}` }
    }
    if (!name.trim()) return { ok: false, error: 'Enter your name' }
    setData((d) => ({
      ...d,
      members: d.members.map((m) =>
        m.id === 'me' ? { ...m, name: name.trim(), email: clean } : m
      ),
    }))
    setAuth({ email: clean, role: 'student' })
    return { ok: true }
  }
  const logout = () => setAuth(null)
  const setRole = (role) => setAuth((a) => (a ? { ...a, role } : a))

  // ---- posts ----
  const createPost = (fields, { asDraft = false } = {}) => {
    const id = uid('p')
    const badges = fields.badges || []
    const isAutopsy = badges.includes('IdeaAutopsy')
    const published = !asDraft
    setData((d) => ({
      ...d,
      posts: [
        {
          id,
          authorId: 'me',
          startup: fields.startup || '',
          title: fields.title || 'Untitled',
          problem: fields.problem || '',
          solution: fields.solution || '',
          targetUsers: fields.targetUsers || '',
          solutionHypothesis: fields.solutionHypothesis || '',
          marketSize: fields.marketSize || '',
          team: fields.team || '',
          testsDone: fields.testsDone || '',
          tags: fields.tags || [],
          badges,
          mentorCriteria: {},
          successRequest: fields.requestSuccess ? 'pending' : 'none',
          pinned: false,
          gate: published && !isAutopsy ? 1 : null,
          gateStatus: 'New',
          mentorId: null,
          mentorFeedback: '',
          actionableSteps: [],
          comments: [],
          createdAt: new Date().toISOString(),
          up: 0,
          down: 0,
          myVote: 0,
          status: published ? 'published' : 'draft',
        },
        ...d.posts,
      ],
    }))
    return id
  }

  const publishDraft = (id) =>
    patchPost(id, (p) => {
      const isAutopsy = p.badges.includes('IdeaAutopsy')
      return {
        ...p,
        status: 'published',
        gate: isAutopsy ? null : p.gate || 1,
        createdAt: new Date().toISOString(),
      }
    })

  const deletePost = (id) =>
    setData((d) => ({ ...d, posts: d.posts.filter((p) => p.id !== id) }))

  const vote = (id, dir) =>
    patchPost(id, (p) => {
      const prev = p.myVote
      let { up, down } = p
      // undo previous
      if (prev === 1) up--
      if (prev === -1) down--
      const next = prev === dir ? 0 : dir
      if (next === 1) up++
      if (next === -1) down++
      return { ...p, up, down, myVote: next }
    })

  const togglePin = (id) => patchPost(id, (p) => ({ ...p, pinned: !p.pinned }))

  const addTag = (id, tag) =>
    patchPost(id, (p) => {
      const t = tag.replace(/^#/, '').trim().toLowerCase()
      if (!t || p.tags.includes(t) || p.tags.length >= 10) return p
      return { ...p, tags: [...p.tags, t] }
    })
  const removeTag = (id, tag) =>
    patchPost(id, (p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))

  const toggleBadge = (id, badge) =>
    patchPost(id, (p) => {
      const has = p.badges.includes(badge)
      const badges = has ? p.badges.filter((b) => b !== badge) : [...p.badges, badge]
      let gate = p.gate
      if (badge === 'IdeaAutopsy') {
        if (!has) gate = null // excluded from pipeline
        else if (p.status === 'published') gate = p.gate ?? 1
      }
      return { ...p, badges, gate }
    })

  const requestSuccess = (id) => patchPost(id, (p) => ({ ...p, successRequest: 'pending' }))
  const approveSuccess = (id) =>
    patchPost(id, (p) => ({
      ...p,
      successRequest: 'approved',
      badges: p.badges.includes('Success') ? p.badges : [...p.badges, 'Success'],
    }))
  const rejectSuccess = (id) => patchPost(id, (p) => ({ ...p, successRequest: 'rejected' }))

  const setActionableSteps = (id, steps) =>
    patchPost(id, (p) => ({ ...p, actionableSteps: steps }))

  const addComment = (id, body) =>
    patchPost(id, (p) => ({
      ...p,
      comments: [
        ...(p.comments || []),
        { id: uid('c'), authorId: 'me', body: body.trim(), createdAt: new Date().toISOString() },
      ],
    }))
  const deleteComment = (id, cid) =>
    patchPost(id, (p) => ({ ...p, comments: (p.comments || []).filter((c) => c.id !== cid) }))

  const toggleCriterion = (id, key) =>
    patchPost(id, (p) => {
      const mc = { ...(p.mentorCriteria || {}) }
      mc[key] = !mc[key]
      return { ...p, mentorCriteria: mc }
    })

  const mentorApprove = (id) =>
    patchPost(id, (p) => ({ ...p, gate: 3, gateStatus: 'Prototyping' }))
  const mentorRequestRevision = (id, feedback) =>
    patchPost(id, (p) => ({ ...p, gateStatus: 'Revision Requested', mentorFeedback: feedback }))
  const saveMentorFeedback = (id, feedback) =>
    patchPost(id, (p) => ({ ...p, mentorFeedback: feedback }))

  // ---- events ----
  const addEvent = (fields, { toAllStudents = false } = {}) =>
    setData((d) => ({
      ...d,
      events: [
        ...d.events,
        {
          id: uid('e'),
          creatorId: 'me',
          audience: toAllStudents ? 'all' : 'self',
          allDay: !!fields.allDay,
          ...fields,
        },
      ],
    }))
  const removeEventForMe = (id) =>
    setData((d) => ({
      ...d,
      removedEventIds: d.removedEventIds.includes(id)
        ? d.removedEventIds
        : [...d.removedEventIds, id],
    }))

  // ---- team ----
  const addTeamPost = (fields) =>
    setData((d) => ({
      ...d,
      teamPosts: [
        { id: uid('t'), authorId: 'me', createdAt: new Date().toISOString(), ...fields },
        ...d.teamPosts,
      ],
    }))

  // ---- profile / settings ----
  const updateProfile = (patch) =>
    setData((d) => ({
      ...d,
      members: d.members.map((m) => (m.id === 'me' ? { ...m, ...patch } : m)),
    }))
  const cycleAvatar = () =>
    setData((d) => ({
      ...d,
      members: d.members.map((m) =>
        m.id === 'me' ? { ...m, avatarTick: (m.avatarTick || 0) + 1 } : m
      ),
    }))
  const toggleNotif = (key) =>
    setData((d) => ({ ...d, notifications: { ...d.notifications, [key]: !d.notifications[key] } }))

  const setTheme = (theme) => setData((d) => ({ ...d, theme }))
  const toggleTheme = () =>
    setData((d) => ({ ...d, theme: d.theme === 'dark' ? 'light' : 'dark' }))

  const resetData = () =>
    setData(() => {
      const fresh = buildSeed()
      if (auth) {
        fresh.members = fresh.members.map((m) =>
          m.id === 'me' ? { ...m, email: auth.email } : m
        )
      }
      return fresh
    })

  // ---- derived ----
  const currentUser = useMemo(() => {
    const me = data.members.find((m) => m.id === 'me')
    return { ...me, role: auth?.role || me?.role || 'student' }
  }, [data.members, auth])

  const getMember = (id) => data.members.find((m) => m.id === id)

  const value = {
    data,
    auth,
    isAuthed: !!auth,
    currentUser,
    getMember,
    // actions
    login,
    logout,
    setRole,
    createPost,
    publishDraft,
    deletePost,
    vote,
    togglePin,
    addTag,
    removeTag,
    toggleBadge,
    requestSuccess,
    approveSuccess,
    rejectSuccess,
    setActionableSteps,
    addComment,
    deleteComment,
    toggleCriterion,
    mentorApprove,
    mentorRequestRevision,
    saveMentorFeedback,
    addEvent,
    removeEventForMe,
    addTeamPost,
    updateProfile,
    cycleAvatar,
    toggleNotif,
    setTheme,
    toggleTheme,
    resetData,
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
