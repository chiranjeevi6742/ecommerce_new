from fastapi import APIRouter, HTTPException
from app.core.database import supabase
from app.models.orders import StockCheckRequest, OrderCreate, OrderResponse, OrderStatusUpdate
from typing import List

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- Helper ---
def check_stock_logic(items):
    errors = []
    for item in items:
        res = supabase.table("products").select("stock, name").eq("id", item.product_id).execute()
        if not res.data:
            errors.append(f"Product ID {item.product_id} not found.")
            continue
        product = res.data[0]
        if product["stock"] < item.quantity:
            errors.append(f"Not enough stock for {product['name']}. Available: {product['stock']}")
    return errors

@router.post("/validate-stock")
def validate_stock(request: StockCheckRequest):
    errors = check_stock_logic(request.items)
    if errors:
        raise HTTPException(status_code=400, detail=errors)
    return {"status": "valid", "message": "All items are in stock."}

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate):
    # 1. Final Stock Validation
    errors = check_stock_logic(order.items)
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    # 2. Create Order Record
    order_data = {
        "user_id": order.user_id,
        "full_name": order.shipping_address.fullName,
        "email": order.shipping_address.email,
        "address": order.shipping_address.address,
        "city": order.shipping_address.city,
        "zip_code": order.shipping_address.zipCode,
        "total_amount": order.total_amount,
        "payment_method": order.payment_method,
        "status": "Pending",
        "transaction_id": order.transaction_id
    }

    res_order = supabase.table("orders").insert(order_data).execute()
    if not res_order.data:
         raise HTTPException(status_code=500, detail="Failed to create order record")
    
    new_order = res_order.data[0]
    order_id = new_order["id"]

    # 3. Create Order Items & Decrement Stock
    # Ideally this would be a transaction.
    try:
        for item in order.items:
            # Insert Item
            item_data = {
                "order_id": order_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price
            }
            supabase.table("order_items").insert(item_data).execute()

            # Decrement Stock
            # Fetch current again to be safe
            p_res = supabase.table("products").select("stock").eq("id", item.product_id).execute()
            if p_res.data:
                current_stock = p_res.data[0]["stock"]
                new_stock = max(0, current_stock - item.quantity)
                supabase.table("products").update({"stock": new_stock}).eq("id", item.product_id).execute()
                
    except Exception as e:
        print(f"Error processing items for order {order_id}: {e}")
        # Note: In a real app we would rollback here
        
    return new_order

@router.get("/", response_model=List[OrderResponse])
def get_all_orders():
    # Admin View
    res = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    return res.data

@router.get("/user/{user_id}", response_model=List[OrderResponse])
def get_user_orders(user_id: str):
    res = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data

@router.patch("/{order_id}/status")
def update_order_status(order_id: str, update: OrderStatusUpdate):
    valid_statuses = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    res = supabase.table("orders").update({"status": update.status}).eq("id", order_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Status updated successfully", "data": res.data[0]}

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: str):
    # Fetch Order
    res = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not res.data:
         raise HTTPException(status_code=404, detail="Order not found")
    
    order = res.data[0]
    
    # Fetch Items with Product Details
    # Using manual merge for reliability
    items_res = supabase.table("order_items").select("*").eq("order_id", order_id).execute()
    items = items_res.data
    
    for item in items:
        prod_res = supabase.table("products").select("name, image_url, description").eq("id", item["product_id"]).execute()
        if prod_res.data:
            item["product"] = prod_res.data[0]
            
    order["items"] = items
    
    return order
