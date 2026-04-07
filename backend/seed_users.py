"""Script para crear/actualizar usuarios iniciales en la base de datos."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.core.database import Base
from app.models.user import User
from app.core.security import get_password_hash

Base.metadata.create_all(bind=engine)

USUARIOS = [
    # ── Super Admin ──────────────────────────────────────────────────────────
    {
        "username": "adriana.barbosa",
        "email": "adriana.barbosa@comfenalcotolima.com",
        "password": "adriana123",
        "full_name": "Adriana Barbosa",
        "empresa": "Comfenalco Tolima",
        "cargo": "Jefe de Recreación",
        "is_super_admin": True,
        "is_admin": True,
        "is_recreador": False,
        "is_promotor": False,
    },
    # ── Admin (Secretaria) ────────────────────────────────────────────────────
    {
        "username": "jennifer",
        "email": "jennifer@comfenalcotolima.com",
        "password": "admin123",
        "full_name": "Jennifer",
        "empresa": "Comfenalco Tolima",
        "cargo": "Secretaria de Recreación",
        "is_super_admin": False,
        "is_admin": True,
        "is_recreador": False,
        "is_promotor": False,
    },
    # ── Promotores Comerciales ────────────────────────────────────────────────
    {
        "username": "promotor1",
        "email": "promotor1@comfenalcotolima.com",
        "password": "promotor123",
        "full_name": "Laura Gómez",
        "empresa": "Comfenalco Tolima",
        "cargo": "Promotor Comercial",
        "is_super_admin": False,
        "is_admin": False,
        "is_recreador": False,
        "is_promotor": True,
    },
    # ── Recreadores ──────────────────────────────────────────────────────────
    {
        "username": "gabriel.vaquiro",
        "email": "gabriel.vaquiro@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Gabriel Vaquiro",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "andres.garcia",
        "email": "andres.garcia@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Andres Garcia",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "sebastian.leguizamon",
        "email": "sebastian.leguizamon@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Sebastian Leguizamon",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "dalma.suarez",
        "email": "dalma.suarez@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Dalma Suarez",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "johny.fandino",
        "email": "johny.fandino@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Johny Fandiño Guia",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "mercedes.leal",
        "email": "mercedes.leal@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Mercedes Leal",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "nestor.villa",
        "email": "nestor.villa@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Nestor Villa",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "angie.rojas",
        "email": "angie.rojas@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Angie Rojas",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "camilo.pena",
        "email": "camilo.pena@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Camilo Peña",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "issa.paez",
        "email": "issa.paez@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Issa Paez",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "juan.daniel",
        "email": "juan.daniel@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Juan Daniel",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "mauricio.arias",
        "email": "mauricio.arias@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Mauricio Arias",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "daniel.rincon",
        "email": "daniel.rincon@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Daniel Rincon",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "daniel.ruiz",
        "email": "daniel.ruiz@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Daniel Ruiz",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
    {
        "username": "brayan.botero",
        "email": "brayan.botero@comfenalcotolima.com",
        "password": "recreador123",
        "full_name": "Brayan Botero",
        "empresa": "Comfenalco Tolima",
        "cargo": "Recreador",
        "is_super_admin": False, "is_admin": False,
        "is_recreador": True, "is_promotor": False,
    },
]

# Usuario viejo "admin" → renombrar a jennifer si existe
RENAMES = {
    "admin": "jennifer",
}

def seed():
    db = SessionLocal()
    try:
        # Renombrar usuarios legados
        for old_username, new_username in RENAMES.items():
            old_user = db.query(User).filter(User.username == old_username).first()
            new_user = db.query(User).filter(User.username == new_username).first()
            if old_user and not new_user:
                old_user.username = new_username
                old_user.full_name = "Jennifer"
                old_user.email = "jennifer@comfenalcotolima.com"
                old_user.cargo = "Secretaria de Recreación"
                old_user.is_super_admin = False
                db.commit()
                print(f"↪ Renombrado: {old_username} → {new_username}")

        # Crear o actualizar usuarios
        for u in USUARIOS:
            existing = db.query(User).filter(User.username == u["username"]).first()
            if not existing:
                user = User(
                    username=u["username"],
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    full_name=u["full_name"],
                    empresa=u["empresa"],
                    cargo=u.get("cargo"),
                    is_active=True,
                    is_admin=u["is_admin"],
                    is_recreador=u["is_recreador"],
                    is_promotor=u.get("is_promotor", False),
                    is_super_admin=u.get("is_super_admin", False),
                )
                db.add(user)
                rol = u.get("cargo") or ("empresa" if not any([u["is_admin"], u["is_recreador"], u.get("is_promotor")]) else "")
                print(f"✓ [{rol}] {u['username']} / {u['password']}")
            else:
                # Actualizar cargo e is_super_admin si faltan
                changed = False
                if existing.cargo != u.get("cargo"):
                    existing.cargo = u.get("cargo")
                    changed = True
                if existing.is_super_admin != u.get("is_super_admin", False):
                    existing.is_super_admin = u.get("is_super_admin", False)
                    changed = True
                if changed:
                    print(f"↻ Actualizado: {u['username']}")

        db.commit()
        print("\n✓ Base de datos inicializada correctamente.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
