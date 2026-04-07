import { useState } from 'react'
import { formatHora } from '../utils/timeFormat'

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES      = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const MESES_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const LIMITE_HORAS = 42

function getMondayOf(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function toYMD(d) {
  return d.toISOString().split('T')[0]
}

function calcHours(inicio, fin) {
  if (!inicio || !fin) return 0
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fin.split(':').map(Number)
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1)
  return mins > 0 ? Math.max(mins / 60, 1) : 0
}

function fmt(h) {
  return h % 1 === 0 ? String(h) : h.toFixed(1)
}

function EventCard({ sol, today, onClick, onFinalizar }) {
  const dur = calcHours(sol.hora_inicio, sol.hora_fin)
  const companeros = sol.recreadores_asignados?.length > 1 ? sol.recreadores_asignados : []
  const esFinalizada = sol.estado === 'finalizado'
  const puedeFinalizarse = sol.estado === 'programado' && (() => {
    const ahora = new Date()
    const finEvento = new Date(`${sol.fecha_evento}T${sol.hora_fin}:00`)
    return ahora > finEvento
  })()

  return (
    <div className={`w-full text-left rounded-xl px-3 py-2.5 text-[12px] shadow-sm
      ${esFinalizada
        ? 'bg-emerald-600 text-white'
        : 'bg-primary-600 text-white'}`}
    >
      <button onClick={() => onClick(sol)} className="w-full text-left">
        <p className="font-bold truncate leading-tight text-sm">{sol.empresa}</p>
        <p className={`truncate leading-tight mt-0.5 ${esFinalizada ? 'text-emerald-200' : 'text-primary-200'}`}>
          {formatHora(sol.hora_inicio)}–{formatHora(sol.hora_fin)}
          {dur > 0 && <span className={`ml-1 ${esFinalizada ? 'text-emerald-300' : 'text-primary-300'}`}>({fmt(dur)}h)</span>}
        </p>
        <p className={`truncate leading-tight text-[11px] ${esFinalizada ? 'text-emerald-300' : 'text-primary-300'}`}>
          {sol.tipo_servicio}
        </p>
        {companeros.length > 0 && !esFinalizada && (
          <div className="mt-1.5 flex items-center gap-1 bg-primary-700/50 rounded-lg px-2 py-1">
            <svg className="w-3 h-3 text-primary-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-primary-200 text-[10px] truncate">
              Con: {companeros.map((r) => r.full_name?.split(' ')[0] || r.username).join(', ')}
            </p>
          </div>
        )}
      </button>

      {esFinalizada && (
        <div className="mt-1.5 flex items-center gap-1 bg-emerald-700/40 rounded-lg px-2 py-1">
          <svg className="w-3 h-3 text-emerald-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-emerald-200 text-[10px]">Finalizada</p>
        </div>
      )}

      {puedeFinalizarse && (
        <button
          onClick={(e) => { e.stopPropagation(); onFinalizar(sol) }}
          className="mt-1.5 w-full flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400
            rounded-lg px-2 py-1.5 text-[11px] font-bold text-white transition"
        >
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Finalizar
        </button>
      )}
    </div>
  )
}

export default function CalendarRecreadorView({ solicitudes, userId, onVerDetalle, onFinalizar }) {
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()))

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const prevWeek = () => {
    const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d)
  }
  const nextWeek = () => {
    const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d)
  }
  const goToday = () => setWeekStart(getMondayOf(new Date()))

  const weekDayStrings = weekDays.map(toYMD)
  const today = toYMD(new Date())

  // Mostrar programadas y finalizadas de la semana
  const misTareas = solicitudes.filter(
    (s) => (s.estado === 'programado' || s.estado === 'finalizado') && weekDayStrings.includes(s.fecha_evento)
  )

  // Horas de programadas (para el límite semanal)
  const tareasProgramadas = misTareas.filter((s) => s.estado === 'programado')
  const totalHoras = tareasProgramadas.reduce((sum, s) => sum + calcHours(s.hora_inicio, s.hora_fin), 0)
  const pct       = Math.min((totalHoras / LIMITE_HORAS) * 100, 100)
  const barColor  = totalHoras >= LIMITE_HORAS ? 'bg-red-500' : totalHoras >= LIMITE_HORAS * 0.8 ? 'bg-yellow-400' : 'bg-green-500'
  const textColor = totalHoras >= LIMITE_HORAS ? 'text-red-600' : totalHoras >= LIMITE_HORAS * 0.8 ? 'text-yellow-600' : 'text-primary-700'

  // Índice por día
  const byDay = {}
  misTareas.forEach((s) => {
    if (!byDay[s.fecha_evento]) byDay[s.fecha_evento] = []
    byDay[s.fecha_evento].push(s)
  })

  const ini = weekDays[0]
  const fin = weekDays[6]
  const weekLabel = ini.getMonth() === fin.getMonth()
    ? `${ini.getDate()} – ${fin.getDate()} ${MESES_FULL[ini.getMonth()]} ${ini.getFullYear()}`
    : `${ini.getDate()} ${MESES[ini.getMonth()]} – ${fin.getDate()} ${MESES[fin.getMonth()]} ${fin.getFullYear()}`

  const finalizadasSemana = misTareas.filter((s) => s.estado === 'finalizado').length
  const pendientesFinalizacion = solicitudes.filter(
    (s) => s.estado === 'programado' && s.fecha_evento <= today
  ).length

  return (
    <div className="space-y-4">
      {/* Alerta si hay tareas pendientes de finalizar */}
      {pendientesFinalizacion > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-700 font-medium">
            Tienes <strong>{pendientesFinalizacion}</strong> actividad{pendientesFinalizacion !== 1 ? 'es' : ''} pendiente{pendientesFinalizacion !== 1 ? 's' : ''} de finalizar
          </p>
        </div>
      )}

      {/* Navegación + resumen horas */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={prevWeek}
          className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center flex-1">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">{weekLabel}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {tareasProgramadas.length} programada{tareasProgramadas.length !== 1 ? 's' : ''}
            {finalizadasSemana > 0 && (
              <span className="ml-2 text-emerald-600 font-semibold">· {finalizadasSemana} finalizada{finalizadasSemana !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={goToday}
            className="hidden sm:block text-xs text-primary-600 hover:text-primary-700 font-semibold px-2 py-1 rounded-lg hover:bg-primary-50 transition">
            Hoy
          </button>
          <button onClick={nextWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Barra de horas semanales */}
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Horas programadas esta semana</p>
          <p className={`text-sm font-bold ${textColor}`}>
            {fmt(totalHoras)} <span className="text-gray-400 font-normal">/ {LIMITE_HORAS} h</span>
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        {totalHoras >= LIMITE_HORAS && (
          <p className="text-xs text-red-500 font-medium mt-1.5">
            Has completado las {LIMITE_HORAS}h semanales obligatorias
            {totalHoras > LIMITE_HORAS && ` · ${fmt(totalHoras - LIMITE_HORAS)}h extra`}
          </p>
        )}
      </div>

      {/* Grilla de 7 días */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Cabeceras */}
        {weekDays.map((day, idx) => {
          const ymd   = toYMD(day)
          const isHoy = ymd === today
          return (
            <div key={ymd} className="text-center">
              <p className={`text-[10px] font-bold uppercase tracking-wide ${isHoy ? 'text-primary-600' : 'text-gray-400'}`}>
                {DIAS_SEMANA[idx]}
              </p>
              <div className={`text-sm font-bold mt-0.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full
                ${isHoy ? 'bg-primary-600 text-white' : 'text-gray-700'}`}>
                {day.getDate()}
              </div>
            </div>
          )
        })}

        {/* Celdas por día */}
        {weekDays.map((day) => {
          const ymd    = toYMD(day)
          const isHoy  = ymd === today
          const isPast = ymd < today
          const tareas = byDay[ymd] || []
          const hDay   = tareas.filter(s => s.estado === 'programado').reduce((sum, s) => sum + calcHours(s.hora_inicio, s.hora_fin), 0)

          return (
            <div key={ymd}
              className={`min-h-[100px] rounded-xl p-1.5 flex flex-col gap-1.5 border
                ${isHoy ? 'border-primary-300 bg-primary-50/40'
                  : isPast ? 'border-gray-100 bg-gray-50/60'
                  : 'border-gray-100 bg-gray-50/30'}`}>
              {tareas.filter(s => s.estado === 'programado').length > 0 && (
                <p className={`text-[10px] font-semibold text-center ${isHoy ? 'text-primary-500' : 'text-gray-400'}`}>
                  {fmt(hDay)}h
                </p>
              )}
              {tareas.map((t) => (
                <EventCard
                  key={t.id}
                  sol={t}
                  today={today}
                  onClick={onVerDetalle}
                  onFinalizar={onFinalizar}
                />
              ))}
              {tareas.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-gray-200 text-[10px]">—</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {misTareas.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-sm font-medium">Sin tareas esta semana</p>
          <p className="text-xs mt-1">Navega a otra semana para ver tus asignaciones</p>
        </div>
      )}
    </div>
  )
}
