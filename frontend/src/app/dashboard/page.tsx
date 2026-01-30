export default function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 mt-2">Welcome back to your control center.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Sales</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-2">$12,450</p>
                        <div className="mt-4 flex items-center text-sm text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
                            <span>+12% from last month</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
