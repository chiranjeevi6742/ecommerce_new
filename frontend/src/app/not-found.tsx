import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
            <h2 className="text-3xl font-bold text-slate-900 mt-4">Page Not Found</h2>
            <p className="text-slate-500 mt-2 max-w-md">
                Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist.
            </p>
            <div className="mt-8 flex gap-4">
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
                <Link href="/shop">
                    <Button>Back to Shop</Button>
                </Link>
            </div>
        </div>
    );
}
