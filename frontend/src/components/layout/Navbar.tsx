"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="primary" size="sm" className="hidden md:inline-flex">
                            Get Started
                        </Button>
                    </Link>

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
                            <div className="mt-4 flex flex-col gap-2">
                                <Link href="/login" className="w-full">
                                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                                </Link>
                                <Link href="/shop" className="w-full">
                                    <Button variant="primary" className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
