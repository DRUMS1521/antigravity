import { formatHora } from '../utils/timeFormat'

const ESTADO_CONFIG = {
  pendiente:       { label: 'Pendiente',    cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  programado:      { label: 'Programado',   cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  'por corregir':  { label: 'Por Corregir', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  eliminado:       { label: 'Eliminado',    cls: 'bg-red-100 text-red-700 border-red-200' },
}

function Row({ label, value, full }) {
  if (!value) return null
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium break-words">{value}</p>
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="flex-1 border-t border-gray-100" />
        {title}
        {action && <span className="shrink-0">{action}</span>}
        <span className="flex-1 border-t border-gray-100" />
      </h4>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  )
}

function Avatar({ name, username, subtitle }) {
  const initial = name?.charAt(0) || username?.charAt(0)?.toUpperCase() || '?'
  return (
    <div className="flex items-center gap-3 col-span-2">
      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
        <span className="text-primary-700 font-bold text-base">{initial}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{name || username}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  )
}

function calcDuration(inicio, fin) {
  if (!inicio || !fin) return null
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fin.split(':').map(Number)
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (mins <= 0) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}min` : `${h}h`) : `${m}min`
}

export default function SolicitudDetailModal({ solicitud: sol, onClose, onCambiarEstado }) {
  const estado = ESTADO_CONFIG[sol.estado] || { label: sol.estado, cls: 'bg-gray-100 text-gray-600 border-gray-200' }

  const formatDate = (dt) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary-700 px-5 py-4 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white font-bold text-base truncate">{sol.empresa}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${estado.cls}`}>
                {estado.label}
              </span>
            </div>
            <p className="text-primary-200 text-xs mt-0.5">Solicitud #{sol.id}</p>
          </div>
          <button onClick={onClose}
            className="text-white/70 hover:text-white shrink-0 p-1 hover:bg-white/10 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          <Section title="Información del Evento">
            <Row label="Fecha del evento" value={sol.fecha_evento} />
            <Row label="Horario" value={sol.hora_inicio && sol.hora_fin
              ? `${formatHora(sol.hora_inicio)} – ${formatHora(sol.hora_fin)}${calcDuration(sol.hora_inicio, sol.hora_fin) ? ` (${calcDuration(sol.hora_inicio, sol.hora_fin)})` : ''}`
              : formatHora(sol.hora_inicio) || '—'} />
            <Row label="Ciudad" value={sol.ciudad} />
            <Row label="Dirección" value={sol.direccion} full />
          </Section>

          <Section title="Detalles del Servicio">
            <Row label="Tipo de servicio" value={sol.tipo_servicio} />
            <Row label="Tipo de público" value={sol.tipo_publico} />
            <Row label="Recreadores solicitados" value={`${sol.cantidad_recreadores}`} />
            <Row label="Cantidad de personas" value={`${sol.cantidad_personas}`} />
            {sol.observaciones && <Row label="Observaciones" value={sol.observaciones} full />}
          </Section>

          <Section title="Contacto">
            <Row label="Persona de contacto" value={sol.contacto} />
            <Row label="Teléfono / Email" value={sol.telefono_email} />
            {sol.telefono_email_2 && <Row label="Contacto adicional" value={sol.telefono_email_2} />}
          </Section>

          {/* Recreadores asignados */}
          {sol.recreadores_asignados?.length > 0 && (
            <Section
              title={sol.recreadores_asignados.length === 1 ? 'Recreador Asignado' : `Recreadores Asignados (${sol.recreadores_asignados.length})`}
              action={onCambiarEstado && sol.estado === 'programado' && (
                <button
                  onClick={() => { onClose(); onCambiarEstado(sol) }}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-2 py-0.5 rounded-full transition"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                  </svg>
                  Editar
                </button>
              )}
            >
              {sol.recreadores_asignados.map((r) => (
                <Avatar
                  key={r.id}
                  name={r.full_name}
                  username={r.username}
                  subtitle={`@${r.username}`}
                />
              ))}
            </Section>
          )}

          <Section title="Creado por">
            <Avatar
              name={sol.user_full_name}
              username={sol.user_username}
              subtitle={sol.user_empresa || `@${sol.user_username}`}
            />
            {sol.user_email && <Row label="Email" value={sol.user_email} full />}
            <Row label="Fecha y hora de solicitud" value={formatDate(sol.created_at)} full />
          </Section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            Cerrar
          </button>
          {onCambiarEstado && (
            <button onClick={() => { onClose(); onCambiarEstado(sol) }}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-bold transition">
              Cambiar Estado
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
