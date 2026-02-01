from fastapi import APIRouter, HTTPException, status
from app.models.payment import OrderCreateRequest, PaymentVerifyRequest
from app.core.database import supabase
import razorpay
import os

router = APIRouter()

@router.post("/payments/create-order")
async def create_order(request: OrderCreateRequest):
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")

    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay configuration missing")

    client = razorpay.Client(auth=(key_id, key_secret))

    data = {
        "amount": request.amount,
        "currency": request.currency,
        "receipt": "order_rcptid_11", 
        "payment_capture": 1
    }

    try:
        order = client.order.create(data=data)
        return {**order, "key_id": key_id}
    except Exception as e:
        print(f"Error creating Razorpay order: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate payment provider.")

@router.post("/payments/verify-payment")
async def verify_payment(request: PaymentVerifyRequest):
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")

    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay configuration missing")

    client = razorpay.Client(auth=(key_id, key_secret))

    try:
        # 1. Verify Signature
        params_dict = {
            'razorpay_order_id': request.razorpay_order_id,
            'razorpay_payment_id': request.razorpay_payment_id,
            'razorpay_signature': request.razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)

        # 2. Update Order Status in DB
        # We assume the 'transaction_id' column in 'orders' table holds the razorpay_order_id
        
        # DEBUG: Check if order exists first
        print(f"DEBUG: Verifying payment for Order ID (transaction_id): {request.razorpay_order_id}")
        existing = supabase.table("orders").select("*").eq("transaction_id", request.razorpay_order_id).execute()
        
        if not existing.data:
             print(f"ERROR: Order with transaction_id {request.razorpay_order_id} NOT FOUND in DB.")
             # Raise error to frontend so it knows verification failed logically
             raise HTTPException(status_code=404, detail="Order record not found for this payment")
        
        print(f"DEBUG: Order found: {existing.data[0]['id']}. Updating status...")

        res = supabase.table("orders").update({
            "status": "Paid", 
            "payment_method": "Razorpay" 
        }).eq("transaction_id", request.razorpay_order_id).execute()

        if not res.data:
             print(f"ERROR: Update returned no data for {request.razorpay_order_id}.")
        else:
             print(f"SUCCESS: Order {res.data[0]['id']} marked as Paid.")

        return {"status": "success", "message": "Payment verified and order updated"}

    except razorpay.errors.SignatureVerificationError:
         print(f"Error: Signature Verification Failed for order {request.razorpay_order_id}")
         raise HTTPException(status_code=400, detail="Payment verification failed: Invalid signature")
    except Exception as e:
        print(f"Internal Error during verification: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during payment verification.")
