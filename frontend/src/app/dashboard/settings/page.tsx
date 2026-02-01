"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Store, Bell, Shield, CreditCard, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("general");
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by not rendering theme-dependent UI on server
    if (!mounted) {
        return null;
    }

    const tabs = [
        { id: "general", label: "General", icon: Store },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "billing", label: "Billing", icon: CreditCard },
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 mt-1 dark:text-slate-400">Manage your store preferences and configurations.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                )}
                            >
                                <tab.icon className={cn("h-5 w-5", activeTab === tab.id ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700">

                    {/* General Tab */}
                    {activeTab === "general" && (
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Store Details</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your store name, contact email, and currency.</p>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Store Name</label>
                                    <input type="text" defaultValue="InstiShop" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Support Email</label>
                                    <input type="email" defaultValue="support@instishop.com" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
                                    <input type="text" defaultValue="USD ($)" disabled className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400" />
                                </div>
                                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">Appearance</h4>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={cn(
                                                "p-3 rounded-lg border flex flex-col items-center gap-2 w-28 transition-all hover:bg-slate-50 dark:hover:bg-slate-800",
                                                theme === "light" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700"
                                            )}
                                        >
                                            <div className="h-4 w-4 rounded-full bg-slate-400 border border-slate-500" />
                                            <span className="text-xs font-medium dark:text-slate-300">Light</span>
                                        </button>
                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={cn(
                                                "p-3 rounded-lg border flex flex-col items-center gap-2 w-28 transition-all hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800",
                                                theme === "dark" ? "border-blue-500 bg-slate-800 text-white ring-1 ring-blue-500 dark:bg-slate-800" : "border-slate-200 dark:border-slate-700"
                                            )}
                                        >
                                            <div className="h-4 w-4 rounded-full bg-slate-900 border border-slate-700 dark:bg-slate-950 dark:border-slate-600" />
                                            <span className="text-xs font-medium dark:text-slate-300">Dark</span>
                                        </button>
                                        <button
                                            onClick={() => setTheme("system")}
                                            className={cn(
                                                "p-3 rounded-lg border flex flex-col items-center gap-2 w-28 transition-all hover:bg-slate-50 dark:hover:bg-slate-800",
                                                theme === "system" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700"
                                            )}
                                        >
                                            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-slate-400 to-slate-900 border border-slate-500" />
                                            <span className="text-xs font-medium dark:text-slate-300">System</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">Notification Preferences</h3>
                                <p className="text-sm text-slate-500">Choose what alerts you want to receive.</p>
                            </div>
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-slate-900">New Orders</p>
                                        <p className="text-sm text-slate-500">Receive an email when a new order is placed.</p>
                                    </div>
                                    <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-slate-900">Low Stock Alerts</p>
                                        <p className="text-sm text-slate-500">Get notified when product stock is low.</p>
                                    </div>
                                    <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">Security Settings</h3>
                                <p className="text-sm text-slate-500">Manage your password and security keys.</p>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                                    <input type="password" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">New Password</label>
                                    <input type="password" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <Button>Update Password</Button>
                            </div>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === "billing" && (
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">Plan & Billing</h3>
                                <p className="text-sm text-slate-500">Manage your subscription and payment methods.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">Pro Plan</p>
                                    <p className="text-sm text-slate-500">$29/month • Active</p>
                                </div>
                                <Button variant="outline">Manage Subscription</Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
