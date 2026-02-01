"use client";

import { useState } from "react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createRazorpayOrder, createInternalOrder, verifyRazorpayPayment } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: user?.email || "",
        address: "",
        city: "",
        zipCode: "",
    });

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto pt-32 px-4 text-center">
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <Button className="mt-4" onClick={() => router.push("/shop")}>
                        Go Shopping
                    </Button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!user) {
            alert("Please sign in to continue");
            router.push("/login?redirect=/checkout");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Razorpay Order
            // Amount expected by backend is integer (paise) or normal?
            // Backend routers/payments.py: request.amount.
            // Razorpay needs Paise to create order.
            // So pass amount * 100
            const amountInPaise = Math.round(subtotal * 100);
            const orderData = await createRazorpayOrder(amountInPaise, "INR");

            // 2. Initialize Razorpay Options
            const options = {
                key: orderData.key_id, // We need to ensure backend returns this
                amount: orderData.amount,
                currency: orderData.currency,
                name: "InstiShop",
                description: "Purchase",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        // 3. Create Internal Order Record (Pending)
                        await createInternalOrder(
                            user.id,
                            formData,
                            items,
                            subtotal,
                            response.razorpay_order_id
                        );

                        // 4. Verify Payment on Backend (Updates to Paid)
                        await verifyRazorpayPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );

                        // 5. Success
                        clearCart();
                        router.push("/order-confirmation");
                    } catch (verifyError) {
                        alert("Payment verification failed");
                        console.error(verifyError);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                },
                theme: {
                    color: "#2563eb",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong initializing payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Shipping Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-slate-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Hostel 4, Room 202"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Campus City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Zip Code</label>
                                    <Input
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="500001"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:pl-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <ul className="divide-y divide-slate-100 mb-6">
                                {items.map((item) => (
                                    <li key={item.product.id} className="py-3 flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 text-sm">{item.quantity}x</span>
                                            <span className="text-slate-900 font-medium">{item.product.name}</span>
                                        </div>
                                        <span className="text-slate-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-slate-200 pt-4 mb-6">
                                <div className="flex justify-between text-lg font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                className="w-full h-12 text-lg"
                                disabled={loading || !formData.address}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Pay & Place Order
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-center text-slate-500 mt-4">
                                Payments are processed securely via Razorpay (Test Mode).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
