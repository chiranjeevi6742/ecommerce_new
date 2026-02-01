"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
                <p className="text-slate-500 mb-8">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                <div className="space-y-3">
                    <Link href="/shop" className="block">
                        <Button className="w-full">Continue Shopping</Button>
                    </Link>
                    <Link href="/" className="block">
                        <Button variant="ghost" className="w-full">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
