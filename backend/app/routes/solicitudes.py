from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.solicitud import SolicitudCreate, SolicitudResponse, SolicitudUpdate, FinalizarRequest
from app.services.auth_service import get_current_user
from app.services.solicitud_service import (
    create_solicitud, get_solicitudes, get_solicitud_by_id, update_solicitud_estado, finalizar_solicitud
)
from app.models.user import User

router = APIRouter(prefix="/solicitudes", tags=["solicitudes"])


@router.post("/", response_model=SolicitudResponse, status_code=status.HTTP_201_CREATED)
def crear_solicitud(
    solicitud: SolicitudCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_solicitud(db, solicitud, current_user.id)


@router.get("/", response_model=List[SolicitudResponse])
def listar_solicitudes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.is_admin:
        return get_solicitudes(db)
    if current_user.is_recreador:
        return get_solicitudes(db, recreador_id=current_user.id)
    return get_solicitudes(db, user_id=current_user.id)


@router.get("/{solicitud_id}", response_model=SolicitudResponse)
def obtener_solicitud(
    solicitud_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sol = get_solicitud_by_id(db, solicitud_id)
    if not sol:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    if not current_user.is_admin and sol.user_id != current_user.id and sol.recreador_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")
    return sol


@router.patch("/{solicitud_id}/finalizar", response_model=SolicitudResponse)
def finalizar(
    solicitud_id: int,
    data: FinalizarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_recreador and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        result = finalizar_solicitud(
            db, solicitud_id,
            recreador_id=current_user.id,
            observacion=data.observacion or "",
            skip_auth=current_user.is_admin,
        )
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not result:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    return result


@router.patch("/{solicitud_id}/estado", response_model=SolicitudResponse)
def cambiar_estado(
    solicitud_id: int,
    data: SolicitudUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    sol = update_solicitud_estado(db, solicitud_id, data.estado, data.recreador_ids, data.tipo_hora_extra)
    if not sol:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    return sol
