"""
Seed de solicitudes - Enero 2026
Distribución por categoría de horas semanales:
  BAJO  (~18-25h/sem): gabriel, dalma, johny, issa, brayan
  EXACTO (~42h/sem):   andres, mercedes, angie, juan, daniel.rincon
  ALTO  (~49-56h/sem): sebastian, nestor, camilo, mauricio, daniel.ruiz
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.core.database import Base
from app.models.solicitud import Solicitud, solicitud_recreadores
from app.models.user import User
from sqlalchemy import text

Base.metadata.create_all(bind=engine)

# ------------------------------------------------------------------
# Tabla de eventos
# fecha, inicio, fin, empresa, tipo_servicio, ciudad, tipo_publico,
# cantidad_personas, contacto, telefono, recreadores (lista de IDs),
# observacion_final
# ------------------------------------------------------------------

EMPRESAS = [
    "Bavaria S.A.", "Ecopetrol", "Bancolombia", "Alkosto",
    "EPM", "Colegio San Luis Gonzaga", "Hospital Federico Lleras",
    "Seguros Bolívar", "Municipio de Ibagué", "Claro Colombia",
    "Nutresa", "Avianca", "Caja Compensar", "Centro Comercial Multicentro",
    "Industrias Protela", "Comfenalco Valle", "Éxito S.A.",
    "Colombina S.A.", "Alpina Productos", "Sura Seguros",
]

CONTACTOS = [
    ("María García", "3101234560"), ("Carlos Rivera", "3201234561"),
    ("Ana Martínez", "3101234562"), ("Pedro Salcedo", "3201234563"),
    ("Lucía Peña", "3111234564"), ("Andrés Torres", "3201234565"),
    ("Sofía Jiménez", "3121234566"), ("Ricardo Gómez", "3201234567"),
    ("Valentina Cruz", "3131234568"), ("Felipe Ortiz", "3201234569"),
]

OBS = [
    "Excelente participación del grupo. Todo transcurrió con normalidad.",
    "Muy buena energía. Los participantes quedaron muy satisfechos.",
    "Actividad completada sin novedades. Equipo muy comprometido.",
    "Gran jornada recreativa. Asistencia completa del grupo.",
    "Evento exitoso. Alta motivación y buena dinámica grupal.",
    "Servicio prestado a cabalidad. Sin inconvenientes durante la jornada.",
    "Excelente respuesta del público. Se cumplieron todos los objetivos.",
    "Jornada recreativa completada. Participación activa de todos.",
    "Todo salió según lo planeado. Gran ambiente durante la actividad.",
    "Actividad cumplida. El grupo demostró mucho entusiasmo.",
    "Buena dinámica de integración. Se lograron los objetivos propuestos.",
    "Servicio prestado satisfactoriamente. Sin novedades para reportar.",
]

# IDs fijos (basados en seed_users.py en orden)
G   = 3   # gabriel.vaquiro       — BAJO
A   = 4   # andres.garcia         — EXACTO
S   = 5   # sebastian.leguizamon  — ALTO
D   = 6   # dalma.suarez          — BAJO
J   = 7   # johny.fandino         — BAJO
M   = 8   # mercedes.leal         — EXACTO
N   = 9   # nestor.villa          — ALTO
AN  = 10  # angie.rojas           — EXACTO
C   = 11  # camilo.pena           — ALTO
IS  = 12  # issa.paez             — BAJO
JD  = 13  # juan.daniel           — EXACTO
MA  = 14  # mauricio.arias        — ALTO
DR  = 15  # daniel.rincon         — EXACTO
DRU = 16  # daniel.ruiz           — ALTO
B   = 17  # brayan.botero         — BAJO

EMPRESA_ID = 2  # empresa1

# ------------------------------------------------------------------
# Eventos: (fecha, inicio, fin, empresa_idx, tipo_servicio,
#           ciudad, tipo_publico, personas, contacto_idx,
#           [recreadores], obs_idx)
# ------------------------------------------------------------------
# Semanas de enero 2026:
#   Semana 1: Jan 05-10 (lun-sab)
#   Semana 2: Jan 12-17
#   Semana 3: Jan 19-24
#   Semana 4: Jan 26-31

EVENTOS = [
    # ================================================================
    # SEMANA 1 — Jan 05-10
    # ================================================================

    # Lunes Jan 05
    ("2026-01-05","08:00","15:00", 0,"Team building",          "Ibagué",  "Adultos",      80,0,[A,S],       0),
    ("2026-01-05","08:00","16:00", 1,"Recreación empresarial", "Ibagué",  "Adultos",      60,1,[M,N,C],     1),
    ("2026-01-05","09:00","17:00", 2,"Actividad deportiva",    "Espinal", "Jóvenes",      40,2,[MA,DRU],    2),
    ("2026-01-05","09:00","16:00", 3,"Evento infantil",        "Ibagué",  "Niños",        70,3,[AN,JD],     3),
    ("2026-01-05","08:00","15:00", 4,"Festival comunitario",   "Honda",   "Mixto",        90,4,[DR],        4),
    ("2026-01-05","08:00","14:00", 5,"Evento infantil",        "Ibagué",  "Niños",        35,5,[G],         5),
    ("2026-01-05","09:00","14:00", 6,"Recreación acuática",    "Melgar",  "Adultos",      25,6,[IS],        6),

    # Martes Jan 06
    ("2026-01-06","08:00","15:00", 7,"Recreación empresarial", "Ibagué",  "Adultos",      55,7,[A,M],       7),
    ("2026-01-06","08:00","17:00", 8,"Festival comunitario",   "Ibagué",  "Mixto",       100,8,[S,C],       8),
    ("2026-01-06","08:00","16:00", 9,"Team building",          "Espinal", "Adultos",      45,9,[N,MA,DRU],  9),
    ("2026-01-06","08:00","14:00",10,"Evento infantil",        "Ibagué",  "Niños",        50,0,[J,D],       10),
    ("2026-01-06","09:00","16:00",11,"Actividad deportiva",    "Ibagué",  "Jóvenes",      30,1,[AN],        11),
    ("2026-01-06","08:00","15:00",12,"Recreación empresarial", "Honda",   "Adultos",      40,2,[JD,DR],     0),
    ("2026-01-06","09:00","15:00",13,"Festival comunitario",   "Ibagué",  "Mixto",        60,3,[B],         1),

    # Miércoles Jan 07
    ("2026-01-07","08:00","15:00", 0,"Recreación empresarial", "Ibagué",  "Adultos",      50,4,[A,M],       2),
    ("2026-01-07","08:00","17:00", 1,"Team building",          "Ibagué",  "Adultos",      65,5,[S,N],       3),
    ("2026-01-07","08:00","16:00", 2,"Actividad deportiva",    "Espinal", "Jóvenes",      35,6,[C,DRU],     4),
    ("2026-01-07","08:00","16:00", 3,"Festival comunitario",   "Ibagué",  "Mixto",        80,7,[MA],        5),
    ("2026-01-07","09:00","15:00", 4,"Evento infantil",        "Ibagué",  "Niños",        45,8,[G,D],       6),
    ("2026-01-07","08:00","15:00", 7,"Recreación empresarial", "Honda",   "Adultos",      55,9,[AN,JD],     7),
    ("2026-01-07","08:00","15:00", 9,"Team building",          "Ibagué",  "Adultos",      40,0,[DR],        8),
    ("2026-01-07","08:00","14:00",14,"Evento infantil",        "Ibagué",  "Niños",        30,1,[IS],        9),

    # Jueves Jan 08
    ("2026-01-08","08:00","15:00",10,"Team building",          "Ibagué",  "Adultos",      60,2,[A,M],       10),
    ("2026-01-08","08:00","17:00",11,"Festival comunitario",   "Ibagué",  "Mixto",        95,3,[S,C],       11),
    ("2026-01-08","08:00","16:00", 0,"Actividad deportiva",    "Espinal", "Jóvenes",      40,4,[N,DRU,MA],  0),
    ("2026-01-08","08:00","14:00",12,"Evento infantil",        "Honda",   "Niños",        50,5,[J,G],       1),
    ("2026-01-08","09:00","16:00", 1,"Recreación empresarial", "Ibagué",  "Adultos",      45,6,[AN,JD],     2),
    ("2026-01-08","08:00","15:00", 2,"Team building",          "Ibagué",  "Adultos",      35,7,[DR],        3),
    ("2026-01-08","08:00","14:00", 3,"Recreación acuática",    "Melgar",  "Adultos",      20,8,[IS,B],      4),

    # Viernes Jan 09
    ("2026-01-09","08:00","15:00", 4,"Recreación empresarial", "Ibagué",  "Adultos",      55,9,[A,M],       5),
    ("2026-01-09","08:00","17:00", 5,"Team building",          "Ibagué",  "Adultos",      70,0,[S,N,C],     6),
    ("2026-01-09","08:00","16:00", 6,"Festival comunitario",   "Espinal", "Mixto",        85,1,[MA,DRU],    7),
    ("2026-01-09","09:00","15:00", 7,"Actividad deportiva",    "Ibagué",  "Jóvenes",      30,2,[D],         8),
    ("2026-01-09","09:00","16:00", 8,"Evento infantil",        "Ibagué",  "Niños",        40,3,[AN],        9),
    ("2026-01-09","08:00","15:00", 9,"Recreación empresarial", "Honda",   "Adultos",      50,4,[JD,DR],     10),

    # Sábado Jan 10
    ("2026-01-10","09:00","16:00",10,"Festival comunitario",   "Ibagué",  "Mixto",       110,5,[A,M],       11),
    ("2026-01-10","09:00","18:00",11,"Recreación empresarial", "Ibagué",  "Adultos",     120,6,[S,N,C,MA],  0),
    ("2026-01-10","08:00","16:00",12,"Actividad deportiva",    "Espinal", "Jóvenes",      55,7,[DRU],       1),
    ("2026-01-10","09:00","16:00",13,"Evento infantil",        "Ibagué",  "Niños",        65,8,[AN,JD],     2),
    ("2026-01-10","08:00","15:00",14,"Team building",          "Honda",   "Adultos",      45,9,[DR],        3),
    ("2026-01-10","09:00","15:00", 0,"Recreación acuática",    "Melgar",  "Adultos",      30,0,[G,IS],      4),
    ("2026-01-10","10:00","16:00", 1,"Evento infantil",        "Ibagué",  "Niños",        40,1,[B],         5),

    # ================================================================
    # SEMANA 2 — Jan 12-17
    # ================================================================

    # Lunes Jan 12
    ("2026-01-12","08:00","15:00", 2,"Team building",          "Ibagué",  "Adultos",      75,2,[A,S],       6),
    ("2026-01-12","08:00","16:00", 3,"Recreación empresarial", "Ibagué",  "Adultos",      65,3,[M,N,C],     7),
    ("2026-01-12","09:00","17:00", 4,"Actividad deportiva",    "Espinal", "Jóvenes",      45,4,[MA,DRU],    8),
    ("2026-01-12","09:00","16:00", 5,"Evento infantil",        "Ibagué",  "Niños",        60,5,[AN,JD],     9),
    ("2026-01-12","08:00","15:00", 6,"Festival comunitario",   "Honda",   "Mixto",        85,6,[DR],        10),
    ("2026-01-12","08:00","14:00", 7,"Evento infantil",        "Ibagué",  "Niños",        30,7,[G,D],       11),
    ("2026-01-12","09:00","15:00", 8,"Recreación acuática",    "Melgar",  "Adultos",      22,8,[J],         0),

    # Martes Jan 13
    ("2026-01-13","08:00","15:00", 9,"Recreación empresarial", "Ibagué",  "Adultos",      50,9,[A,M],       1),
    ("2026-01-13","08:00","17:00",10,"Festival comunitario",   "Ibagué",  "Mixto",        95,0,[S,C],       2),
    ("2026-01-13","08:00","16:00",11,"Team building",          "Espinal", "Adultos",      50,1,[N,MA,DRU],  3),
    ("2026-01-13","08:00","14:00",12,"Evento infantil",        "Ibagué",  "Niños",        55,2,[IS],        4),
    ("2026-01-13","09:00","16:00",13,"Actividad deportiva",    "Ibagué",  "Jóvenes",      35,3,[AN],        5),
    ("2026-01-13","08:00","15:00",14,"Recreación empresarial", "Honda",   "Adultos",      45,4,[JD,DR],     6),
    ("2026-01-13","09:00","15:00", 0,"Festival comunitario",   "Ibagué",  "Mixto",        55,5,[B],         7),

    # Miércoles Jan 14
    ("2026-01-14","08:00","15:00", 1,"Recreación empresarial", "Ibagué",  "Adultos",      60,6,[A,M],       8),
    ("2026-01-14","08:00","17:00", 2,"Team building",          "Ibagué",  "Adultos",      70,7,[S,N],       9),
    ("2026-01-14","08:00","16:00", 3,"Actividad deportiva",    "Espinal", "Jóvenes",      40,8,[C,DRU],     10),
    ("2026-01-14","08:00","16:00", 4,"Festival comunitario",   "Ibagué",  "Mixto",        75,9,[MA],        11),
    ("2026-01-14","09:00","15:00", 5,"Evento infantil",        "Ibagué",  "Niños",        40,0,[G,D],       0),
    ("2026-01-14","08:00","15:00", 6,"Recreación empresarial", "Honda",   "Adultos",      50,1,[AN,JD],     1),
    ("2026-01-14","08:00","15:00", 7,"Team building",          "Ibagué",  "Adultos",      35,2,[DR],        2),
    ("2026-01-14","08:00","14:00", 8,"Recreación acuática",    "Melgar",  "Adultos",      18,3,[IS,B],      3),

    # Jueves Jan 15
    ("2026-01-15","08:00","15:00", 9,"Team building",          "Ibagué",  "Adultos",      55,4,[A,M],       4),
    ("2026-01-15","08:00","17:00",10,"Festival comunitario",   "Ibagué",  "Mixto",        90,5,[S,C],       5),
    ("2026-01-15","08:00","16:00",11,"Actividad deportiva",    "Espinal", "Jóvenes",      42,6,[N,DRU,MA],  6),
    ("2026-01-15","08:00","14:00",12,"Evento infantil",        "Honda",   "Niños",        48,7,[J,G],       7),
    ("2026-01-15","09:00","16:00",13,"Recreación empresarial", "Ibagué",  "Adultos",      40,8,[AN,JD],     8),
    ("2026-01-15","08:00","15:00",14,"Team building",          "Ibagué",  "Adultos",      30,9,[DR],        9),
    ("2026-01-15","09:00","15:00", 0,"Festival comunitario",   "Ibagué",  "Mixto",        35,0,[D],         10),

    # Viernes Jan 16
    ("2026-01-16","08:00","15:00", 1,"Recreación empresarial", "Ibagué",  "Adultos",      60,1,[A,M],       11),
    ("2026-01-16","08:00","17:00", 2,"Team building",          "Ibagué",  "Adultos",      68,2,[S,N,C],     0),
    ("2026-01-16","08:00","16:00", 3,"Festival comunitario",   "Espinal", "Mixto",        80,3,[MA,DRU],    1),
    ("2026-01-16","09:00","15:00", 4,"Actividad deportiva",    "Ibagué",  "Jóvenes",      28,4,[IS],        2),
    ("2026-01-16","09:00","16:00", 5,"Evento infantil",        "Ibagué",  "Niños",        45,5,[AN],        3),
    ("2026-01-16","08:00","15:00", 6,"Recreación empresarial", "Honda",   "Adultos",      52,6,[JD,DR],     4),

    # Sábado Jan 17
    ("2026-01-17","09:00","16:00", 7,"Festival comunitario",   "Ibagué",  "Mixto",       105,7,[A,M],       5),
    ("2026-01-17","09:00","18:00", 8,"Recreación empresarial", "Ibagué",  "Adultos",     115,8,[S,N,C,MA],  6),
    ("2026-01-17","08:00","16:00", 9,"Actividad deportiva",    "Espinal", "Jóvenes",      50,9,[DRU],       7),
    ("2026-01-17","09:00","16:00",10,"Evento infantil",        "Ibagué",  "Niños",        62,0,[AN,JD],     8),
    ("2026-01-17","08:00","15:00",11,"Team building",          "Honda",   "Adultos",      42,1,[DR],        9),
    ("2026-01-17","09:00","15:00",12,"Recreación acuática",    "Melgar",  "Adultos",      28,2,[G,IS,B],    10),
    ("2026-01-17","10:00","16:00",13,"Evento infantil",        "Ibagué",  "Niños",        38,3,[D,J],       11),

    # ================================================================
    # SEMANA 3 — Jan 19-24
    # ================================================================

    # Lunes Jan 19
    ("2026-01-19","08:00","15:00",14,"Team building",          "Ibagué",  "Adultos",      78,4,[A,S],       0),
    ("2026-01-19","08:00","16:00", 0,"Recreación empresarial", "Ibagué",  "Adultos",      62,5,[M,N,C],     1),
    ("2026-01-19","09:00","17:00", 1,"Actividad deportiva",    "Espinal", "Jóvenes",      42,6,[MA,DRU],    2),
    ("2026-01-19","09:00","16:00", 2,"Evento infantil",        "Ibagué",  "Niños",        58,7,[AN,JD],     3),
    ("2026-01-19","08:00","15:00", 3,"Festival comunitario",   "Honda",   "Mixto",        88,8,[DR],        4),
    ("2026-01-19","08:00","14:00", 4,"Evento infantil",        "Ibagué",  "Niños",        32,9,[G],         5),
    ("2026-01-19","09:00","14:00", 5,"Recreación acuática",    "Melgar",  "Adultos",      20,0,[IS,B],      6),

    # Martes Jan 20
    ("2026-01-20","08:00","15:00", 6,"Recreación empresarial", "Ibagué",  "Adultos",      52,1,[A,M],       7),
    ("2026-01-20","08:00","17:00", 7,"Festival comunitario",   "Ibagué",  "Mixto",        98,2,[S,C],       8),
    ("2026-01-20","08:00","16:00", 8,"Team building",          "Espinal", "Adultos",      48,3,[N,MA,DRU],  9),
    ("2026-01-20","08:00","14:00", 9,"Evento infantil",        "Ibagué",  "Niños",        52,4,[D,J],       10),
    ("2026-01-20","09:00","16:00",10,"Actividad deportiva",    "Ibagué",  "Jóvenes",      32,5,[AN],        11),
    ("2026-01-20","08:00","15:00",11,"Recreación empresarial", "Honda",   "Adultos",      42,6,[JD,DR],     0),

    # Miércoles Jan 21
    ("2026-01-21","08:00","15:00",12,"Recreación empresarial", "Ibagué",  "Adultos",      58,7,[A,M],       1),
    ("2026-01-21","08:00","17:00",13,"Team building",          "Ibagué",  "Adultos",      72,8,[S,N],       2),
    ("2026-01-21","08:00","16:00",14,"Actividad deportiva",    "Espinal", "Jóvenes",      38,9,[C,DRU],     3),
    ("2026-01-21","08:00","16:00", 0,"Festival comunitario",   "Ibagué",  "Mixto",        78,0,[MA],        4),
    ("2026-01-21","09:00","15:00", 1,"Evento infantil",        "Ibagué",  "Niños",        42,1,[G,D],       5),
    ("2026-01-21","08:00","15:00", 2,"Recreación empresarial", "Honda",   "Adultos",      48,2,[AN,JD],     6),
    ("2026-01-21","08:00","15:00", 3,"Team building",          "Ibagué",  "Adultos",      38,3,[DR],        7),
    ("2026-01-21","08:00","14:00", 4,"Recreación acuática",    "Melgar",  "Adultos",      22,4,[IS],        8),

    # Jueves Jan 22
    ("2026-01-22","08:00","15:00", 5,"Team building",          "Ibagué",  "Adultos",      58,5,[A,M],       9),
    ("2026-01-22","08:00","17:00", 6,"Festival comunitario",   "Ibagué",  "Mixto",        92,6,[S,C],       10),
    ("2026-01-22","08:00","16:00", 7,"Actividad deportiva",    "Espinal", "Jóvenes",      44,7,[N,DRU,MA],  11),
    ("2026-01-22","08:00","14:00", 8,"Evento infantil",        "Honda",   "Niños",        46,8,[G,J],       0),
    ("2026-01-22","09:00","16:00", 9,"Recreación empresarial", "Ibagué",  "Adultos",      42,9,[AN,JD],     1),
    ("2026-01-22","08:00","15:00",10,"Team building",          "Ibagué",  "Adultos",      32,0,[DR],        2),
    ("2026-01-22","09:00","15:00",11,"Festival comunitario",   "Ibagué",  "Mixto",        38,1,[B],         3),

    # Viernes Jan 23
    ("2026-01-23","08:00","15:00",12,"Recreación empresarial", "Ibagué",  "Adultos",      62,2,[A,M],       4),
    ("2026-01-23","08:00","17:00",13,"Team building",          "Ibagué",  "Adultos",      66,3,[S,N,C],     5),
    ("2026-01-23","08:00","16:00",14,"Festival comunitario",   "Espinal", "Mixto",        82,4,[MA,DRU],    6),
    ("2026-01-23","09:00","15:00", 0,"Actividad deportiva",    "Ibagué",  "Jóvenes",      26,5,[D],         7),
    ("2026-01-23","09:00","16:00", 1,"Evento infantil",        "Ibagué",  "Niños",        44,6,[AN],        8),
    ("2026-01-23","08:00","15:00", 2,"Recreación empresarial", "Honda",   "Adultos",      50,7,[JD,DR],     9),

    # Sábado Jan 24
    ("2026-01-24","09:00","16:00", 3,"Festival comunitario",   "Ibagué",  "Mixto",       108,8,[A,M],       10),
    ("2026-01-24","09:00","18:00", 4,"Recreación empresarial", "Ibagué",  "Adultos",     118,9,[S,N,C,MA],  11),
    ("2026-01-24","08:00","16:00", 5,"Actividad deportiva",    "Espinal", "Jóvenes",      52,0,[DRU],       0),
    ("2026-01-24","09:00","16:00", 6,"Evento infantil",        "Ibagué",  "Niños",        60,1,[AN,JD],     1),
    ("2026-01-24","08:00","15:00", 7,"Team building",          "Honda",   "Adultos",      40,2,[DR],        2),
    ("2026-01-24","09:00","15:00", 8,"Recreación acuática",    "Melgar",  "Adultos",      26,3,[G,IS,B],    3),
    ("2026-01-24","10:00","16:00", 9,"Evento infantil",        "Ibagué",  "Niños",        36,4,[D,J],       4),

    # ================================================================
    # SEMANA 4 — Jan 26-31
    # ================================================================

    # Lunes Jan 26
    ("2026-01-26","08:00","15:00",10,"Team building",          "Ibagué",  "Adultos",      72,5,[A,S],       5),
    ("2026-01-26","08:00","16:00",11,"Recreación empresarial", "Ibagué",  "Adultos",      68,6,[M,N,C],     6),
    ("2026-01-26","09:00","17:00",12,"Actividad deportiva",    "Espinal", "Jóvenes",      44,7,[MA,DRU],    7),
    ("2026-01-26","09:00","16:00",13,"Evento infantil",        "Ibagué",  "Niños",        62,8,[AN,JD],     8),
    ("2026-01-26","08:00","15:00",14,"Festival comunitario",   "Honda",   "Mixto",        92,9,[DR],        9),
    ("2026-01-26","08:00","14:00", 0,"Evento infantil",        "Ibagué",  "Niños",        28,0,[G,D],       10),
    ("2026-01-26","09:00","14:00", 1,"Recreación acuática",    "Melgar",  "Adultos",      24,1,[IS,J],      11),

    # Martes Jan 27
    ("2026-01-27","08:00","15:00", 2,"Recreación empresarial", "Ibagué",  "Adultos",      54,2,[A,M],       0),
    ("2026-01-27","08:00","17:00", 3,"Festival comunitario",   "Ibagué",  "Mixto",        96,3,[S,C],       1),
    ("2026-01-27","08:00","16:00", 4,"Team building",          "Espinal", "Adultos",      46,4,[N,MA,DRU],  2),
    ("2026-01-27","08:00","14:00", 5,"Evento infantil",        "Ibagué",  "Niños",        54,5,[B],         3),
    ("2026-01-27","09:00","16:00", 6,"Actividad deportiva",    "Ibagué",  "Jóvenes",      34,6,[AN],        4),
    ("2026-01-27","08:00","15:00", 7,"Recreación empresarial", "Honda",   "Adultos",      44,7,[JD,DR],     5),
    ("2026-01-27","09:00","15:00", 8,"Festival comunitario",   "Ibagué",  "Mixto",        58,8,[D],         6),

    # Miércoles Jan 28
    ("2026-01-28","08:00","15:00", 9,"Recreación empresarial", "Ibagué",  "Adultos",      56,9,[A,M],       7),
    ("2026-01-28","08:00","17:00",10,"Team building",          "Ibagué",  "Adultos",      74,0,[S,N],       8),
    ("2026-01-28","08:00","16:00",11,"Actividad deportiva",    "Espinal", "Jóvenes",      36,1,[C,DRU],     9),
    ("2026-01-28","08:00","16:00",12,"Festival comunitario",   "Ibagué",  "Mixto",        76,2,[MA],        10),
    ("2026-01-28","09:00","15:00",13,"Evento infantil",        "Ibagué",  "Niños",        44,3,[G,IS],      11),
    ("2026-01-28","08:00","15:00",14,"Recreación empresarial", "Honda",   "Adultos",      46,4,[AN,JD],     0),
    ("2026-01-28","08:00","15:00", 0,"Team building",          "Ibagué",  "Adultos",      36,5,[DR],        1),

    # Jueves Jan 29
    ("2026-01-29","08:00","15:00", 1,"Team building",          "Ibagué",  "Adultos",      60,6,[A,M],       2),
    ("2026-01-29","08:00","17:00", 2,"Festival comunitario",   "Ibagué",  "Mixto",        94,7,[S,C],       3),
    ("2026-01-29","08:00","16:00", 3,"Actividad deportiva",    "Espinal", "Jóvenes",      40,8,[N,DRU,MA],  4),
    ("2026-01-29","08:00","14:00", 4,"Evento infantil",        "Honda",   "Niños",        50,9,[G,J],       5),
    ("2026-01-29","09:00","16:00", 5,"Recreación empresarial", "Ibagué",  "Adultos",      44,0,[AN,JD],     6),
    ("2026-01-29","08:00","15:00", 6,"Team building",          "Ibagué",  "Adultos",      34,1,[DR],        7),
    ("2026-01-29","09:00","15:00", 7,"Festival comunitario",   "Ibagué",  "Mixto",        40,2,[D,B],       8),

    # Viernes Jan 30
    ("2026-01-30","08:00","15:00", 8,"Recreación empresarial", "Ibagué",  "Adultos",      64,3,[A,M],       9),
    ("2026-01-30","08:00","17:00", 9,"Team building",          "Ibagué",  "Adultos",      70,4,[S,N,C],     10),
    ("2026-01-30","08:00","16:00",10,"Festival comunitario",   "Espinal", "Mixto",        84,5,[MA,DRU],    11),
    ("2026-01-30","09:00","16:00",11,"Actividad deportiva",    "Ibagué",  "Jóvenes",      30,6,[AN],        0),
    ("2026-01-30","08:00","15:00",12,"Recreación empresarial", "Honda",   "Adultos",      48,7,[JD,DR],     1),
    ("2026-01-30","08:00","14:00",13,"Evento infantil",        "Ibagué",  "Niños",        26,8,[IS],        2),

    # Sábado Jan 31
    ("2026-01-31","09:00","16:00",14,"Festival comunitario",   "Ibagué",  "Mixto",       112,9,[A,M],       3),
    ("2026-01-31","09:00","18:00", 0,"Recreación empresarial", "Ibagué",  "Adultos",     122,0,[S,N,C,MA],  4),
    ("2026-01-31","08:00","16:00", 1,"Actividad deportiva",    "Espinal", "Jóvenes",      54,1,[DRU],       5),
    ("2026-01-31","09:00","16:00", 2,"Evento infantil",        "Ibagué",  "Niños",        64,2,[AN,JD],     6),
    ("2026-01-31","08:00","15:00", 3,"Team building",          "Honda",   "Adultos",      46,3,[DR],        7),
    ("2026-01-31","09:00","15:00", 4,"Recreación acuática",    "Melgar",  "Adultos",      24,4,[G,IS,B,J],  8),
    ("2026-01-31","10:00","16:00", 5,"Evento infantil",        "Ibagué",  "Niños",        34,5,[D],         9),
]


def calc_h(ini, fin):
    h1, m1 = map(int, ini.split(':'))
    h2, m2 = map(int, fin.split(':'))
    return round(((h2 * 60 + m2) - (h1 * 60 + m1)) / 60, 1)


def seed():
    db = SessionLocal()
    try:
        # Limpiar solicitudes previas
        db.query(Solicitud).delete()
        db.execute(text("DELETE FROM solicitud_recreadores"))
        db.commit()

        created = 0
        for i, ev in enumerate(EVENTOS):
            fecha, inicio, fin, emp_i, tipo_s, ciudad, tipo_p, personas, cont_i, recs, obs_i = ev
            empresa = EMPRESAS[emp_i % len(EMPRESAS)]
            contacto, telefono = CONTACTOS[cont_i % len(CONTACTOS)]
            obs = OBS[obs_i % len(OBS)]
            horas = calc_h(inicio, fin)

            # tipo_hora_extra si supera 42h (el servicio lo usa para clasificar)
            # Lo asignamos solo para los recreadores "ALTO" en eventos largos
            tipo_hora_extra = None
            if horas >= 9 and any(r in [S, N, C, MA, DRU] for r in recs):
                tipo_hora_extra = "diurnas"

            sol = Solicitud(
                empresa=empresa,
                fecha_evento=fecha,
                hora_inicio=inicio,
                hora_fin=fin,
                ciudad=ciudad,
                direccion=f"Sede {empresa} — {ciudad}",
                cantidad_recreadores=len(recs),
                cantidad_personas=personas,
                tipo_publico=tipo_p,
                tipo_servicio=tipo_s,
                contacto=contacto,
                telefono_email=telefono,
                telefono_email_2=None,
                observaciones=f"Servicio programado para {empresa}.",
                observacion_final=obs,
                estado="finalizado",
                recreador_id=recs[0],
                tipo_hora_extra=tipo_hora_extra,
                user_id=EMPRESA_ID,
            )
            db.add(sol)
            db.flush()

            # Asignar recreadores (many-to-many)
            recreador_objs = db.query(User).filter(User.id.in_(recs)).all()
            sol.recreadores = recreador_objs

            created += 1

        db.commit()
        print(f"\n✓ {created} solicitudes creadas correctamente.\n")

        # Resumen de horas por recreador
        print("--- Resumen horas enero 2026 por recreador ---")
        from collections import defaultdict
        horas_rec = defaultdict(float)
        solicitudes = db.query(Solicitud).filter(Solicitud.estado == "finalizado").all()
        for sol in solicitudes:
            h = calc_h(sol.hora_inicio, sol.hora_fin)
            for rec in sol.recreadores:
                horas_rec[rec.full_name or rec.username] += h

        for nombre, horas in sorted(horas_rec.items(), key=lambda x: -x[1]):
            categoria = "ALTO  " if horas > 160 else ("EXACTO" if horas > 140 else "BAJO  ")
            print(f"  [{categoria}] {nombre:<30} {horas:>6.1f}h")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
