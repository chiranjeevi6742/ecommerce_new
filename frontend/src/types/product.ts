export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    image_url?: string;
    is_active: boolean;
    created_at?: string;
}
