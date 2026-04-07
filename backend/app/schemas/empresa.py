from pydantic import BaseModel
from datetime import datetime


class EmpresaCreate(BaseModel):
    nombre: str
    nit: str


class EmpresaResponse(BaseModel):
    id: int
    nombre: str
    nit: str
    created_at: datetime

    class Config:
        from_attributes = True
