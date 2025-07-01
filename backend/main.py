import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
from backend.db import get_largest_assets, Session

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS setup
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ENV
API_KEY = os.getenv("VITE_API_KEY")
IMMICH_API_KEY = os.getenv("IMMICH_API_KEY")
IMMICH_API_URL = os.getenv("IMMICH_API_URL")

print(f"✅  Using IMMICH_DB_URL = {os.getenv('IMMICH_DB_URL')}")
print(f"✅ API_KEY={API_KEY}")
print(f"✅ IMMICH_API_KEY={'✓' if IMMICH_API_KEY else '❌'}")
print(f"✅ IMMICH_API_URL={IMMICH_API_URL}")

@app.middleware("http")
async def verify_api_key(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    if request.url.path.startswith("/media") and request.headers.get("x-api-key") != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return await call_next(request)

@app.get("/media/large")
def get_large(limit: int = 100, sort: str = "size", offset: int = 0):
    print(f"🔍 Querying assets: limit={limit}, sort={sort}, offset={offset}")
    return get_largest_assets(limit, sort, offset)

@app.get("/media/preview/{asset_id}")
def preview_asset(asset_id: str):
    result = Session().execute(text("""
        SELECT
            a.id,
            a."originalFileName" AS name,
            a."createdAt" AS created_at,
            a."originalPath" AS path,
            a.type,
            ex."fileSizeInByte" AS size
        FROM "assets" a
        LEFT JOIN "exif" ex ON ex."assetId" = a.id
        WHERE a.id = :asset_id
    """), {"asset_id": asset_id}).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Asset not found")
    return dict(result._mapping)

@app.delete("/media/{asset_id}")
def delete_asset(asset_id: str):
    print(f"🗑️ Deleting asset: {asset_id}")

    if not IMMICH_API_KEY or not IMMICH_API_URL:
        raise HTTPException(status_code=500, detail="IMMICH_API_URL or IMMICH_API_KEY not set")

    url = f"{IMMICH_API_URL}/api/assets"
    headers = {
        "x-api-key": IMMICH_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {"force": True, "ids": [asset_id]}

    print(f"📤 Sending DELETE to {url} with payload: {payload}")

    try:
        response = requests.delete(url, headers=headers, json=payload)
        print(f"📡 Immich responded: {response.status_code} - {response.text}")
        if response.status_code not in (200, 204):
            raise HTTPException(status_code=500, detail="Failed to delete asset")
    except Exception as e:
        print(f"🔥 Delete failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete asset")

    return {"status": "deleted", "id": asset_id}

@app.get("/media/stream/{asset_id}")
def stream_asset(asset_id: str):
    return RedirectResponse(f"{IMMICH_API_URL}/api/asset/{asset_id}/stream")
