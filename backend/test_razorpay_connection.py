
import razorpay
import os
from dotenv import load_dotenv

load_dotenv()

key_id = os.getenv("RAZORPAY_KEY_ID")
key_secret = os.getenv("RAZORPAY_KEY_SECRET")

print(f"Checking keys: ID={key_id}, Secret={'*' * len(key_secret) if key_secret else 'None'}")

if not key_id or not key_secret:
    print("Error: Keys missing")
    exit(1)

client = razorpay.Client(auth=(key_id, key_secret))

data = {
    "amount": 100,  # 1 rupee
    "currency": "INR",
    "receipt": "test_receipt_001",
    "payment_capture": 1
}

try:
    order = client.order.create(data=data)
    print("Success! Order created:")
    print(order)
except Exception as e:
    print(f"Error creating order: {e}")
