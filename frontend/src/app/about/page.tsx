import { ShoppingBag, Users, Globe, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About InstiShop</h2>
                        <p className="mt-6 text-lg leading-8 text-slate-300">
                            We are building the future of campus commerce. A platform designed by students, for students, making it easier than ever to buy, sell, and connect.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Our Mission</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Empowering the Campus Economy
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        InstiShop was born from a simple idea: why is it so hard to find supplies, textbooks, and merchandise within our own campus? We set out to create a centralized, trusted marketplace that solves this problem once and for all.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                <ShoppingBag className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                                Curated Selection
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">We handpick every vendor and product to ensure quality and relevance for student life.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                <Users className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                                Community First
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">Built to foster connections between students, clubs, and campus organizations.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                <ShieldCheck className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                                Trusted & Secure
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">的安全 transactions and verified user profiles mean you can shop with peace of mind.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                <Globe className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                                Sustainability
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">Promoting reuse and reducing waste by giving pre-loved items a new home.</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
