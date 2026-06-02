import { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Modal from '../components/Modal.jsx'
import { Icon } from '../components/Icons.jsx'
import { PageTitle } from './IdeaPipeline.jsx'
import { visibleEvents } from '../components/RightSidebar.jsx'
import { EVENT_TYPES } from '../lib/tags.js'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
})
const DEMO_TODAY = new Date(2026, 5, 2)

export default function CalendarPage() {
  const { data, currentUser, addEvent, removeEventForMe } = useStore()
  const toast = useToast()
  const [details, setDetails] = useState(null)
  const [adding, setAdding] = useState(false)

  const canCreate = ['mentor', 'admin'].includes(currentUser.role)

  const events = useMemo(
    () =>
      visibleEvents(data).map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: e.allDay,
        resource: e,
      })),
    [data]
  )

  return (
    <div className="space-y-4">
      <PageTitle
        icon="calendar"
        title="Calendar"
        subtitle="Workshops, mentorship, hackathons & deadlines."
        action={
          canCreate ? (
            <button className="btn-primary" onClick={() => setAdding(true)}>
              <Icon name="plus" size={16} /> Add Event
            </button>
          ) : null
        }
      />

      <div className="card p-4">
        <div className="mb-3 flex flex-wrap gap-3">
          {Object.entries(EVENT_TYPES).map(([type, color]) => (
            <span key={type} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              {type}
            </span>
          ))}
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          defaultDate={DEMO_TODAY}
          defaultView="month"
          views={['month', 'week', 'day']}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 640 }}
          popup
          onSelectEvent={(ev) => setDetails(ev.resource)}
          eventPropGetter={(ev) => ({
            style: { backgroundColor: EVENT_TYPES[ev.resource.type] || EVENT_TYPES.Other, color: '#fff' },
          })}
        />
      </div>

      {details && (
        <EventDetails
          ev={details}
          onClose={() => setDetails(null)}
          onRemove={() => {
            removeEventForMe(details.id)
            setDetails(null)
            toast('Removed from your calendar')
          }}
        />
      )}
      {adding && (
        <AddEventModal
          isAdmin={currentUser.role === 'admin'}
          onClose={() => setAdding(false)}
          onSave={(fields, opts) => {
            addEvent(fields, opts)
            setAdding(false)
            toast(opts.toAllStudents ? 'Event added to all students' : 'Event created')
          }}
        />
      )}
    </div>
  )
}

function EventDetails({ ev, onClose, onRemove }) {
  return (
    <Modal open onClose={onClose} title={ev.title}>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: EVENT_TYPES[ev.type] }} />
          <span className="font-semibold">{ev.type}</span>
          {ev.audience === 'all' && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">All students</span>
          )}
        </div>
        <p className="text-muted">
          {new Date(ev.start).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: ev.allDay ? undefined : 'short' })}
          {' → '}
          {new Date(ev.end).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: ev.allDay ? undefined : 'short' })}
        </p>
        {ev.description && <p className="pt-1">{ev.description}</p>}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>Close</button>
        <button className="btn-outline text-down" onClick={onRemove}>
          <Icon name="trash" size={15} /> Remove from my calendar
        </button>
      </div>
    </Modal>
  )
}

function AddEventModal({ isAdmin, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Workshop')
  const [date, setDate] = useState('2026-06-10')
  const [startT, setStartT] = useState('14:00')
  const [endT, setEndT] = useState('15:00')
  const [allDay, setAllDay] = useState(false)
  const [description, setDescription] = useState('')
  const [toAll, setToAll] = useState(false)
  const [err, setErr] = useState('')

  const save = () => {
    if (!title.trim()) return setErr('Title is required')
    const start = new Date(`${date}T${allDay ? '00:00' : startT}`)
    const end = new Date(`${date}T${allDay ? '23:59' : endT}`)
    if (!allDay && end <= start) return setErr('End time must be after start time')
    onSave(
      { title: title.trim(), type, start: start.toISOString(), end: end.toISOString(), description: description.trim(), allDay },
      { toAllStudents: isAdmin && toAll }
    )
  }

  return (
    <Modal open onClose={onClose} title="Add event">
      <div className="space-y-3">
        <L label="Title *"><input className="input" value={title} onChange={(e) => { setTitle(e.target.value); setErr('') }} placeholder="e.g. Pitch Workshop" /></L>
        <div className="grid grid-cols-2 gap-3">
          <L label="Type">
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {Object.keys(EVENT_TYPES).map((t) => <option key={t}>{t}</option>)}
            </select>
          </L>
          <L label="Date"><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></L>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} /> All-day
        </label>
        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            <L label="Start"><input type="time" className="input" value={startT} onChange={(e) => { setStartT(e.target.value); setErr('') }} /></L>
            <L label="End"><input type="time" className="input" value={endT} onChange={(e) => { setEndT(e.target.value); setErr('') }} /></L>
          </div>
        )}
        <L label="Description"><textarea className="input min-h-[60px] resize-y" value={description} onChange={(e) => setDescription(e.target.value)} /></L>

        {isAdmin && (
          <label className="flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm font-semibold text-accent">
            <input type="checkbox" checked={toAll} onChange={(e) => setToAll(e.target.checked)} />
            Add to every student's calendar
          </label>
        )}
        {err && <p className="text-sm font-semibold text-down">{err}</p>}

        <div className="flex justify-end gap-2 border-t border-line pt-3">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save event</button>
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
