/**
 * Selector de hora AM/PM intuitivo.
 * Internamente usa HH:MM (24h) para el backend.
 */

const HOURS = ['1','2','3','4','5','6','7','8','9','10','11','12']
const MINUTES = ['00','05','10','15','20','25','30','35','40','45','50','55']

function parse(value) {
  if (!value) return { h: '', m: '00', ap: 'AM' }
  const [hh, mm] = value.split(':').map(Number)
  return {
    h: String(hh % 12 || 12),
    m: String(mm).padStart(2, '0'),
    ap: hh < 12 ? 'AM' : 'PM',
  }
}

function to24(h, m, ap) {
  if (h === '') return ''
  let h24 = Number(h) % 12
  if (ap === 'PM') h24 += 12
  return `${String(h24).padStart(2, '0')}:${m || '00'}`
}

export default function TimePicker({ value, onChange, hasError }) {
  const { h, m, ap } = parse(value)

  const selCls = `border rounded-lg px-2 py-2 text-sm font-medium text-center
    focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white appearance-none cursor-pointer
    ${hasError ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}`

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 bg-white transition
      ${hasError ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100'}`}
    >
      {/* Ícono de reloj */}
      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      {/* Hora */}
      <select
        value={h}
        onChange={e => onChange(to24(e.target.value, m, ap))}
        className="border-0 outline-none bg-transparent text-sm font-semibold text-gray-800 cursor-pointer w-9 text-center"
      >
        <option value="">--</option>
        {HOURS.map(hh => <option key={hh} value={hh}>{hh}</option>)}
      </select>

      <span className="text-gray-400 font-bold select-none">:</span>

      {/* Minutos */}
      <select
        value={m}
        onChange={e => onChange(to24(h, e.target.value, ap))}
        className="border-0 outline-none bg-transparent text-sm font-semibold text-gray-800 cursor-pointer w-10 text-center"
      >
        {MINUTES.map(mm => <option key={mm} value={mm}>{mm}</option>)}
      </select>

      {/* Separador */}
      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* Toggle AM / PM */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-bold">
        {['AM', 'PM'].map(period => (
          <button
            key={period}
            type="button"
            onClick={() => onChange(to24(h, m, period))}
            className={`px-2 py-1 transition-colors ${
              ap === period
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  )
}
