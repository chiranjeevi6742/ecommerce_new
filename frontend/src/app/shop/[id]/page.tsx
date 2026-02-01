"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/providers/CartProvider";

// Mock Rating (Random)
const rating = 4.5;
const reviews = 124;

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:8001/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    // Generate images list
    const images = Array.isArray(product?.images) && product.images.length > 0
        ? product.images
        : [product?.image_url].filter(Boolean) as string[];

    // If no images at all, show placeholder
    if (images.length === 0) images.push("/placeholder.png");

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-500">Product not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left: Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative group">
                            <Image
                                src={images[activeImage] || "/placeholder.png"}
                                alt={product.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            <Button variant="ghost" className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white hover:text-red-500 z-10">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-blue-600' : 'border-transparent hover:border-slate-300'}`}
                                >
                                    <Image src={img || "/placeholder.png"} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col justify-start">
                        <div className="mb-2">
                            <span className="text-sm font-medium text-blue-600">{product.category}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2 mb-6">
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-slate-500">({reviews} reviews)</span>
                        </div>

                        <div className="text-3xl font-bold text-slate-900 mb-6">
                            ${Number(product.price).toFixed(2)}
                        </div>

                        <div className="prose prose-slate text-slate-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Quantity & Buy */}
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-900">Quantity</span>
                                <div className="flex items-center border border-slate-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-slate-50 text-slate-600"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="p-2 hover:bg-slate-50 text-slate-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {product.stock} items in stock
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    className="flex-1 h-12 text-lg"
                                    disabled={product.stock === 0}
                                    onClick={() => addItem(product, quantity)}
                                >
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </Button>
                                <Button variant="outline" className="h-12 w-12 p-0">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                            <div className="flex items-start gap-3">
                                <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Free Delivery</h4>
                                    <p className="text-xs text-slate-500">On campus orders over $50</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Institute Verified</h4>
                                    <p className="text-xs text-slate-500">Official merchandise partner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
