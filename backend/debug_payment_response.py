import requests

response = requests.post("http://localhost:8001/api/payments/create-order", json={"amount": 100, "currency": "INR"})
print(response.json())
