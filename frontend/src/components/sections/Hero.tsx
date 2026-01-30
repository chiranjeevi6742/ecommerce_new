"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
                        New Collection 2026
                    </span>
                    <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl mb-6">
                        Empowering Your <br className="hidden sm:block" />{" "}
                        <span className="text-blue-600">Commerce Experience</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 mb-10">
                        A premium platform designed for modern institutes and students.
                        Quality products, seamless checkout, and trusted service.
                    </p>
                    <div className="flex items-center justify-center gap-x-6">
                        <Link href="/shop">
                            <Button size="lg" className="group">
                                Shop Now
                                <ShoppingCart className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="group">
                                Seller Login
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
