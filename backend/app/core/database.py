from supabase import create_client, Client
import os
from dotenv import load_dotenv, find_dotenv
from pathlib import Path

# Force load from the backend directory
try:
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_path.exists():
        print(f"DEBUG: Loading .env from {env_path}")
        load_dotenv(dotenv_path=env_path)
    else:
        print("DEBUG: No .env file found (expected in production environment)")
except Exception as e:
    print(f"DEBUG: Error accessing .env file: {e}")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print(f"DEBUG: Loading DB connection. URL: {SUPABASE_URL}")
print(f"DEBUG: Key Length: {len(SUPABASE_KEY) if SUPABASE_KEY else 0}")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
