from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.empresa import Empresa
from app.schemas.empresa import EmpresaCreate, EmpresaResponse
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/empresas", tags=["empresas"])


@router.get("/", response_model=List[EmpresaResponse])
def listar_empresas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Empresa).order_by(Empresa.created_at.desc()).all()


@router.post("/", response_model=EmpresaResponse, status_code=status.HTTP_201_CREATED)
def crear_empresa(
    data: EmpresaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo el administrador puede registrar empresas")
    existing = db.query(Empresa).filter(Empresa.nit == data.nit).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe una empresa con ese NIT")
    empresa = Empresa(nombre=data.nombre, nit=data.nit)
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.delete("/{empresa_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_empresa(
    empresa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo el administrador puede eliminar empresas")
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    db.delete(empresa)
    db.commit()
