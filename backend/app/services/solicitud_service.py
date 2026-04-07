from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import Optional, List
from datetime import date
from app.models.solicitud import Solicitud
from app.models.user import User
from app.schemas.solicitud import SolicitudCreate, SolicitudResponse, RecreadorInfo
from app.services.email_service import send_solicitud_email


def _enrich(sol: Solicitud, db: Session) -> SolicitudResponse:
    """Convierte Solicitud ORM a SolicitudResponse con info de usuarios."""
    data = SolicitudResponse.model_validate(sol)

    creator = db.query(User).filter(User.id == sol.user_id).first()
    if creator:
        data.user_username = creator.username
        data.user_full_name = creator.full_name
        data.user_empresa = creator.empresa
        data.user_email = creator.email

    # Recreador primario (backwards compat)
    if sol.recreador_id:
        recreador = db.query(User).filter(User.id == sol.recreador_id).first()
        if recreador:
            data.recreador_username = recreador.username
            data.recreador_full_name = recreador.full_name

    # Todos los recreadores asignados (many-to-many)
    data.recreadores_asignados = [
        RecreadorInfo(id=r.id, username=r.username, full_name=r.full_name)
        for r in sol.recreadores
    ]

    return data


def create_solicitud(db: Session, data: SolicitudCreate, user_id: int) -> SolicitudResponse:
    solicitud = Solicitud(**data.model_dump(), user_id=user_id)
    db.add(solicitud)
    db.commit()
    db.refresh(solicitud)
    try:
        send_solicitud_email(solicitud)
    except Exception as e:
        print(f"[EMAIL ERROR] No se pudo enviar el correo: {e}")
    return _enrich(solicitud, db)


def get_solicitudes(
    db: Session,
    user_id: Optional[int] = None,
    recreador_id: Optional[int] = None,
) -> List[SolicitudResponse]:
    query = db.query(Solicitud)
    if recreador_id:
        # Recreador ve sus tareas: tanto las del campo primario como las de la tabla many-to-many
        from sqlalchemy import or_
        query = query.filter(
            or_(
                Solicitud.recreador_id == recreador_id,
                Solicitud.recreadores.any(User.id == recreador_id),
            )
        )
    elif user_id:
        query = query.filter(Solicitud.user_id == user_id)
    solicitudes = query.order_by(Solicitud.fecha_evento.asc(), Solicitud.hora_inicio.asc()).all()
    return [_enrich(s, db) for s in solicitudes]


def get_solicitud_by_id(db: Session, solicitud_id: int) -> Optional[SolicitudResponse]:
    sol = db.query(Solicitud).filter(Solicitud.id == solicitud_id).first()
    if not sol:
        return None
    return _enrich(sol, db)


def finalizar_solicitud(
    db: Session,
    solicitud_id: int,
    recreador_id: int,
    observacion: str,
    skip_auth: bool = False,
) -> Optional[SolicitudResponse]:
    sol = db.query(Solicitud).filter(Solicitud.id == solicitud_id).first()
    if not sol:
        return None
    if not skip_auth:
        assigned_ids = {r.id for r in sol.recreadores} | ({sol.recreador_id} if sol.recreador_id else set())
        if recreador_id not in assigned_ids:
            raise PermissionError("No estás asignado a esta solicitud")
    if sol.fecha_evento > str(date.today()):
        raise ValueError("El evento aún no ha ocurrido")
    sol.estado = "finalizado"
    sol.observacion_final = observacion
    sol.fecha_finalizacion = func.now()
    db.commit()
    db.refresh(sol)
    return _enrich(sol, db)


def update_solicitud_estado(
    db: Session,
    solicitud_id: int,
    estado: str,
    recreador_ids: Optional[List[int]] = None,
    tipo_hora_extra: Optional[str] = None,
) -> Optional[SolicitudResponse]:
    sol = db.query(Solicitud).filter(Solicitud.id == solicitud_id).first()
    if not sol:
        return None

    sol.estado = estado

    if estado == "programado" and recreador_ids:
        # Primario = primer recreador de la lista
        sol.recreador_id = recreador_ids[0]
        sol.tipo_hora_extra = tipo_hora_extra

        # Actualizar tabla many-to-many
        recreadores = db.query(User).filter(User.id.in_(recreador_ids)).all()
        sol.recreadores = recreadores
    elif estado not in ("programado", "finalizado"):
        sol.recreador_id = None
        sol.tipo_hora_extra = None
        sol.recreadores = []

    db.commit()
    db.refresh(sol)
    return _enrich(sol, db)
