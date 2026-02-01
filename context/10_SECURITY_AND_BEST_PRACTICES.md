# 10. Security & Best Practices

## 1. Authentication & Authorization
-   **Supabase Auth:** Used as the single source of truth for Identity.
-   **Row Level Security (RLS):** *Critical.* RLS policies MUST be enabled on the Supabase Database to prevent unauthorized access.
    -   `products`: Public (SELECT), Admin (INSERT/UPDATE/DELETE).
    -   `orders`: User (SELECT own), Admin (SELECT all).
-   **Backend Verification:** The FastAPI backend does not trust the frontend implicitly. It handles sensitive logic (price calculations) and validates user tokens for admin actions.

## 2. Environment Variables (.env)
-   **Never commit `.env` files to git.**
-   **Frontend (`NEXT_PUBLIC_...`):** Only expose keys that are safe to be seen in the browser (e.g., Supabase URL, Anon Key).
-   **Backend:** Keep Database Connection Strings (`DATABASE_URL`) and Service Role Keys strictly server-side.

## 3. Data Validation
-   All inputs are validated using **Pydantic** on the backend. This prevents SQL injection (handled by ORM/Driver) and malformed data issues.
-   Frontend uses type checking (TypeScript) to provide immediate feedback, but Backend is the final gatekeeper.

## 4. Performance
-   **Image Optimization:** Use `next/image` for automatic resizing and format serving (WebP).
-   **Lazy Loading:** Use React `Suspense` and `lazy` imports for heavy components (e.g., Charts, Editors).
-   **Server Components:** Prefer Server Components for fetching initial data to reduce Client-Side JavaScript bundle size.

## 5. Storage Security
-   **Bucket Policies:**
    -   `product-images`: Publicly readable. Only Authenticated (Admin) write access.
