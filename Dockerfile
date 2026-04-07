FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/app ./app

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "app.main:app", "--workers", "2", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
