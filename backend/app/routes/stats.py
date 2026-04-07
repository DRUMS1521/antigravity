from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.services.stats_service import get_stats_recreador, get_stats_admin, get_stats_empresarial
from app.models.user import User

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/recreador")
def stats_recreador(
    fecha_desde: Optional[str] = None,
    fecha_hasta: Optional[str] = None,
    tipo_servicio: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_recreador and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    rid = current_user.id
    return get_stats_recreador(db, rid, fecha_desde, fecha_hasta, tipo_servicio)


@router.get("/admin")
def stats_admin(
    fecha_desde: Optional[str] = None,
    fecha_hasta: Optional[str] = None,
    tipo_servicio: Optional[str] = None,
    recreador_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    return get_stats_admin(db, fecha_desde, fecha_hasta, tipo_servicio, recreador_id)


@router.get("/empresarial")
def stats_empresarial(
    fecha_desde: Optional[str] = None,
    fecha_hasta: Optional[str] = None,
    tipo_servicio: Optional[str] = None,
    empresa: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    return get_stats_empresarial(db, fecha_desde, fecha_hasta, tipo_servicio, empresa)
