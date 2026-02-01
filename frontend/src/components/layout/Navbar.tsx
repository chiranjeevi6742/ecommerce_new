"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X, ShoppingCart, LogOut, LayoutDashboard, ChevronDown, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { cartCount, openCart } = useCart();
    const { user, signOut } = useAuth();
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await signOut();
        setIsProfileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            InstiShop
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/shop" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Shop
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        About
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={openCart}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {user ? (
                        <div className="relative hidden md:block" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs">
                                        {user.email?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100 mb-1">
                                            <p className="text-sm font-medium text-slate-900 truncate">Logged in as</p>
                                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href="/dashboard"
                                            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg hover:text-blue-600"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <LayoutDashboard className="mr-3 h-4 w-4" />
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/dashboard/orders"
                                            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg hover:text-blue-600"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Package className="mr-3 h-4 w-4" />
                                            My Orders
                                        </Link>

                                        <div className="my-1 border-t border-slate-100" />

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            Sign out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/shop">
                                <Button variant="primary" size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Trigger */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-slate-200 bg-white overflow-hidden"
                    >
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                                Home
                            </Link>
                            <Link href="/shop" className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                                Shop
                            </Link>
                            <Link href="/about" className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                                About
                            </Link>

                            <div className="my-2 border-t border-slate-100" />

                            {user ? (
                                <>
                                    <div className="px-3 py-2">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Signed in as</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="mt-4 flex flex-col gap-2">
                                    <Link href="/login" className="w-full">
                                        <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                                    </Link>
                                    <Link href="/shop" className="w-full">
                                        <Button variant="primary" className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartDrawer />
        </nav>
    );
}
