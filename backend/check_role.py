
import os
import json
import base64
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("SUPABASE_KEY")

if not token:
    print("No SUPABASE_KEY found")
    exit()

try:
    # JWT is header.payload.signature
    # We want the payload (middle part)
    parts = token.split(".")
    if len(parts) != 3:
        print("Invalid JWT format")
        exit()
    
    payload = parts[1]
    # Add padding if needed
    padding = len(payload) % 4
    if padding:
        payload += "=" * (4 - padding)
        
    decoded = base64.b64decode(payload).decode("utf-8")
    data = json.loads(decoded)
    
    print(f"Role: {data.get('role')}")
    print(f"ISS: {data.get('iss')}")
except Exception as e:
    print(f"Error decoding: {e}")
