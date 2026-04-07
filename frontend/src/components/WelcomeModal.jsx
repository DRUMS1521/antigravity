import { useMemo } from 'react'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function toYMD(d) { return d.toISOString().split('T')[0] }

/* ── Tarjeta de ítem pendiente ── */
function Item({ icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${color}`}>
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-medium opacity-75 leading-none">{label}</p>
        <p className="text-xl font-black leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function WelcomeModal({ user, solicitudes, onClose }) {
  const isAdmin    = user?.is_admin
  const isRecreador = user?.is_recreador
  const isPromotor  = user?.is_promotor

  const data = useMemo(() => {
    const ahora    = new Date()
    const hoy      = toYMD(ahora)
    const ahoraHHMM = `${String(ahora.getHours()).padStart(2,'0')}:${String(ahora.getMinutes()).padStart(2,'0')}`

    if (isAdmin) {
      const pendientes  = solicitudes.filter(s => s.estado === 'pendiente').length
      const porCorregir = solicitudes.filter(s => s.estado === 'por corregir').length
      return { pendientes, porCorregir }
    }

    if (isRecreador) {
      const porFinalizar = solicitudes.filter(s => {
        if (s.estado !== 'programado') return false
        const fin = new Date(`${s.fecha_evento}T${s.hora_fin}:00`)
        return ahora > fin
      })
      const hoyPendientes = solicitudes.filter(s =>
        s.estado === 'programado' &&
        s.fecha_evento === hoy &&
        s.hora_inicio >= ahoraHHMM
      )
      return { porFinalizar, hoyPendientes }
    }

    if (isPromotor) {
      const porCorregir = solicitudes.filter(s => s.estado === 'por corregir')
      return { porCorregir }
    }

    return {}
  }, [solicitudes, isAdmin, isRecreador, isPromotor])

  /* ── Contenido según rol ── */
  const renderContent = () => {
    if (isAdmin) {
      const hayAlgo = data.pendientes > 0 || data.porCorregir > 0
      return (
        <>
          {hayAlgo ? (
            <div className="space-y-2">
              {data.pendientes > 0 && (
                <Item icon="📋" label="Solicitudes pendientes de revisar" value={data.pendientes} color="bg-yellow-50 text-yellow-800" />
              )}
              {data.porCorregir > 0 && (
                <Item icon="🔄" label="Solicitudes devueltas para corregir" value={data.porCorregir} color="bg-orange-50 text-orange-800" />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-emerald-600">
              <span className="text-5xl mb-2">🎉</span>
              <p className="font-bold text-base">¡Todo al día!</p>
              <p className="text-sm text-gray-400 mt-1">No hay solicitudes pendientes en este momento.</p>
            </div>
          )}
        </>
      )
    }

    if (isRecreador) {
      const hayAlgo = data.porFinalizar?.length > 0 || data.hoyPendientes?.length > 0
      return (
        <>
          {hayAlgo ? (
            <div className="space-y-2">
              {data.porFinalizar?.length > 0 && (
                <Item icon="✅" label="Actividades listas para finalizar" value={data.porFinalizar.length} color="bg-emerald-50 text-emerald-800" />
              )}
              {data.hoyPendientes?.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📅</span>
                    <p className="text-xs font-semibold text-blue-700">Actividades de hoy por venir</p>
                  </div>
                  <div className="space-y-1 pl-1">
                    {data.hoyPendientes.slice(0, 3).map(s => (
                      <p key={s.id} className="text-xs text-blue-800 font-medium">
                        · {s.empresa} — {s.hora_inicio}
                      </p>
                    ))}
                    {data.hoyPendientes.length > 3 && (
                      <p className="text-xs text-blue-500">+{data.hoyPendientes.length - 3} más...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-emerald-600">
              <span className="text-5xl mb-2">😎</span>
              <p className="font-bold text-base">¡Sin pendientes hoy!</p>
              <p className="text-sm text-gray-400 mt-1">No tienes actividades urgentes por ahora.</p>
            </div>
          )}
        </>
      )
    }

    if (isPromotor) {
      return (
        <>
          {data.porCorregir?.length > 0 ? (
            <div className="space-y-2">
              <Item icon="⚠️" label="Solicitudes devueltas para corregir" value={data.porCorregir.length} color="bg-orange-50 text-orange-800" />
              <div className="bg-orange-50 rounded-xl px-3 py-2 space-y-1">
                {data.porCorregir.slice(0, 3).map(s => (
                  <p key={s.id} className="text-xs text-orange-700 font-medium">
                    · {s.empresa} — {s.fecha_evento}
                  </p>
                ))}
                {data.porCorregir.length > 3 && (
                  <p className="text-xs text-orange-400">+{data.porCorregir.length - 3} más...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-emerald-600">
              <span className="text-5xl mb-2">👌</span>
              <p className="font-bold text-base">¡Todo en orden!</p>
              <p className="text-sm text-gray-400 mt-1">No tienes solicitudes devueltas por corregir.</p>
            </div>
          )}
        </>
      )
    }

    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        style={{ animation: 'welcomeIn .4s cubic-bezier(.22,1,.36,1)' }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 pt-6 pb-8 text-white relative overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-black shadow-inner">
              {getInitials(user?.full_name || user?.username)}
            </div>
            <div>
              <p className="text-primary-200 text-sm font-medium">{greeting()},</p>
              <p className="text-white font-black text-lg leading-tight">
                {user?.full_name?.split(' ')[0] || user?.username}
              </p>
              <p className="text-primary-300 text-xs mt-0.5">
                {isAdmin ? 'Administrador' : isRecreador ? 'Recreador' : isPromotor ? 'Promotor' : 'Usuario'}
              </p>
            </div>
          </div>

          <p className="relative mt-4 text-sm text-primary-100 font-medium">
            Aquí tienes un resumen de lo que te espera hoy 👇
          </p>
        </div>

        {/* Contenido */}
        <div className="px-5 py-4">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-primary-200 text-sm"
          >
            ¡Vamos! 🚀
          </button>
        </div>
      </div>
    </div>
  )
}
