from pydantic import BaseModel, Field

class OrderCreateRequest(BaseModel):
    amount: int = Field(..., gt=0, description="Amount in paise (e.g. 1000 for ₹10)")
    currency: str = Field(default="INR", description="Currency code")

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
