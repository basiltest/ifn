# IFN — ICFAI Founders Network (Frontend MVP)

Tech-incubator network for ICFAI students to share startup ideas and connect with
mentors, alumni and funding. **Frontend only** — all data is mock and lives in
`localStorage`. See [`PRD.md`](./PRD.md) for the full, decision-locked spec.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Login

Any name + an email ending **`@ifheindia.org`** (no password). You start as a
**Student**; flip to **Mentor** / **Admin** live from the header role switcher to
reveal gated features.

## What to try

| Role | Try |
|------|-----|
| Student | Create a post (auto-enters the pipeline at G1), self-apply `#IdeaValidation` / `#IdeaAutopsy`, request `#Success`, vote, search `#agritech`, apply on Team Board, edit profile |
| Mentor | **Mentor Review** — give feedback, Approve → G3 or Request Revision on FarmSense / StudyBuddy; add calendar events |
| Admin | **Tag Requests** — approve/reject `#Success` (PayPeer, WasteMap); pin posts; add an event to *all* students |

- **Idea Pipeline** — your ideas across the 6 gates; mentors/admins write the actionable steps.
- **Calendar** — `react-big-calendar`; remove any event from *your* calendar.
- **Settings → Danger zone** — Reset demo data re-seeds everything.

## Stack

Vite · React · React Router · Tailwind CSS v3 · react-big-calendar · localStorage.
Theme: light only, soft cool gray (`#F2F4F6`), Twitter-blue accent (`#1D9BF0`), Inter font.

## Structure

```
src/
  data/seed.js        mock members, posts, events, team posts
  store/store.jsx     context + localStorage + all actions
  lib/tags.js         supertag / gate / event constants + helpers
  components/         Layout, Header, LeftNav, RightSidebar, PostCard, GateBar, Modal, Toast…
  pages/              Login, Feed, IdeaPipeline, TeamBoard, CalendarPage,
                      MentorReview, AdminTagRequests, ProfilePage, Settings
```
