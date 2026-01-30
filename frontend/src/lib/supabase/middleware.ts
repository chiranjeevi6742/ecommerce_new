import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run on static files
    if (request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('.') ||
        request.nextUrl.pathname.startsWith('/api')) {
        return supabaseResponse;
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected Routes Logic
    const path = request.nextUrl.pathname;

    if (!user && (path.startsWith('/dashboard') || path.startsWith('/profile'))) {
        // Redirect to login if trying to access protected route without user
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Admin Check (Optional: Need to fetch role from DB or metadata)
    // For now, simple auth check is implemented

    if (user && path === '/login') {
        // If already logged in, redirect to home or dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
