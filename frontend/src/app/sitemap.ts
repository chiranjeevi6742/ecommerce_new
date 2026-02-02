import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        {
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ];

    try {
        // Dynamic routes (Products)
        const res = await fetch(`${API_URL}/products/public`); // Ensure this endpoint exists and lists all products
        if (res.ok) {
            const products = await res.json();
            const productRoutes = products.map((product: any) => ({
                url: `${BASE_URL}/shop/${product.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
            return [...routes, ...productRoutes];
        }
    } catch (error) {
        console.error("Failed to generate product sitemap", error);
    }

    return routes;
}
