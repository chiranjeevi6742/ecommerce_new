import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Truck, CreditCard, Sparkles } from "lucide-react";

const features = [
  {
    name: "Premium Quality",
    description: "Curated products that meet the highest institute standards.",
    icon: Sparkles,
  },
  {
    name: "Fast Delivery",
    description: "Same-day delivery for campus residents and local areas.",
    icon: Truck,
  },
  {
    name: "Secure Payments",
    description: "Encrypted transactions protected by industry standards.",
    icon: ShieldCheck,
  },
  {
    name: "Student Discounts",
    description: "verified special pricing for all registered students.",
    icon: CreditCard,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-100">
      <Navbar />

      <Hero />

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We provide a seamless shopping experience tailored for our community.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16 group">
                  <dt className="text-base font-semibold leading-7 text-slate-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
