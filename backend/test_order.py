import requests
import json

def test():
    # 1. Get Product
    try:
        r = requests.get("http://localhost:8001/api/products/public")
        products = r.json()
        if not products:
            print("No products found")
            return
        
        p = products[0]
        print(f"Product: {p['id']} - Stock: {p['stock']}")
        
        # 2. Create Order
        payload = {
            "user_id": None,
            "items": [{
                "product_id": p['id'],
                "quantity": 1,
                "price": float(p['price'])
            }],
            "total_amount": float(p['price']),
            "shipping_address": {
                "fullName": "Test User",
                "email": "test@example.com",
                "address": "123 Street",
                "city": "Test City",
                "zipCode": "12345"
            },
            "payment_method": "Card"
        }
        
        print("Sending payload:", json.dumps(payload, indent=2))
        
        r2 = requests.post("http://localhost:8001/api/orders", json=payload)
        print(f"Status: {r2.status_code}")
        print("Response:", r2.text)
        
    except Exception as e:
        print(e)

if __name__ == "__main__":
    test()
