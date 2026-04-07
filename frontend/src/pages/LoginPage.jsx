import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notify } from '../utils/notify'
import useAuth from '../hooks/useAuth'
import { loginRequest } from '../services/auth'
import logo from '../assets/logo-comfenalco.svg'

const STYLES = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(52px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-16px); }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes spinReverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  .a-logo   { animation: fadeInDown   0.9s cubic-bezier(.16,1,.3,1) 0.05s both; }
  .a-brand  { animation: fadeInLeft   0.8s cubic-bezier(.16,1,.3,1) 0.25s both; }
  .a-card   { animation: slideInRight 0.9s cubic-bezier(.16,1,.3,1) 0.1s  both; }
  .a-title  { animation: fadeInUp     0.6s ease 0.3s  both; }
  .a-f1     { animation: fadeInUp     0.5s ease 0.5s  both; }
  .a-f2     { animation: fadeInUp     0.5s ease 0.65s both; }
  .a-btn    { animation: fadeInUp     0.5s ease 0.82s both; }
  .a-footer { animation: fadeInUp     0.5s ease 0.95s both; }

  .float      { animation: floatY     5s ease-in-out infinite; }
  .spin-slow  { animation: spinSlow   22s linear infinite; }
  .spin-rev   { animation: spinReverse 30s linear infinite; }
  .p-ring-1   { animation: pulseRing  2.8s ease-out infinite; }
  .p-ring-2   { animation: pulseRing  2.8s ease-out 1.4s infinite; }

  .shimmer-text {
    background: linear-gradient(90deg, #4ade80, #86efac, #ffffff, #86efac, #4ade80);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: #4ade80;
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 1s step-end infinite;
  }

  .input-glow:focus {
    box-shadow: 0 0 0 3px rgba(74,222,128,0.2), 0 0 20px rgba(74,222,128,0.08);
  }
`

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      notify.error('Ingrese usuario y contraseña')
      return
    }
    setLoading(true)
    try {
      const { data } = await loginRequest(username.trim(), password.trim())
      login(data)
      notify.success(`Bienvenido, ${data.full_name || data.username}`)
      navigate('/dashboard')
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="min-h-screen flex bg-gray-950 overflow-hidden">

        {/* ── PANEL IZQUIERDO: Marca ── */}
        <div className="hidden lg:flex lg:w-[58%] relative flex-col items-center justify-center p-16 overflow-hidden">

          {/* Grid de fondo */}
          <div className="absolute inset-0 opacity-100" style={{
            backgroundImage: `
              linear-gradient(rgba(0,180,80,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,180,80,0.07) 1px, transparent 1px)`,
            backgroundSize: '52px 52px',
          }} />

          {/* Gradiente sobre el grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/95 to-emerald-950/50" />

          {/* Glow inferior */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[480px] h-40
            bg-green-600/10 blur-3xl rounded-full pointer-events-none" />

          {/* Glow superior derecha */}
          <div className="absolute top-10 right-0 w-64 h-64
            bg-green-500/5 blur-3xl rounded-full pointer-events-none" />

          {/* Anillos giratorios */}
          <div className="absolute w-[580px] h-[580px] rounded-full
            border border-green-700/15 spin-slow pointer-events-none" />
          <div className="absolute w-[440px] h-[440px] rounded-full
            border border-green-600/10 spin-rev pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full
            border border-green-500/10 spin-slow pointer-events-none"
            style={{ animationDuration: '14s' }} />

          {/* Anillos de pulso */}
          <div className="absolute w-52 h-52 rounded-full border border-green-500/25 p-ring-1 pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full border border-green-400/15 p-ring-2 pointer-events-none" />

          {/* Puntos decorativos */}
          {[...Array(6)].map((_, i) => (
            <div key={i}
              className="absolute w-1 h-1 rounded-full bg-green-400/40"
              style={{
                top: `${15 + i * 14}%`,
                left: `${8 + (i % 3) * 12}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

          {/* Contenido central */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md">

            {/* Logo flotante */}
            <div className="a-logo float mb-10">
              <div className="w-44 h-44 bg-white rounded-[2rem] shadow-2xl shadow-black/60 flex items-center justify-center p-6
                ring-1 ring-white/10">
                <img src={logo} alt="Comfenalco Tolima" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="a-brand space-y-4">
              <div>
                <h1 className="text-5xl font-black tracking-tight leading-none text-white mb-1">
                  Comfenalco
                </h1>
                <p className="shimmer-text text-3xl font-black tracking-widest">
                  TOLIMA
                </p>
              </div>

              {/* Línea divisora */}
              <div className="flex items-center gap-3 justify-center py-2">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-green-500/60" />
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-400" />
                  <span className="w-1 h-1 rounded-full bg-green-300/60" />
                  <span className="w-1 h-1 rounded-full bg-green-200/40" />
                </div>
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-green-500/60" />
              </div>

              <p className="text-gray-500 text-sm leading-relaxed tracking-wide">
                Plataforma integral de gestión para actividades<br />recreativas y de bienestar.
              </p>

              {/* Tags */}
              <div className="flex gap-2 justify-center flex-wrap pt-2">
                {['Recreación', 'Bienestar', 'Gestión'].map(tag => (
                  <span key={tag}
                    className="text-xs text-green-400/70 border border-green-800/50 px-3 py-1
                      rounded-full bg-green-900/20 tracking-wider uppercase font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Versión */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <span className="text-gray-700 text-xs tracking-widest uppercase font-mono">
              v2.0 — 2026
            </span>
          </div>
        </div>

        {/* ── PANEL DERECHO: Formulario ── */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative">

          {/* Línea de color en el borde izquierdo */}
          <div className="absolute top-0 left-0 bottom-0 w-px
            bg-gradient-to-b from-transparent via-green-400/50 to-transparent" />

          {/* Barra superior de acento */}
          <div className="absolute top-0 left-0 right-0 h-0.5
            bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />

          {/* Círculo decorativo fondo */}
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full
            bg-green-50 blur-3xl opacity-60 pointer-events-none" />

          <div className="w-full max-w-sm relative z-10 a-card">

            {/* Logo para mobile */}
            <div className="flex justify-center mb-8 lg:hidden">
              <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl shadow-lg p-3">
                <img src={logo} alt="Comfenalco" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Título */}
            <div className="mb-8 a-title">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-0.5 bg-green-500 rounded-full" />
                <span className="text-green-600 text-xs font-bold tracking-widest uppercase">
                  Acceso seguro
                </span>
              </div>
              <h2 className="text-gray-900 text-3xl font-black leading-tight mt-2">
                Bienvenido<span className="text-green-500">.</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1.5">
                Ingresa tus credenciales para continuar
                <span className="cursor ml-0.5" />
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Usuario */}
              <div className="a-f1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="tu.usuario"
                    autoComplete="username"
                    className="input-glow w-full bg-gray-50 border border-gray-200 rounded-xl
                      pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-300
                      focus:outline-none focus:border-green-400 focus:bg-white
                      transition-all duration-200"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="a-f2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="input-glow w-full bg-gray-50 border border-gray-200 rounded-xl
                      pl-11 pr-12 py-3.5 text-sm text-gray-900 placeholder-gray-300
                      focus:outline-none focus:border-green-400 focus:bg-white
                      transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                      hover:text-gray-600 transition-colors"
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Botón */}
              <div className="a-btn pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden font-bold py-4 rounded-xl text-sm
                    transition-all duration-300 flex items-center justify-center gap-2
                    disabled:opacity-60 group
                    bg-gray-950 hover:bg-gray-900 text-white
                    shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40
                    hover:-translate-y-0.5 active:translate-y-0"
                >
                  {/* Shimmer en hover */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                    transition-transform duration-700
                    bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Ingresando...
                    </>
                  ) : (
                    <>
                      Ingresar
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="a-footer mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-gray-400 text-[11px]">
                © {new Date().getFullYear()} Comfenalco Tolima
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-gray-400">Sistema en línea</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
