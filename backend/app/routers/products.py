from fastapi import APIRouter, HTTPException
from app.core.database import supabase
from app.models.products import ProductCreate, ProductUpdate, ProductResponse
from typing import List

router = APIRouter(prefix="/products", tags=["Result"])

@router.get("/", response_model=List[ProductResponse])
def get_products():
    res = supabase.table("products").select("*").order("created_at", desc=True).execute()
    return res.data

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate):
    # Convert Decimal to float for JSON serialization if needed by supabase-py, 
    # but normally pydantic handles it. 
    # Supabase expects dict.
    product_data = product.model_dump(mode='json')
    
    res = supabase.table("products").insert(product_data).execute()
    
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
        
    return res.data[0]

@router.get("/{id}", response_model=ProductResponse)
def get_product(id: str):
    res = supabase.table("products").select("*").eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return res.data[0]

@router.put("/{id}", response_model=ProductResponse)
def update_product(id: str, product: ProductUpdate):
    product_data = product.model_dump(mode='json')
    res = supabase.table("products").update(product_data).eq("id", id).execute()
    if not res.data:
         raise HTTPException(status_code=404, detail="Product not found")
    return res.data[0]

@router.delete("/{id}")
def delete_product(id: str):
    res = supabase.table("products").delete().eq("id", id).execute()
    return {"message": "Product deleted"}
