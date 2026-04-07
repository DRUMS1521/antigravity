import toast from 'react-hot-toast'

const EMOJIS_SUCCESS = ['🎉', '✅', '🚀', '⚡', '🙌', '💪', '🎯', '✨']
const EMOJIS_ERROR   = ['😬', '⚠️', '🚨', '❌', '😅', '🔴']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function ToastSuccess({ t, message }) {
  return (
    <div
      style={{ animation: t.visible ? 'toastIn .35s cubic-bezier(.22,1,.36,1)' : 'toastOut .25s ease forwards' }}
      className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3.5 rounded-2xl shadow-2xl min-w-[260px] max-w-sm"
    >
      <span className="text-2xl shrink-0 select-none">{pick(EMOJIS_SUCCESS)}</span>
      <p className="font-semibold text-sm flex-1 leading-snug">{message}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-white/60 hover:text-white transition text-base ml-1 shrink-0"
      >✕</button>
    </div>
  )
}

function ToastError({ t, message }) {
  return (
    <div
      style={{ animation: t.visible ? 'toastIn .35s cubic-bezier(.22,1,.36,1)' : 'toastOut .25s ease forwards' }}
      className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3.5 rounded-2xl shadow-2xl min-w-[260px] max-w-sm"
    >
      <span className="text-2xl shrink-0 select-none">{pick(EMOJIS_ERROR)}</span>
      <p className="font-semibold text-sm flex-1 leading-snug">{message}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-white/60 hover:text-white transition text-base ml-1 shrink-0"
      >✕</button>
    </div>
  )
}

export const notify = {
  success(message) {
    toast.custom(t => <ToastSuccess t={t} message={message} />, {
      position: 'bottom-right',
      duration: 3500,
    })
  },
  error(message) {
    toast.custom(t => <ToastError t={t} message={message} />, {
      position: 'bottom-right',
      duration: 4500,
    })
  },
}
