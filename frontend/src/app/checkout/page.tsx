"use client";

import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/lib/validation/checkout";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Loader2, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, subtotal, clearCart, removeItem } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema)
    });

    const onSubmit = async (data: CheckoutFormData) => {
        setIsProcessing(true);

        try {
            // Construct Payload for /api/orders
            const payload = {
                user_id: user?.id || null, // Allow guest checkout if needed, but we track if logged in
                items: items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                total_amount: subtotal,
                shipping_address: {
                    fullName: data.fullName,
                    email: data.email,
                    address: data.address,
                    city: data.city,
                    zipCode: data.zipCode
                },
                payment_method: "Credit Card"
            };

            const res = await fetch('http://localhost:8001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(`Order Failed: ${JSON.stringify(errorData.detail)}`);
                return;
            }

            // Success
            clearCart();
            router.push("/checkout/success");

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
                    <Link href="/shop">
                        <Button>Go to Shop</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Form */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Shipping & Payment</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input {...register("fullName")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input {...register("email")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input {...register("address")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input {...register("city")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                                    <input {...register("zipCode")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6"></div>

                            {/* Payment */}
                            <h3 className="text-base font-semibold mb-4">Payment Method (Mock)</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                                <input {...register("cardNumber")} placeholder="0000 0000 0000 0000" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                    <input {...register("expiryDate")} placeholder="MM/YY" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                    <input {...register("cvc")} placeholder="123" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc.message}</p>}
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-4" size="lg" isLoading={isProcessing}>
                                {isProcessing ? "Processing..." : `Pay $${subtotal.toFixed(2)}`}
                            </Button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:pl-8">
                        <div className="bg-slate-100 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <ul className="space-y-4 mb-6">
                                {items.map(({ product, quantity }) => (
                                    <li key={product.id} className="flex gap-4">
                                        <div className="h-16 w-16 bg-white rounded-md flex-shrink-0 overflow-hidden border border-slate-200">
                                            {product.image_url && <img src={product.image_url} className="h-full w-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900 text-sm">{product.name}</h4>
                                            <p className="text-slate-500 text-sm">Qty: {quantity}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="font-medium text-slate-900">
                                                ${(product.price * quantity).toFixed(2)}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(product.id)}
                                                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 pt-4 border-t border-slate-200 mt-4">
                                    <span>Total</span>
                                    <span>${subtotal.toFixed(2)}</span>
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
