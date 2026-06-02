// Mock data seeded into localStorage on first load. Re-seeded by Danger Zone reset
// or when SCHEMA_VERSION changes.

export const SCHEMA_VERSION = 6

// ISO helpers anchored near the demo "today" (June 2026).
const iso = (s) => new Date(s).toISOString()

export const MEMBERS = [
  // The logged-in user. name/email overwritten on login; role flips via header switcher.
  {
    id: 'me',
    name: 'You',
    email: 'you@ifheindia.org',
    role: 'student',
    linkedin: 'https://linkedin.com/in/you',
    bio: 'Building in public. AgTech & campus tools.',
    phone: '+91 90000 00000',
    location: 'Hyderabad Campus, Block B',
    startup: 'AgriPrice',
  },
  { id: 'u_aarav', name: 'Aarav Sharma', email: 'aarav@ifheindia.org', role: 'student', linkedin: '#', bio: 'IoT + agri.', startup: 'FarmSense' },
  { id: 'u_priya', name: 'Priya Nair', email: 'priya@ifheindia.org', role: 'student', linkedin: '#', bio: 'EdTech founder.', startup: 'StudyBuddy' },
  { id: 'u_karan', name: 'Karan Mehta', email: 'karan@ifheindia.org', role: 'student', linkedin: '#', bio: 'Fintech for students.', startup: 'PayPeer' },
  { id: 'u_keerthi', name: 'Keerthi Rao', email: 'keerthi@ifheindia.org', role: 'student', linkedin: '#', bio: 'Health data nerd.', startup: 'HealthTrack' },
  { id: 'u_rohan', name: 'Rohan Das', email: 'rohan@ifheindia.org', role: 'student', linkedin: '#', bio: 'Sustainability.', startup: 'WasteMap' },
  { id: 'u_ananya', name: 'Ananya Iyer', email: 'ananya@ifheindia.org', role: 'student', linkedin: '#', bio: 'NLP + learning.', startup: 'LinguaLoop' },
  { id: 'u_mehta', name: 'Dr. S. Mehta', email: 'mehta@ifheindia.org', role: 'mentor', linkedin: '#', bio: 'Alumni mentor · ex-founder.', startup: '' },
  { id: 'u_rao', name: 'Prof. Lakshmi Rao', email: 'rao@ifheindia.org', role: 'mentor', linkedin: '#', bio: 'Faculty · entrepreneurship.', startup: '' },
  { id: 'u_neha', name: 'Neha Verma', email: 'neha@ifheindia.org', role: 'admin', linkedin: '#', bio: 'IFN incubator admin.', startup: '' },
]

// status: 'draft' | 'published'
// gate: 1..6 or null (null => excluded from pipeline, e.g. IdeaAutopsy posts)
// gateStatus: 'New' | 'In Review' | 'Revision Requested' | 'Prototyping' | 'Demo Ready' | 'Validated' | 'Notified' | 'Incubating'
// badges: subset of ['IdeaAutopsy','IdeaValidation','Success']
// successRequest: 'none' | 'pending' | 'approved' | 'rejected'
export const POSTS = [
  {
    id: 'p_announce', authorId: 'u_neha', startup: '', pinned: true,
    title: '📣 Demo Day Q2 is June 20 — applications close June 12',
    problem: 'Cohort founders: lock your slot for the quarterly Demo Day in front of mentors, faculty and investors.',
    solution: 'Submit your idea to the pipeline and reach Demo Ready (G3+) to be eligible. Grant deadline is June 12.',
    tags: ['announcement', 'demoday'], badges: [], successRequest: 'none',
    gate: null, gateStatus: 'New', mentorId: null, mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-06-02T08:30:00'), up: 64, down: 1, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_agriprice', authorId: 'me', startup: 'AgriPrice',
    title: 'AgriPrice — live mandi prices for small farmers over SMS',
    problem: 'Small farmers in Telangana lack real-time crop price info and get underpaid by middlemen.',
    solution: 'An SMS + app service pushing daily mandi rates; no smartphone needed. Piloting with 20 farmers.',
    targetUsers: 'Small & marginal farmers (1–5 acres) in Telangana mandis, mostly feature-phone users.',
    solutionHypothesis: 'If farmers get the morning mandi rate over SMS, they negotiate better and capture 8–12% more per sale.',
    marketSize: 'TAM ~120M Indian farmers; SAM ~5.5M Telangana; SOM 20k pilot district farmers in year 1.',
    team: 'Billal (product), 1 backend dev, 1 field agronomist advisor.',
    testsDone: '20-farmer pilot over 3 weeks; 14 of 20 reported better price awareness; 6 negotiated higher.',
    tags: ['agritech', 'sms', 'rural'], badges: ['IdeaValidation'], successRequest: 'none',
    gate: 3, gateStatus: 'Prototyping', mentorId: 'u_mehta', mentorFeedback: '',
    actionableSteps: [
      'Ship MVP to 5 pilot farmers and capture daily usage',
      'Post weekly progress logs in the Build Lab',
      'Book a seed-fund slot with the incubator before June 12',
    ],
    createdAt: iso('2026-06-01T17:10:00'), up: 142, down: 6, myVote: 1,
    status: 'published',
  },
  {
    id: 'p_campuseats', authorId: 'me', startup: 'CampusEats',
    title: 'CampusEats — group food orders from hostel blocks',
    problem: 'Min-order fees make late-night ordering expensive for single students.',
    solution: 'Pool orders by block to clear minimums and split delivery. Idea stage.',
    tags: ['foodtech', 'campus'], badges: [], successRequest: 'none',
    gate: 1, gateStatus: 'New', mentorId: null, mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-30T12:00:00'), up: 21, down: 2, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_mediqueue', authorId: 'me', startup: 'MediQueue',
    title: 'MediQueue — token-free OPD queueing for campus clinic',
    problem: 'Students waste class time waiting at the health centre with no queue visibility.',
    solution: 'Live queue + ETA; book a slot from your phone. Validated with clinic staff.',
    tags: ['healthtech', 'campus'], badges: [], successRequest: 'none',
    gate: 5, gateStatus: 'Notified', mentorId: 'u_rao',
    mentorFeedback: 'Strong validation. Prep incubation paperwork.',
    actionableSteps: ['Confirm incubation meeting slot', 'Prepare 1-pager for the incubation committee'],
    createdAt: iso('2026-05-20T09:00:00'), up: 96, down: 3, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_edulink', authorId: 'me', startup: 'EduLink',
    title: 'EduLink — peer tutoring marketplace, now incubated 🎉',
    problem: 'Students need affordable, on-demand help from seniors who already aced the course.',
    solution: 'Verified senior tutors, pay-per-session, ratings. Passed Gate 6 — in incubation.',
    tags: ['edtech', 'marketplace'], badges: ['Success'], successRequest: 'approved',
    gate: 6, gateStatus: 'Incubating', mentorId: 'u_mehta',
    mentorFeedback: 'Great traction. Focus on retention next quarter.',
    actionableSteps: ['Hit 200 weekly sessions', 'Onboard 3 new departments'],
    createdAt: iso('2026-04-15T10:00:00'), up: 318, down: 9, myVote: 1,
    status: 'published',
  },
  {
    id: 'p_quickride', authorId: 'me', startup: 'QuickRide',
    title: 'QuickRide — campus ride-share (why it died)',
    problem: 'Tried to build peer ride-sharing between campus and city.',
    solution: 'Honest post-mortem: no willingness to pay, supply never showed up off-peak.',
    tags: ['mobility', 'postmortem'], badges: ['IdeaAutopsy'], successRequest: 'none',
    gate: null, gateStatus: 'New', mentorId: null, mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-10T15:30:00'), up: 174, down: 1, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_farmsense', authorId: 'u_aarav', startup: 'FarmSense',
    title: 'FarmSense — cheap soil-moisture sensors for drip irrigation',
    problem: 'Farmers over-water because they guess soil moisture.',
    solution: 'Sub-₹500 sensor + buzzer telling when to irrigate. Looking for a dev co-founder.',
    targetUsers: 'Smallholder farmers using drip irrigation in semi-arid districts.',
    tags: ['agritech', 'iot', 'hardware'], badges: [], successRequest: 'none',
    gate: 2, gateStatus: 'In Review', mentorId: 'me', mentorFeedback: '', actionableSteps: [],
    mentorCriteria: { clarity: true, feasibility: true, fit: true },
    createdAt: iso('2026-06-01T19:45:00'), up: 88, down: 4, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_studybuddy', authorId: 'u_priya', startup: 'StudyBuddy',
    title: 'StudyBuddy — spaced-repetition for ICFAI course packs',
    problem: 'Students cram and forget; no structured revision for our specific syllabi.',
    solution: 'Auto-generate flashcards from course PDFs with spaced-repetition scheduling.',
    tags: ['edtech', 'ai'], badges: [], successRequest: 'none',
    gate: 2, gateStatus: 'In Review', mentorId: 'me', mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-31T14:20:00'), up: 53, down: 2, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_paypeer', authorId: 'u_karan', startup: 'PayPeer',
    title: 'PayPeer — split & settle group expenses with UPI deep-links',
    problem: 'Settling trip/mess expenses across friends is messy and forgotten.',
    solution: 'Track shared expenses, one-tap UPI settle. 400 students on waitlist — requesting #Success.',
    tags: ['fintech', 'upi'], badges: [], successRequest: 'pending',
    gate: 4, gateStatus: 'Validated', mentorId: 'u_rao', mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-28T11:00:00'), up: 210, down: 8, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_healthtrack', authorId: 'u_keerthi', startup: 'HealthTrack',
    title: 'HealthTrack — anonymous campus wellbeing pulse',
    problem: 'No early signal on student stress before exams.',
    solution: 'Weekly anonymous check-ins → aggregate dashboard for the wellbeing cell.',
    tags: ['healthtech', 'data'], badges: ['IdeaValidation'], successRequest: 'none',
    gate: 3, gateStatus: 'Prototyping', mentorId: 'u_mehta', mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-29T16:40:00'), up: 67, down: 5, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_wastemap', authorId: 'u_rohan', startup: 'WasteMap',
    title: 'WasteMap — gamified segregation tracking for hostels',
    problem: 'Hostel waste segregation compliance is near zero.',
    solution: 'Block-level leaderboard + rewards for correct segregation. Requesting #Success.',
    tags: ['sustainability', 'campus'], badges: [], successRequest: 'pending',
    gate: 1, gateStatus: 'New', mentorId: null, mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-27T13:15:00'), up: 34, down: 3, myVote: 0,
    status: 'published',
  },
  {
    id: 'p_lingualoop', authorId: 'u_ananya', startup: 'LinguaLoop',
    title: 'LinguaLoop — conversational Telugu practice with AI',
    problem: 'Non-native students struggle with local-language daily conversation.',
    solution: 'Roleplay chat that corrects gently. Incubated and growing.',
    tags: ['edtech', 'ai', 'language'], badges: ['Success'], successRequest: 'approved',
    gate: 6, gateStatus: 'Incubating', mentorId: 'u_rao', mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-18T10:30:00'), up: 121, down: 4, myVote: 0,
    status: 'published',
  },
  // Drafts (private to me) — power the profile "Drafts" count + Create Post resume.
  {
    id: 'd_fintech', authorId: 'me', startup: '',
    title: 'Untitled fintech idea',
    problem: 'Students have no credit history for small instant loans.',
    solution: '', tags: ['fintech'], badges: [], successRequest: 'none',
    gate: null, gateStatus: 'New', mentorId: null, mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-06-01T22:00:00'), up: 0, down: 0, myVote: 0,
    status: 'draft',
  },
  {
    id: 'd_greencharge', authorId: 'me', startup: 'GreenCharge',
    title: 'GreenCharge — shared e-scooter charging lockers',
    problem: 'E-scooter users on campus lack secure charging.',
    solution: '', tags: ['mobility', 'sustainability'], badges: [], successRequest: 'none',
    gate: null, gateStatus: 'New', mentorId: null, mentorFeedback: '', actionableSteps: [],
    createdAt: iso('2026-05-26T18:00:00'), up: 0, down: 0, myVote: 0,
    status: 'draft',
  },
]

// audience: 'all' (admin push to every student) | 'self' (creator only)
export const EVENTS = [
  { id: 'e_pitch', title: 'Pitch Workshop', type: 'Workshop', start: iso('2026-06-05T14:00:00'), end: iso('2026-06-05T16:00:00'), description: 'How to structure a 3-minute pitch.', creatorId: 'u_neha', audience: 'all', allDay: false },
  { id: 'e_mentor', title: 'Mentor 1:1 — AgriPrice', type: 'Mentorship', start: iso('2026-06-08T11:00:00'), end: iso('2026-06-08T11:30:00'), description: 'Progress review with Dr. Mehta.', creatorId: 'u_mehta', audience: 'self', allDay: false },
  { id: 'e_grant', title: 'Grant Deadline', type: 'Deadline', start: iso('2026-06-12T00:00:00'), end: iso('2026-06-12T23:59:00'), description: 'Seed-fund applications close.', creatorId: 'u_neha', audience: 'all', allDay: true },
  { id: 'e_hack', title: 'IFN Hackathon', type: 'Hackathon', start: iso('2026-06-14T09:00:00'), end: iso('2026-06-15T18:00:00'), description: '36-hour build sprint.', creatorId: 'u_neha', audience: 'all', allDay: false },
  { id: 'e_guest', title: 'Guest Lecture: Fundraising', type: 'Other', start: iso('2026-06-18T17:00:00'), end: iso('2026-06-18T18:00:00'), description: 'Alumni VC AMA.', creatorId: 'u_rao', audience: 'all', allDay: false },
  { id: 'e_demoday', title: 'Demo Day Q2', type: 'Workshop', start: iso('2026-06-20T10:00:00'), end: iso('2026-06-20T13:00:00'), description: 'Quarterly showcase.', creatorId: 'u_neha', audience: 'all', allDay: false },
]

export const TEAM_POSTS = [
  { id: 't_farmsense', authorId: 'u_aarav', title: 'Full-Stack Developer (co-founder)', startup: 'FarmSense', description: 'Hardware works; need someone to own the app + dashboard.', lookingFor: 'Technical co-founder', skills: ['React', 'Node', 'Postgres'], commitment: 'Part-time → full-time', stage: 'Prototype', createdAt: iso('2026-06-01T20:00:00') },
  { id: 't_studybuddy', authorId: 'u_priya', title: 'Brand & Product Designer', startup: 'StudyBuddy', description: 'Need a designer to shape the flashcard UX and brand.', lookingFor: 'Designer', skills: ['Figma', 'Illustration', 'Branding'], commitment: '8–10 hrs/week', stage: 'Idea', createdAt: iso('2026-05-31T15:00:00') },
  { id: 't_paypeer', authorId: 'u_karan', title: 'Growth Marketer', startup: 'PayPeer', description: 'Waitlist is hot — need someone to convert it.', lookingFor: 'Marketer', skills: ['SEO', 'Content', 'Analytics'], commitment: 'Part-time', stage: 'Revenue', createdAt: iso('2026-05-28T12:00:00') },
  { id: 't_healthtrack', authorId: 'u_keerthi', title: 'ML Engineer', startup: 'HealthTrack', description: 'Build the anomaly detection on weekly pulse data.', lookingFor: 'ML engineer', skills: ['Python', 'PyTorch', 'MLOps'], commitment: 'Part-time', stage: 'Prototype', createdAt: iso('2026-05-29T17:00:00') },
  { id: 't_campuseats', authorId: 'me', title: 'iOS Developer', startup: 'CampusEats', description: 'Want a native iOS dev to prototype the group-order flow.', lookingFor: 'Mobile developer', skills: ['Swift', 'SwiftUI'], commitment: 'Flexible', stage: 'Idea', createdAt: iso('2026-05-30T13:00:00') },
]

// Comments keyed by post id. Comment: { id, authorId, body, createdAt }
export const COMMENTS = {
  p_announce: [
    { id: 'c1', authorId: 'u_aarav', body: 'Locked my slot. See everyone there!', createdAt: iso('2026-06-02T09:10:00') },
    { id: 'c2', authorId: 'u_priya', body: 'Is the grant deadline strict or is there a buffer?', createdAt: iso('2026-06-02T09:40:00') },
  ],
  p_agriprice: [
    { id: 'c3', authorId: 'u_mehta', body: 'Great progress. Capture per-farmer retention, not just signups.', createdAt: iso('2026-06-01T18:05:00') },
    { id: 'c4', authorId: 'u_keerthi', body: 'How are you handling regional language SMS?', createdAt: iso('2026-06-01T20:15:00') },
    { id: 'c5', authorId: 'u_rohan', body: 'Would love to see the pilot numbers when you have them.', createdAt: iso('2026-06-02T07:30:00') },
  ],
  p_farmsense: [
    { id: 'c6', authorId: 'u_karan', body: 'Sub-₹500 is wild. BOM breakdown somewhere?', createdAt: iso('2026-06-01T21:00:00') },
  ],
  p_paypeer: [
    { id: 'c7', authorId: 'u_ananya', body: '400 on the waitlist already? Strong signal.', createdAt: iso('2026-05-28T12:30:00') },
  ],
}

export const NOTIF_DEFAULTS = {
  emailEvents: true,
  emailGate: true,
  inappVotes: false,
  inappMentions: true,
}

export function buildSeed() {
  return {
    version: SCHEMA_VERSION,
    members: MEMBERS.map((m) => ({ ...m })),
    posts: POSTS.map((p) => ({
      ...p,
      tags: [...p.tags],
      badges: [...p.badges],
      actionableSteps: [...p.actionableSteps],
      comments: (COMMENTS[p.id] || []).map((c) => ({ ...c })),
    })),
    events: EVENTS.map((e) => ({ ...e })),
    teamPosts: TEAM_POSTS.map((t) => ({ ...t, skills: [...t.skills] })),
    removedEventIds: [],
    notifications: { ...NOTIF_DEFAULTS },
    theme: 'light',
  }
}
