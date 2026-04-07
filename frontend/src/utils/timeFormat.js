/**
 * Convierte "HH:MM" (24h) a "H:MM AM/PM"
 * Ej: "14:30" → "2:30 PM", "08:00" → "8:00 AM"
 */
export function formatHora(time) {
  if (!time) return ''
  const [hh, mm] = time.split(':').map(Number)
  const ampm = hh < 12 ? 'AM' : 'PM'
  const hour = hh % 12 || 12
  return `${hour}:${String(mm).padStart(2, '0')} ${ampm}`
}
