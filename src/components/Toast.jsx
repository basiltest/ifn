import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Icon } from './Icons.jsx'

const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const push = useCallback((message, type = 'success') => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex animate-toast-in items-center gap-2 rounded-full bg-[#15181E] px-4 py-2.5 text-sm font-semibold text-white shadow-pop ring-1 ring-white/10"
          >
            <Icon
              name={t.type === 'error' ? 'x' : 'check'}
              size={16}
              className={t.type === 'error' ? 'text-down' : 'text-success'}
            />
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
