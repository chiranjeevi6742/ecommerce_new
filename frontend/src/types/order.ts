export interface Order {
    id: string;
    user_id?: string;
    full_name: string;
    email: string;
    address: string;
    city: string;
    zip_code: string;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
}
