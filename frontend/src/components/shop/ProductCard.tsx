"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addItem } = useCart();

    return (
        <div
            className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="aspect-square w-full overflow-hidden bg-slate-50 relative">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className={cn(
                            "h-full w-full object-cover object-center transition-transform duration-500",
                            isHovered ? "scale-110" : "scale-100"
                        )}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.stock < 5 && product.stock > 0 && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                            Low Stock
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full font-medium">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Quick Add Button (Visible on Hover) */}
                <div className={cn(
                    "absolute bottom-4 left-4 right-4 transition-all duration-300 transform",
                    isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product, 1);
                        }}
                        className="w-full bg-white/90 backdrop-blur text-slate-900 py-2.5 rounded-xl font-medium shadow-sm hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Info */}
            <Link href={`/shop/${product.id}`}>
                <div className="p-4">
                    <h3 className="text-slate-900 font-medium truncate">{product.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-900 font-bold">${Number(product.price).toFixed(2)}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
