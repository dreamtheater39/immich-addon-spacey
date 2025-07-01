# ---------- Frontend Build Stage ----------
FROM node:20-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

# Pass build-time env vars via --build-arg (populated by docker-compose)
ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

RUN npm run build

# ---------- Backend Stage ----------
FROM python:3.11-slim AS backend

WORKDIR /app

# Install backend deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend ./backend

# Copy frontend build
COPY --from=frontend /app/frontend/dist ./frontend

# Add start script
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8000
EXPOSE 5173

CMD ["./start.sh"]
