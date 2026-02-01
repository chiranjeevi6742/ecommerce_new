import requests

response = requests.post("http://localhost:8001/api/payments/create-order", json={"amount": 100, "currency": "INR"})
data = response.json()
print(f"Keys in response: {list(data.keys())}")
if "key_id" in data:
    print(f"key_id value: {data['key_id']}")
else:
    print("key_id MISSING")
