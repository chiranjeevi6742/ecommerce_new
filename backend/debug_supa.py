from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

print(f"URL: {url}")
print(f"Key Length: {len(key) if key else 0}")
print(f"Key First 10: {key[:10] if key else 'None'}")

try:
    supabase = create_client(url, key)
    response = supabase.table("products").select("*").limit(1).execute()
    print("Success provided!")
    print(response)
except Exception as e:
    print(f"Error: {e}")
