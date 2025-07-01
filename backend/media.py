import os
from dotenv import load_dotenv

load_dotenv()

UPLOAD_ROOT = os.getenv("UPLOAD_LOCATION")

def delete_file(relative_path: str) -> bool:
    try:
        # Normalize double "upload/" if it occurs
        if relative_path.startswith("upload/"):
            relative_path = relative_path[len("upload/"):]

        full_path = os.path.join(UPLOAD_ROOT, relative_path)

        print(f"🗑️ Attempting to delete: {full_path}")
        os.remove(full_path)
        return True
    except Exception as e:
        print(f"❌ Error deleting file: {e}")
        return False
