# IFN — ICFAI Founders Network · Refined PRD (Frontend MVP)

> Tech incubator network for ICFAI University students to share startup ideas and
> connect with funding, alumni, and mentors. **Frontend only — no backend.**
> Every decision below was made by the product owner; this doc is the build contract.

---

## 0. Decision Log (locked)

| Area | Decision |
|------|----------|
| Framework | Vite + React (JS), React Router |
| Styling | Tailwind CSS v3 + custom theme tokens |
| Persistence | `localStorage` — seeded mock data on first load, all changes persist; Reset Data button re-seeds |
| Font | **Inter** (Google Fonts) |
| Theme | Light only. Soft cool gray: page `#F2F4F6`, cards `#FFFFFF`, border `#E1E8ED`, text `#0F1419`, accent `#1D9BF0` |
| Calendar | `react-big-calendar` (month/week/day) |
| Auth | Email only, must end `@ifheindia.org`, no password |
| Roles | Student / Mentor / Admin — **live header role switcher** (flip without re-login) |
| Comments | **None** anywhere |
| Search | Live in-place filter; `#` shows supertag suggestions; active filter chip |
| Team apply | Popup w/ optional message → **fake confirmation toast** (no real mail) |
| Settings | Account info · Notifications · Danger zone (no theme section) |
| Profile tabs | **Basic Info only** |

---

## 1. Roles & Permissions

| Capability | Student | Mentor | Admin |
|---|---|---|---|
| Create post / draft, vote, share | ✓ | ✓ | ✓ |
| Add `#IdeaAutopsy`, `#IdeaValidation` to own post (self-apply) | ✓ | ✓ | ✓ |
| Request `#Success` badge (→ pending) | ✓ | ✓ | ✓ |
| Approve/reject `#Success` requests | | | ✓ |
| Pin / unpin posts | | | ✓ |
| Create calendar event | | ✓ | ✓ |
| Add event to **all students'** calendars | | | ✓ |
| Remove an event from **own** calendar | ✓ | ✓ | ✓ |
| **Mentor Review** section (assigned ideas) | | ✓ | ✓ |
| **Tag Requests** admin queue | | | ✓ |

- Login: any name + email ending `@ifheindia.org`. Reject other domains.
- Role switcher in header re-renders gated UI instantly.

---

## 2. Supertags

- **Normal `#tags`** — free text by any author, used for discovery/trending.
- **Hardcoded badges:**
  - `#IdeaAutopsy` — author self-applies. A post with this badge is **excluded from the Idea Pipeline**.
  - `#IdeaValidation` — author self-applies.
  - `#Success` — author **requests** → post shows **Pending** → **admin approves/rejects** in Tag Requests queue.

---

## 3. Pages

### 3.1 Login (landing)
- IFN logo (the letters **IFN** in a rounded box).
- Name + email field; validate email ends `@ifheindia.org` else inline error.
- On success → authenticated → redirect to Feed. Session persists in localStorage.

### 3.2 Feed
- **Header (global):** left = IFN box logo; right = role switcher · settings gear · profile avatar.
- **Left nav:** Feed, Idea Pipeline, Team Board, Calendar, Mentor Review (mentor/admin), Tag Requests (admin), Profile, Settings, + **Create Post** button.
- **Center:** post cards (Reddit/Twitter style). Pinned posts (admin) always on top, visually distinct.
  - Card: author + role badge + timestamp, Title, Startup name, Problem/Solution body, supertags + hardcoded badges under heading, upvote/downvote with score, share (copy-link/mock). **No comments.**
  - Admin card menu: Pin/Unpin.
  - Author card menu: add `#IdeaAutopsy` / `#IdeaValidation`, request `#Success`.
- **Sort:** by Time (newest) / by Upvotes.
- **Search:** live filter by post title and supertag; typing `#` shows supertag suggestions; active filter shown as removable chip.
- **Right sidebar:** Trending Topics (supertag → post count, desc) · Upcoming Events (pulled from calendar).

### 3.3 Create Post (modal)
- Fields: Startup Name, Title, Problem Statement, Solution, normal `#supertags` (add/remove, max 10, no dup).
- Optional hardcoded: self-apply Autopsy/Validation, or request Success.
- Buttons: Submit (publish to feed; auto-enters Idea Pipeline at G1 unless Autopsy) · Save as Draft (private, counts on profile) · Cancel.
- Submit disabled until required fields filled; >5000 char warning.

### 3.4 Calendar
- `react-big-calendar`, month default (week/day available), events color-coded by type (Workshop/Mentorship/Deadline/Hackathon/Other).
- Add Event (mentor/admin): title, date, start/end, type, description.
- Admin: "Add to all students" toggle → event appears on every student calendar.
- Any user: remove an event from **their own** calendar (local removal, doesn't delete globally).
- Click event → details modal.

### 3.5 Idea Pipeline
- Lists **your posts** as cards, each with a 6-gate bar. Auto-entered at **G1** on publish. **`#IdeaAutopsy` posts excluded.**
- Gates: **G1 Submitted · G2 Mentor Review · G3 Prototyping · G4 Validation · G5 Notified · G6 Incubation** (current gate highlighted; matches mockup).
- Click a card → gate bar on top, then post + description, then **Actionable Steps** (written/edited by mentor/admin, saved to localStorage; student sees read-only).

### 3.6 Mentor Review (mentor/admin)
- Queue of ideas assigned to this mentor (those at G2).
- Per idea: read details, write **feedback**, **Approve → G3** or **Request Revision** (sets status back, shows feedback to author).

### 3.7 Tag Requests (admin)
- Queue of pending `#Success` requests. Per request: view post, **Approve** (badge applied) / **Reject** (request cleared, author notified inline).

### 3.8 Team Board
- Search bar.
- Role-need cards: Title, Description, **Looking for**, **Skills required**.
- Any logged-in user can post a role need.
- **Apply** → popup with optional message → **Send** → toast "Application sent ✓". No mail sent.

### 3.9 Profile
- Left card: avatar, name, role badge, **Connect LinkedIn** button, counts (Posts / Drafts / Upvotes).
- Right: **Basic Info** tab only — Full name, Email (locked), Phone, Location, About me. Edit mode → Save/Cancel, validation, success toast.

### 3.10 Settings
- **Account info:** name, email (locked), role badge, change avatar.
- **Notifications:** UI-only toggles (email/in-app) saved to localStorage.
- **Danger zone:** Reset demo data (clear + re-seed) · Logout.

---

## 4. Defaults (chosen by builder; flag if you want changed)
- Routing via `react-router-dom`; protected routes redirect to Login when unauthenticated.
- Seed volume: ~12 posts (incl. 1–2 pinned, mix of badges), ~6 calendar events, ~5 team-board posts, pipeline statuses spread across gates, 2 pending `#Success` requests, 2 mentor-review items.
- Trending = top supertags by post count.
- Avatars = generated initials / DiceBear-style placeholder.
