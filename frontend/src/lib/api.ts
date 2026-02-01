const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

export async function createRazorpayOrder(amount: number, currency: string = "INR") {
    // Note: Backend expects generic 'amount', we assume frontend passes the raw value backend expects.
    // However, backend wrapper for razorpay usually expects paise.
    // Let's assume the frontend passes the amount in PAISE if the backend doesn't multiply it.
    // Looking at backend code: "amount": request.amount. It passes directly.
    // So we must pass PAISE here.
    const res = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency }),
    });
    if (!res.ok) {
        throw new Error("Failed to create Razorpay order");
    }
    return res.json();
}

export async function verifyRazorpayPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
) {
    const res = await fetch(`${API_URL}/payments/verify-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        }),
    });
    if (!res.ok) {
        throw new Error("Payment verification failed");
    }
    return res.json();
}

export async function createInternalOrder(
    userId: string,
    shippingAddress: any, // Typed as needed
    items: any[],
    totalAmount: number,
    transactionId: string
) {
    const res = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            items: items.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.price // Backend expects this? Check models/orders.py
            })),
            shipping_address: shippingAddress,
            payment_method: "Razorpay",
            total_amount: totalAmount,
            transaction_id: transactionId
        }),
    });

    // Logic gap: The current backend routers/orders.py doesn't accept transaction_id in the body. 
    // It creates an order then inserts it. 
    // We should probably update the backend OrderCreate model to accept transaction_id.

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to create internal order");
    }
    return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        throw new Error("Failed to update status");
    }
    return res.json();
}

export async function getOrderById(orderId: string) {
    const res = await fetch(`${API_URL}/orders/${orderId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch order");
    }
    return res.json();
}
