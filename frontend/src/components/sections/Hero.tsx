"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-white pt-16 pb-12 lg:pt-32 lg:pb-24">

            {/* Background elements */}
            <div className="absolute top-0 right-0 -z-10 opacity-30 blur-3xl overflow-visible">
                <div className="h-[600px] w-[600px] rounded-full bg-blue-100" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:items-center">

                    {/* Left Content */}
                    <div className="relative z-10 max-w-2xl lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 mb-8">
                                <Sparkles className="h-4 w-4 fill-blue-600" />
                                <span>Official Campus Merchandise Live!</span>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
                                Your Campus Style, <br />
                                <span className="text-blue-600">Elevated.</span>
                            </h1>

                            <p className="text-lg leading-8 text-slate-600 mb-8">
                                Discover the latest trends in student fashion, electronics, and study essentials.
                                Exclusive student discounts, same-day campus delivery, and premium quality guaranteed.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/shop" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full gap-2 h-12 text-base">
                                        Start Shopping
                                        <ShoppingBag className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/shop?category=Clothing" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full gap-2 h-12 text-base">
                                        View Collections
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-8 text-sm font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    5k+ Active Students
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    Instant Delivery
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative lg:h-auto lg:max-w-none"
                    >
                        <div className="relative rounded-2xl bg-slate-100 overflow-hidden shadow-2xl ring-1 ring-slate-900/10 aspect-[4/3] lg:aspect-square">
                            {/* Decorative Blobs */}
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>

                            <Image
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                alt="Students hanging out"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Floating Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 hidden sm:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                        50%
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Student Special Offer</p>
                                        <p className="text-sm text-slate-600">Get 50% off on all course books this week!</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
