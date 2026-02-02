"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { DollarSign, ShoppingCart, Users, AlertTriangle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardData {
    kpi: {
        total_revenue: number;
        active_orders: number;
        total_customers: number;
        low_stock_count: number;
    };
    sales_trend: Array<{ date: string; revenue: number }>;
    recent_orders: Array<any>;
}

const RevenueChart = dynamic(() => import('@/components/dashboard/RevenueChart'), {
    loading: () => <div className="h-80 w-full bg-slate-50 animate-pulse rounded-lg" />,
    ssr: false
});

export default function DashboardOverview() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
                const res = await fetch(`${apiUrl}/analytics/dashboard`);
                if (res.ok) {
                    setData(await res.json());
                } else {
                    setError(`Failed to load data: ${res.status} ${res.statusText}`);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to connect to backend. Please check your internet or try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-red-600 bg-red-50 rounded-xl m-8 border border-red-200">{error}</div>;
    if (!data) return null;

    const { kpi, sales_trend, recent_orders } = data;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Revenue"
                    value={`$${kpi.total_revenue.toFixed(2)}`}
                    icon={DollarSign}
                    trend="+12% from last month"
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <KpiCard
                    title="Active Orders"
                    value={kpi.active_orders}
                    icon={ShoppingCart}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <KpiCard
                    title="Total Customers"
                    value={kpi.total_customers}
                    icon={Users}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <KpiCard
                    title="Low Stock Alert"
                    value={kpi.low_stock_count}
                    icon={AlertTriangle}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Revenue Trend (Last 7 Days)</h3>
                    <RevenueChart data={sales_trend} />
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Recent Orders</h3>
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </span>
                    </div>
                    <div className="space-y-4">
                        {recent_orders.map((order: any) => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div>
                                    <p className="font-medium text-sm text-slate-900">{order.full_name}</p>
                                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm text-slate-900">${order.total_amount.toFixed(2)}</p>
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider",
                                        order.status === "Pending" ? "text-amber-600" : "text-green-600"
                                    )}>{order.status}</p>
                                </div>
                            </div>
                        ))}
                        {recent_orders.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-4">No recent orders.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, trend, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
                {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
            </div>
            <div className={cn("p-3 rounded-lg", bg)}>
                <Icon className={cn("h-6 w-6", color)} />
            </div>
        </div>
    );
}
