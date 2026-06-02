import { useEffect } from 'react'
import { Icon } from './Icons.jsx'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/50 p-4 animate-fade-in sm:p-8"
      onMouseDown={onClose}
    >
      <div
        className={`card my-auto w-full ${maxWidth} animate-pop-in p-0`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-ink"
            aria-label="Close"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
