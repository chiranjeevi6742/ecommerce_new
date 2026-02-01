"use client";

import { useCart } from "@/providers/CartProvider";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

import { createPortal } from "react-dom";
import Image from "next/image";

export function CartDrawer() {
    const { items, removeItem, updateQuantity, subtotal, isCartOpen, closeCart } = useCart();

    // Prevent background scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return createPortal(
        <div className="relative z-[100]">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 z-[101]">
                <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full animate-in slide-in-from-right duration-300">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Your Cart
                        </h2>
                        <button
                            onClick={closeCart}
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <div className="bg-slate-50 p-4 rounded-full">
                                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-medium">Your cart is empty</p>
                                    <p className="text-slate-500 text-sm mt-1">Looks like you haven't added anything yet.</p>
                                </div>
                                <Button variant="outline" onClick={closeCart}>
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {items.map(({ product, quantity }) => (
                                    <li key={product.id} className="flex gap-4 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">No img</div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2 pr-4">{product.name}</h3>
                                                    <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">${(product.price * quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-slate-200 rounded-lg bg-white h-8">
                                                    <button
                                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                                        className="px-2 h-full hover:bg-slate-50 text-slate-600 flex items-center justify-center"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                                        className="px-2 h-full hover:bg-slate-50 text-slate-600 flex items-center justify-center"
                                                        disabled={quantity >= product.stock}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(product.id)}
                                                    className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60">
                            <div className="flex justify-between text-base font-medium text-slate-900 mb-4">
                                <p>Subtotal</p>
                                <p>${subtotal.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500 mb-6">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <Link href="/checkout" className="block w-full">
                                <Button className="w-full" size="lg" onClick={closeCart}>
                                    Checkout
                                </Button>
                            </Link>
                            <div className="mt-4 flex justify-center text-center text-sm text-slate-500">
                                <p>
                                    or
                                    <button type="button" className="font-medium text-blue-600 hover:text-blue-500 ml-1" onClick={closeCart}>
                                        Continue Shopping
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
