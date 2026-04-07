import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../services/api'
import { formatHora } from '../utils/timeFormat'

const PIE_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#14b8a6']

// Mismas opciones que el formulario de crear solicitud
const TIPOS_SERVICIO = [
  'Pausa Activa',
  'Cardio Rumba',
  'Recreación Corporativa',
  'Carrera de Observación',
  'Dance Ball Fit',
  'Rumba Kids',
  'Rumba Dorada',
  'Otro',
]

const POR_PAGINA = 10

export default function StatsRecreador() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [fechaDesde, setFechaDesde]   = useState('')
  const [fechaHasta, setFechaHasta]   = useState('')
  const [tipoServicio, setTipoServicio] = useState('')
  const [pagina, setPagina]           = useState(1)
  const [modalSol, setModalSol]       = useState(null)

  const fetchStats = async (fd = fechaDesde, fh = fechaHasta, ts = tipoServicio) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (fd) params.append('fecha_desde', fd)
      if (fh) params.append('fecha_hasta', fh)
      if (ts) params.append('tipo_servicio', ts)
      const { data: res } = await api.get(`/stats/recreador?${params}`)
      setData(res)
      setPagina(1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchStats()
  }

  const clearFilters = () => {
    setFechaDesde('')
    setFechaHasta('')
    setTipoServicio('')
    fetchStats('', '', '')
  }

  const hasFilters = fechaDesde || fechaHasta || tipoServicio

  // KPIs calculados desde las solicitudes_finalizadas (siempre refleja el filtro)
  const kpis = useMemo(() => {
    const finalizadas = data?.solicitudes_finalizadas ?? []
    const horas = finalizadas.reduce((sum, s) => sum + (s.horas ?? 0), 0)
    return {
      total:       data?.total ?? 0,
      finalizadas: finalizadas.length,
      programadas: data?.programadas ?? 0,
      horas:       Math.round(horas * 10) / 10,
    }
  }, [data])

  // Lista paginada: backend ya devuelve orden descendente por fecha
  const listaOrdenada = data?.solicitudes_finalizadas ?? []
  const totalPaginas  = Math.ceil(listaOrdenada.length / POR_PAGINA)
  const paginaActual  = listaOrdenada.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* KPIs — se actualizan con cada filtro */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Total actividades',
            value: kpis.total,
            color: 'border-gray-100',
            iconCls: 'text-gray-500',
            bgCls: 'bg-gray-50',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
          },
          {
            label: 'Finalizadas',
            value: kpis.finalizadas,
            color: 'border-emerald-200',
            iconCls: 'text-emerald-600',
            bgCls: 'bg-emerald-50',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          },
          {
            label: 'Programadas',
            value: kpis.programadas,
            color: 'border-blue-200',
            iconCls: 'text-blue-600',
            bgCls: 'bg-blue-50',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
          },
          {
            label: 'Horas trabajadas',
            value: `${kpis.horas}h`,
            color: 'border-purple-200',
            iconCls: 'text-purple-600',
            bgCls: 'bg-purple-50',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
          },
        ].map(({ label, value, color, iconCls, bgCls, icon }) => (
          <div key={label} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 ${color}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bgCls}`}>
              <svg className={`w-5 h-5 ${iconCls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
              <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
              {hasFilters && <p className="text-[10px] text-primary-500 mt-0.5 font-medium">filtrado</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtrar actividades
          {hasFilters && <span className="ml-auto text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-semibold">Filtro activo</span>}
        </h3>
        <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Desde</label>
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Hasta</label>
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Tipo de servicio</label>
            <select value={tipoServicio} onChange={(e) => setTipoServicio(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 min-w-[200px]">
              <option value="">Todos los tipos</option>
              {TIPOS_SERVICIO.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            Aplicar
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-gray-600 px-2 py-2 transition underline underline-offset-2">
              Limpiar filtros
            </button>
          )}
        </form>
      </div>

      {/* Gráfico circular por tipo de servicio */}
      {data?.por_tipo_servicio?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-700 text-sm mb-1">Distribución por tipo de servicio</h3>
          <p className="text-xs text-gray-400 mb-4">
            {kpis.finalizadas} actividad{kpis.finalizadas !== 1 ? 'es' : ''} · {kpis.horas}h totales
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Pie */}
            <div className="shrink-0 w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.por_tipo_servicio}
                    dataKey="count"
                    nameKey="tipo"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {data.por_tipo_servicio.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} actividad${value !== 1 ? 'es' : ''}`, name]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Leyenda + resumen */}
            <div className="flex-1 w-full space-y-2">
              {data.por_tipo_servicio.map((item, i) => {
                const total = data.por_tipo_servicio.reduce((s, x) => s + x.count, 0)
                const pct   = Math.round((item.count / total) * 100)
                return (
                  <div key={item.tipo} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-gray-600 flex-1 truncate">{item.tipo}</span>
                    <span className="text-xs font-bold text-gray-800">{item.count}</span>
                    <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      )}

      {/* Lista de actividades paginada */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-700 text-sm">Actividades finalizadas</h3>
            {listaOrdenada.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {listaOrdenada.length} actividad{listaOrdenada.length !== 1 ? 'es' : ''}
                {totalPaginas > 1 && ` · página ${pagina} de ${totalPaginas}`}
              </p>
            )}
          </div>
          {loading && <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />}
        </div>

        {listaOrdenada.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-medium">Sin actividades finalizadas</p>
            <p className="text-xs mt-1">
              {hasFilters ? 'Intenta cambiar los filtros' : 'Aquí aparecerán tus actividades completadas'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {paginaActual.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setModalSol(sol)}
                  className="w-full text-left px-5 py-4 hover:bg-primary-50/40 transition flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 text-sm">{sol.empresa}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium">
                        Finalizada
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                      <span className="text-gray-500 text-xs">{sol.fecha_evento} · {formatHora(sol.hora_inicio)}–{formatHora(sol.hora_fin)}</span>
                      <span className="text-gray-500 text-xs">{sol.tipo_servicio}</span>
                      <span className="text-primary-600 text-xs font-semibold">{sol.horas}h</span>
                    </div>
                    {sol.observacion_final && (
                      <p className="text-xs text-gray-400 mt-1 truncate">"{sol.observacion_final}"</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        p === pagina
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalle */}
      {modalSol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalSol(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-lg leading-tight truncate">{modalSol.empresa}</h2>
                  <p className="text-emerald-100 text-sm mt-0.5">{modalSol.tipo_servicio}</p>
                </div>
                <button onClick={() => setModalSol(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className="mt-3 inline-block text-xs px-2.5 py-1 rounded-full font-semibold bg-white/20 text-white">
                Finalizada
              </span>
            </div>

            {/* Cuerpo */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Fecha</p>
                  <p className="text-sm font-semibold text-gray-800">{modalSol.fecha_evento}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Horario</p>
                  <p className="text-sm font-semibold text-gray-800">{formatHora(modalSol.hora_inicio)} – {formatHora(modalSol.hora_fin)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Ciudad</p>
                  <p className="text-sm font-semibold text-gray-800">{modalSol.ciudad}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-xs text-emerald-400 mb-0.5">Horas trabajadas</p>
                  <p className="text-sm font-bold text-emerald-700">{modalSol.horas}h</p>
                </div>
              </div>

              {modalSol.fecha_finalizacion && (
                <p className="text-xs text-gray-400">
                  Finalizada el {new Date(modalSol.fecha_finalizacion).toLocaleDateString('es-CO', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              )}

              {modalSol.observacion_final && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Observación</p>
                  <p className="text-sm text-gray-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 leading-relaxed">
                    "{modalSol.observacion_final}"
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <button onClick={() => setModalSol(null)}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
