# 🛰️ Immich Addon: Spacey

**Spacey** is a FastAPI + React addon for [Immich](https://github.com/immich-app/immich) that helps you preview, sort by size, and delete large media files directly from your Immich library via API.

---

## ✨ Features

- 🔍 Preview and browse large media files (images/videos)
- 📏 Sort media by file size
- 🧹 Delete media directly via Immich's API
- ⚡ Modern React UI (Vite-based)
- 🔐 Secure – API keys and configs are injected at runtime

---

## 📦 Run via Docker Hub (Production Setup)

1. 🧩 Add to your `docker-compose.yml`:

```yaml
  spacey_backend:
    image: skowdley/immich-addon-spacey-backend:latest
    container_name: spacey_backend
    restart: unless-stopped
    ports:
      - "${BACKEND_PORT:-8000}:8000"
    env_file:
      - .env

  spacey_frontend:
    image: skowdley/immich-addon-spacey-frontend:latest
    container_name: spacey_frontend
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-8080}:80"
    environment:
      - VITE_BACKEND_URL=${VITE_BACKEND_URL}
      - VITE_API_KEY=${VITE_API_KEY}
      - VITE_IMMICH_PUBLIC_URL=${VITE_IMMICH_PUBLIC_URL}
    depends_on:
      - spacey_backend
```
2. ⚙️ Update your .env:
```env
VITE_API_KEY=your-immich-api-key
VITE_IMMICH_PUBLIC_URL=http://your-immich-instance:2283
VITE_BACKEND_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:8080

# Optional
FRONTEND_PORT=8080
BACKEND_PORT=8000
```
3. 🚀 Run it:
docker-compose up -d
Then open http://localhost:8080 in your browser.

## 👨‍💻 Build from Source (Dev Setup)
If you prefer building it yourself:

1. 📥 Clone the repo
```yaml
git clone https://github.com/dreamtheater39/immich-addon-spacey.git
cd immich-addon-spacey
```
3. 📄 Create a .env file
```yaml
cp .env.example .env
Edit and fill in your Immich API details
```
4. 🛠 Run with Docker Compose
```yaml
docker-compose up --build
Frontend: http://localhost:8080
Backend: http://localhost:8000
```
