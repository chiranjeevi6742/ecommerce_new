"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { id: "Pending", label: "Order Placed", icon: Clock },
    { id: "Paid", label: "Payment Confirmed", icon: CheckCircle },
    { id: "Processing", label: "Packing", icon: Package },
    { id: "Shipped", label: "On the Way", icon: Truck },
    { id: "Delivered", label: "Delivered", icon: MapPin },
];

export default function TrackOrderPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id as string);
                setOrder(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <p>Order not found</p>
                </div>
                <Footer />
            </div>
        );
    }

    const currentStepIndex = STEPS.findIndex(s => s.id === order.status) !== -1
        ? STEPS.findIndex(s => s.id === order.status)
        : (order.status === "Cancelled" ? -1 : 0);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-24 pb-12 px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Track Order</h1>
                            <p className="text-slate-500 mt-1">Order ID: #{order.id}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                            <p className="text-sm font-medium text-slate-900">Expected Delivery</p>
                            <p className="text-blue-600 font-bold">
                                {new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000).toDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative mb-12 px-4">
                        {/* Progress Bar Line */}
                        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-10 hidden md:block">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%` }}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                            {STEPS.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const Icon = step.icon;

                                return (
                                    <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white",
                                            isCompleted ? "border-blue-600 text-blue-600" : "border-slate-200 text-slate-300",
                                            isCurrent && "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="md:text-center">
                                            <p className={cn("font-medium text-sm", isCompleted ? "text-slate-900" : "text-slate-400")}>
                                                {step.label}
                                            </p>
                                            {isCurrent && <p className="text-xs text-blue-600 font-medium">In Progress</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Items in this shipment</h3>
                        <div className="space-y-4">
                            {/* We need items data. Backend get_order_by_id logic I updated successfully fetches items */}
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-lg border border-slate-100">
                                        {/* Mock Image for now if missing */}
                                        <div className="h-16 w-16 bg-slate-200 rounded-md overflow-hidden relative">
                                            {/* If we had an image component, we'd use it. For now, basic div */}
                                            {item.product?.image_url && <img src={item.product.image_url} className="object-cover h-full w-full" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{item.product?.name || "Product"}</p>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity} × ${item.price}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">Loading items details...</p>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-2">Shipping Address</h3>
                        <p className="text-slate-600 text-sm">
                            {order.full_name}<br />
                            {order.address}<br />
                            {order.city}, {order.zip_code}
                        </p>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
