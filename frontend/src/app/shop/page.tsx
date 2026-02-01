"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/shop/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function ShopContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:8001/api/products/public');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Sync state with URL params if they change
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) {
            setActiveCategory(cat);
        }
    }, [searchParams]);

    // Filter Logic
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Shop Collection</h1>
                    <p className="text-slate-500 mt-2">Explore our premium selection.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="md:hidden" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                        <ListFilter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className={cn(
                    "lg:w-64 flex-shrink-0 space-y-8",
                    mobileFilterOpen ? "block" : "hidden lg:block"
                )}>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setActiveCategory(cat)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                            activeCategory === cat
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Slider (Mock) */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
                        <input type="range" className="w-full accent-blue-600" />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>$0</span>
                            <span>$1000+</span>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-200 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-500">No products found for this category.</p>
                            <Button variant="ghost" onClick={() => { setActiveCategory("All"); setSearchTerm(""); }}>
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div className="w-full h-full" key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <ShopContent />
            </Suspense>
            <Footer />
        </div>
    );
}
