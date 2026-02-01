from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class OrderItemSchema(BaseModel):
    product_id: str
    quantity: int
    price: float 

class ShippingAddress(BaseModel):
    fullName: str
    email: str
    address: str
    city: str
    zipCode: str

class OrderCreate(BaseModel):
    user_id: Optional[str] = None # Will be filled by backend/auth usually, but for now we trust frontend or pass it
    items: List[OrderItemSchema]
    total_amount: float
    shipping_address: ShippingAddress
    payment_method: str
    transaction_id: Optional[str] = None

class OrderItemResponse(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str]
    full_name: str
    email: str
    address: str
    city: str
    zip_code: str
    total_amount: float
    status: str
    payment_method: str
    created_at: datetime
    items: Optional[List[OrderItemResponse]] = None

class StockCheckItem(BaseModel):
    product_id: str
    quantity: int

class StockCheckRequest(BaseModel):
    items: List[StockCheckItem]

class OrderStatusUpdate(BaseModel):
    status: str
