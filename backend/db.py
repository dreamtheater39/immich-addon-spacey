import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.getenv("IMMICH_DB_URL")

if not DB_URL:
    print("❌ IMMICH_DB_URL not set. Check your .env file.")
else:
    print(f"✅ Using IMMICH_DB_URL = {DB_URL}")

try:
    engine = create_engine(DB_URL)
    Session = sessionmaker(bind=engine)
except Exception as e:
    print(f"🔥 Failed to connect to database: {e}")
    raise

def get_largest_assets(limit=100, sort="size", offset=0):
    allowed_sort_fields = {
        "name": 'a."originalFileName"',
        "size": 'ex."fileSizeInByte"',
        "type": 'a."type"',
        "created_at": 'a."createdAt"',
    }
    sort_column = allowed_sort_fields.get(sort, 'ex."fileSizeInByte"')

    query = text(f"""
        SELECT
            a.id,
            a."originalPath" AS path,
            a."originalFileName" AS name,
            a.type,
            a."createdAt" AS created_at,
            COALESCE(ex."fileSizeInByte", 0) AS size
        FROM "assets" a
        LEFT JOIN "exif" ex ON ex."assetId" = a.id
        WHERE ex."fileSizeInByte" IS NOT NULL
        ORDER BY {sort_column} DESC
        LIMIT :limit
        OFFSET :offset
    """)

    print(f"🔍 Executing query with limit={limit}, offset={offset}, sort='{sort}'")

    try:
        with Session() as session:
            result = session.execute(query, {"limit": limit, "offset": offset}).fetchall()
            assets = [dict(row._mapping) for row in result]
            print(f"✅ Fetched {len(assets)} assets")
            return assets
    except Exception as e:
        print(f"🔥 Error in get_largest_assets: {e}")
        raise
