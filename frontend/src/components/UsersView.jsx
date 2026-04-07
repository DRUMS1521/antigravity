import { useState, useEffect, useMemo } from 'react'
import api from '../services/api'
import { notify } from '../utils/notify'
import UserModal from './UserModal'

const CARGO_BADGE = {
  'Jefe de Recreación':      { cls: 'bg-purple-100 text-purple-700 border-purple-200', icon: '👑' },
  'Secretaria de Recreación': { cls: 'bg-blue-100 text-blue-700 border-blue-200', icon: '📋' },
  'Recreador':                { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🎯' },
  'Promotor Comercial':       { cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: '📣' },
  'Gestor Comercial':         { cls: 'bg-orange-100 text-orange-700 border-orange-200', icon: '💼' },
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export default function UsersView() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCargo, setFilterCargo] = useState(null)
  const [modalUser, setModalUser] = useState(undefined) // undefined=cerrado, null=crear, {...}=editar
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users/')
      setUsers(data)
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      if (modalUser) {
        // Editar
        const { data } = await api.patch(`/users/${modalUser.id}`, payload)
        setUsers((prev) => prev.map((u) => u.id === data.id ? data : u))
        notify.success('Usuario actualizado')
      } else {
        // Crear
        const { data } = await api.post('/users/', payload)
        setUsers((prev) => [...prev, data])
        notify.success('Usuario creado exitosamente')
      }
      setModalUser(undefined)
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (user) => {
    try {
      const { data } = await api.patch(`/users/${user.id}/toggle-active`)
      setUsers((prev) => prev.map((u) => u.id === data.id ? data : u))
      notify.success(data.is_active ? `${data.full_name} activado` : `${data.full_name} desactivado`)
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Error al cambiar estado')
    }
  }

  // Cargos disponibles para filtro
  const cargosUnicos = useMemo(() => {
    const set = new Set(users.map((u) => u.cargo).filter(Boolean))
    return [...set].sort()
  }, [users])

  // Usuarios filtrados
  const filteredUsers = useMemo(() => {
    let list = users
    if (filterCargo) list = list.filter((u) => u.cargo === filterCargo)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.cargo?.toLowerCase().includes(q)
      )
    }
    return list
  }, [users, filterCargo, search])

  // Contadores por cargo
  const countByCargo = useMemo(() => {
    const map = {}
    users.forEach((u) => {
      const k = u.cargo || 'Sin cargo'
      map[k] = (map[k] || 0) + 1
    })
    return map
  }, [users])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header con contadores por cargo */}
      <div className="px-5 pt-5 pb-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterCargo(null)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
              !filterCargo
                ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todos ({users.length})
          </button>
          {cargosUnicos.map((cargo) => {
            const b = CARGO_BADGE[cargo] || { cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: '👤' }
            const activo = filterCargo === cargo
            return (
              <button
                key={cargo}
                onClick={() => setFilterCargo(activo ? null : cargo)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1.5 ${
                  activo
                    ? `${b.cls} shadow-sm ring-1 ring-offset-1 ring-primary-300`
                    : `bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50`
                }`}
              >
                <span>{b.icon}</span>
                {cargo} ({countByCargo[cargo] || 0})
              </button>
            )
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-5 flex items-center gap-3 flex-wrap">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, usuario, email..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Contador */}
        <span className="text-xs text-gray-400 shrink-0">
          {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
        </span>

        {/* Botón crear */}
        <button
          onClick={() => setModalUser(null)}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* Lista */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-14 px-4">
          <div className="text-4xl mb-2">{search ? '🔍' : '👥'}</div>
          <p className="text-sm font-medium text-gray-600">
            {search ? `Sin resultados para "${search}"` : 'No hay usuarios en este filtro'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? 'Intenta con otro término' : 'Crea un nuevo usuario para empezar'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {filteredUsers.map((u) => {
            const badge = CARGO_BADGE[u.cargo] || { cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: '👤' }
            const initials = getInitials(u.full_name || u.username)
            const avatarColors = u.is_super_admin
              ? 'bg-purple-100 text-purple-700 ring-purple-200'
              : u.is_admin
                ? 'bg-blue-100 text-blue-700 ring-blue-200'
                : u.is_recreador
                  ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
                  : 'bg-amber-100 text-amber-700 ring-amber-200'

            return (
              <div
                key={u.id}
                className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition group ${
                  !u.is_active ? 'opacity-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 shrink-0 font-bold text-sm ${avatarColors}`}>
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{u.full_name || u.username}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.cls}`}>
                      {badge.icon} {u.cargo || 'Sin cargo'}
                    </span>
                    {!u.is_active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border bg-red-50 text-red-600 border-red-200">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {u.username}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {u.email}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  {/* Editar */}
                  <button
                    onClick={() => setModalUser(u)}
                    title="Editar"
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {/* Toggle activo/inactivo */}
                  <button
                    onClick={() => handleToggleActive(u)}
                    title={u.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                    className={`p-2 rounded-lg transition ${
                      u.is_active
                        ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'
                    }`}
                  >
                    {u.is_active ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  )
}
