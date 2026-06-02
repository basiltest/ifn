// Supertag + pipeline + event constants and helpers.

export const EMAIL_DOMAIN = '@ifheindia.org'

export const ROLES = ['student', 'mentor', 'admin']

export const ROLE_META = {
  student: { label: 'Student', color: '#536471', bg: '#EFF3F4' },
  mentor: { label: 'Mentor', color: '#7856FF', bg: '#F0EDFF' },
  admin: { label: 'Admin', color: '#1D9BF0', bg: '#E8F5FE' },
}

// Hardcoded badge metadata. `requestable` = needs admin approval (#Success only).
export const BADGES = {
  IdeaAutopsy: { label: '#IdeaAutopsy', color: '#F4212E', bg: '#FDEAEA', selfApply: true },
  IdeaValidation: { label: '#IdeaValidation', color: '#1D9BF0', bg: '#E8F5FE', selfApply: true },
  Success: { label: '#Success', color: '#00BA7C', bg: '#E3F8F1', selfApply: false },
}

export const EVENT_TYPES = {
  Workshop: '#1D9BF0',
  Mentorship: '#00BA7C',
  Deadline: '#F4212E',
  Hackathon: '#7856FF',
  Other: '#8B98A5',
}

// 6-gate pipeline. `key` = short label on the bar; `full` = reference name; `meaning` = what
// happens at this gate; `steps` = default actionable checklist (mentor can override per idea).
export const GATES = [
  {
    n: 1,
    key: 'Submitted',
    full: 'Submission',
    icon: 'check',
    meaning:
      'You submit a structured idea form. The idea enters the pipeline and is assigned a tracking ID, then waits for a mentor to be assigned.',
    steps: [
      'Complete the idea form — problem, target users, solution hypothesis, market size, team, tests done',
      'Note your pipeline tracking ID',
      'Wait for mentor assignment (typically within 5 business days)',
    ],
  },
  {
    n: 2,
    key: 'Mentor Review',
    full: 'Mentor Review',
    icon: 'review',
    meaning:
      'Your assigned mentor evaluates the idea for clarity, feasibility, market potential, innovation, technical possibility, problem–solution fit and scalability, then gives written feedback or requests a clarification call.',
    steps: [
      'Answer mentor questions or book a clarification call',
      'Address the feedback and resubmit if a revision is requested',
      'Get approved to advance to the Prototype stage',
    ],
  },
  {
    n: 3,
    key: 'Prototyping',
    full: 'Prototype Development',
    icon: 'flask',
    meaning:
      'Approved ideas build a prototype or MVP using incubator resources (workshops, labs, seed funds) with mentor guidance. Typically a 4–8 week build with weekly progress logs in the Build Lab.',
    steps: [
      'Build a working MVP using incubator resources',
      'Post weekly progress logs in the Build Lab',
      'Hit mentor checkpoints across the 4–8 week build window',
    ],
  },
  {
    n: 4,
    key: 'Validation',
    full: 'Validation',
    icon: 'shield',
    meaning:
      'Mentors, faculty, the incubator team, startup clubs and alumni founders formally validate the prototype — testing key assumptions, market fit, problem genuineness, whether the solution works, user comprehension and business-model practicality.',
    steps: [
      'Present the prototype to the validation panel',
      'Test key assumptions and capture the results',
      'Show market fit and a practical business model',
    ],
  },
  {
    n: 5,
    key: 'Notified',
    full: 'Mail Notification',
    icon: 'mail',
    meaning:
      'Automated emails go out with the validation result, mentor feedback, next steps, meeting information, incubation opportunities and any required improvements.',
    steps: [
      'Review the validation result email',
      'Act on the required improvements and next steps',
      'Confirm your incubation meeting slot',
    ],
  },
  {
    n: 6,
    key: 'Incubation',
    full: 'Incubation & Growth',
    icon: 'rocket',
    meaning:
      'Validated ideas move into full incubation: mentor guidance, team building, networking, investor connections, startup events, workshops, funding opportunities and product-development support.',
    steps: [
      'Tap mentorship, networking and investor connections',
      'Build out the team and product roadmap',
      'Pursue funding and growth milestones',
    ],
  },
]

const gateOf = (n) => GATES.find((g) => g.n === n)
export const gateLabel = (n) => gateOf(n)?.key || '—'
export const gateFull = (n) => gateOf(n)?.full || '—'
export const gateMeaning = (n) => gateOf(n)?.meaning || ''
export const gateSteps = (n) => gateOf(n)?.steps || []

// G2 mentor evaluation criteria (from the reference spec).
export const CRITERIA = [
  { key: 'clarity', label: 'Clarity' },
  { key: 'feasibility', label: 'Feasibility' },
  { key: 'market', label: 'Market potential' },
  { key: 'innovation', label: 'Innovation' },
  { key: 'technical', label: 'Technical possibility' },
  { key: 'fit', label: 'Problem–solution fit' },
  { key: 'scalability', label: 'Scalability' },
]

// Avatar palette (deterministic by string).
const AVATAR_COLORS = ['#1D9BF0', '#7856FF', '#00BA7C', '#F4212E', '#FFAD1F', '#E0245E', '#17BF63']
export function avatarColor(seed = '') {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}
export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

export function timeAgo(iso) {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const s = Math.max(1, Math.floor((now - then) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// Extract a leading "#token" from a raw search string (supertag search).
export function parseTagQuery(q) {
  const m = q.trim().match(/^#([\w-]*)$/)
  return m ? m[1].toLowerCase() : null
}
