from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.core.database import Base, engine
from app.routes import auth, solicitudes, stats, empresas, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Solo el proceso principal ejecuta esto, evita race condition entre workers
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        pass

    _migrations = [
        "ALTER TABLE users ADD COLUMN is_promotor BOOLEAN DEFAULT 0",
        "ALTER TABLE users ADD COLUMN is_super_admin BOOLEAN DEFAULT 0",
        "ALTER TABLE users ADD COLUMN cargo TEXT",
    ]
    with engine.connect() as conn:
        for sql in _migrations:
            try:
                conn.execute(text(sql))
                conn.commit()
            except Exception:
                pass

    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="API para gestión de solicitudes de servicios de recreación",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(solicitudes.router)
app.include_router(stats.router)
app.include_router(empresas.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"message": f"API {settings.APP_NAME} funcionando correctamente", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
