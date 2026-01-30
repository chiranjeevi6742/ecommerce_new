import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="bg-slate-900 p-1.5 rounded-lg">
                            <ShoppingBag className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">InstiShop</span>
                    </div>

                    <div className="flex gap-8">
                        <Link href="#" className="text-sm text-slate-500 hover:text-blue-600">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm text-slate-500 hover:text-blue-600">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-sm text-slate-500 hover:text-blue-600">
                            Support
                        </Link>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-8 text-center">
                    <p className="text-sm text-slate-400">
                        &copy; {new Date().getFullYear()} Institute E-Commerce. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
