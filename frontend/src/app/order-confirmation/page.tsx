"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function OrderConfirmationPage() {
    const router = useRouter();

    useEffect(() => {
        // Trigger confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: random(0.3, 0.4) } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: random(0.3, 0.4) } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center ring-1 ring-slate-200/50">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
                    <p className="text-slate-600 mb-8">
                        Thank you for your purchase. Your payment has been verified and your order is being processed.
                    </p>

                    <div className="space-y-4">
                        <Button
                            onClick={() => router.push("/dashboard/orders")}
                            className="w-full h-11 text-lg bg-slate-900 hover:bg-slate-800"
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            View My Orders
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/shop")}
                            className="w-full h-11 text-lg border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <p className="text-sm text-slate-400 mt-8">
                        A confirmation email has been sent to your registered address.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
