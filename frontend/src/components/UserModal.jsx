import { useState, useEffect, useRef } from 'react'

const CARGOS = [
  'Jefe de Recreación',
  'Secretaria de Recreación',
  'Recreador',
  'Promotor Comercial',
  'Gestor Comercial',
]

const CARGO_DESCRIPCION = {
  'Jefe de Recreación': 'Super Admin — acceso total, gestión de usuarios',
  'Secretaria de Recreación': 'Admin — gestión de solicitudes y calendario',
  'Recreador': 'Puede ver y finalizar sus actividades asignadas',
  'Promotor Comercial': 'Puede crear solicitudes para empresas',
  'Gestor Comercial': 'Puede crear solicitudes para empresas',
}

export default function UserModal({ user, onClose, onSave, saving }) {
  const isEdit = !!user
  const [form, setForm] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    cargo: 'Recreador',
  })
  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        password: '',
        cargo: user.cargo || 'Recreador',
      })
    }
    setTimeout(() => nameRef.current?.focus(), 100)
  }, [user])

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Nombre requerido'
    if (!form.email.trim()) errs.email = 'Email requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido'
    if (!isEdit) {
      if (!form.username.trim()) errs.username = 'Usuario requerido'
      if (!form.password) errs.password = 'Contraseña requerida'
      else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    }
    if (isEdit && form.password && form.password.length < 6) {
      errs.password = 'Mínimo 6 caracteres'
    }
    if (!form.cargo) errs.cargo = 'Cargo requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    if (isEdit) {
      const payload = {}
      if (form.full_name !== user.full_name) payload.full_name = form.full_name
      if (form.email !== user.email) payload.email = form.email
      if (form.cargo !== user.cargo) payload.cargo = form.cargo
      if (form.password) payload.password = form.password
      onSave(payload)
    } else {
      onSave({
        username: form.username.trim(),
        email: form.email.trim(),
        full_name: form.full_name.trim(),
        password: form.password,
        cargo: form.cargo,
      })
    }
  }

  const cargoDesc = CARGO_DESCRIPCION[form.cargo] || ''

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isEdit ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  )}
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <p className="text-white/70 text-xs">{isEdit ? `Editando a ${user.full_name}` : 'Crear un nuevo miembro del equipo'}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo *</label>
            <input
              ref={nameRef}
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ej: María García López"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition ${
                errors.full_name ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'
              }`}
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Username (solo crear) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Usuario *</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '.') })}
                placeholder="Ej: maria.garcia"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition ${
                  errors.username ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'
                }`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Ej: maria.garcia@comfenalcotolima.com"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition ${
                errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña {isEdit ? '(dejar vacío para no cambiar)' : '*'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition ${
                errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label>
            <select
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition appearance-none bg-gray-50 ${
                errors.cargo ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
              }`}
            >
              {CARGOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
            {cargoDesc && (
              <div className="mt-2 flex items-start gap-2 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-primary-700">{cargoDesc}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Guardar cambios' : 'Crear usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
