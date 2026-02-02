from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.core.database import supabase
from app.routers import products, orders, analytics, customers, payments

load_dotenv()

app = FastAPI(title="Institute E-Commerce API", version="1.0.0")

# Enable CORS for Frontend
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://insti-shop.vercel.app").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(payments.router, prefix="/api")

@app.get("/")
def health_check():
    try:
        # Simple query to check DB connection
        response = supabase.table("products").select("id").limit(1).execute()
        return {"status": "healthy", "db_connection": "active"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
