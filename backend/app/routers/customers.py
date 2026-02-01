from fastapi import APIRouter
from app.core.database import supabase
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/customers", tags=["Customers"])

class Customer(BaseModel):
    id: str # We will use first order_id or user_id if available as unique key for list
    full_name: str
    email: str
    total_spent: float
    order_count: int
    last_order_date: str

@router.get("/", response_model=List[Customer])
def get_customers():
    # Fetch all orders
    res = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    
    if not res.data:
        return []

    # Group by email to simulate "Customer Profiles"
    # In a real app with Auth, we would query the Users table, but this works for Order-based customers
    customers_map = {}

    for order in res.data:
        email = order["email"]
        if email not in customers_map:
            customers_map[email] = {
                "id": order["user_id"] or order["id"], # Use user_id if present, else order id
                "full_name": order["full_name"],
                "email": email,
                "total_spent": 0.0,
                "order_count": 0,
                "last_order_date": order["created_at"]
            }
        
        customers_map[email]["total_spent"] += order["total_amount"]
        customers_map[email]["order_count"] += 1
        # Since orders are sorted desc, the first time we see an email is the latest order
    
    # Convert to list
    customers = [
        Customer(
            id=str(data["id"]),
            full_name=data["full_name"],
            email=data["email"],
            total_spent=round(data["total_spent"], 2),
            order_count=data["order_count"],
            last_order_date=data["last_order_date"]
        )
        for data in customers_map.values()
    ]
    
    return customers
