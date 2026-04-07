from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime

ESTADOS_VALIDOS = ["pendiente", "programado", "por corregir", "eliminado", "finalizado"]


class RecreadorInfo(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None

    class Config:
        orm_mode = True


class SolicitudCreate(BaseModel):
    empresa: str
    fecha_evento: str
    hora_inicio: str
    hora_fin: str
    ciudad: str
    direccion: str
    cantidad_recreadores: int
    cantidad_personas: int
    tipo_publico: str
    tipo_servicio: str
    contacto: str
    telefono_email: str
    telefono_email_2: Optional[str] = None
    observaciones: Optional[str] = None

    @validator("cantidad_recreadores", "cantidad_personas")
    def must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Debe ser mayor a 0")
        return v


class SolicitudResponse(BaseModel):
    id: int
    empresa: str
    fecha_evento: str
    hora_inicio: str
    hora_fin: str
    ciudad: str
    direccion: str
    cantidad_recreadores: int
    cantidad_personas: int
    tipo_publico: str
    tipo_servicio: str
    contacto: str
    telefono_email: str
    telefono_email_2: Optional[str] = None
    observaciones: Optional[str] = None
    observacion_final: Optional[str] = None
    fecha_finalizacion: Optional[datetime] = None
    estado: str
    tipo_hora_extra: Optional[str] = None
    user_id: int
    user_username: Optional[str] = None
    user_full_name: Optional[str] = None
    user_empresa: Optional[str] = None
    user_email: Optional[str] = None
    recreador_id: Optional[int] = None
    recreador_username: Optional[str] = None
    recreador_full_name: Optional[str] = None
    # Lista completa de recreadores asignados
    recreadores_asignados: List[RecreadorInfo] = []
    created_at: datetime

    class Config:
        orm_mode = True


class FinalizarRequest(BaseModel):
    observacion: Optional[str] = ""


class SolicitudUpdate(BaseModel):
    estado: str
    recreador_ids: Optional[List[int]] = None   # lista de recreadores (reemplaza recreador_id)
    tipo_hora_extra: Optional[str] = None

    @validator("estado")
    def estado_valido(cls, v):
        if v not in ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido. Opciones: {ESTADOS_VALIDOS}")
        return v
