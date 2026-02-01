# 02. System Architecture

## High-Level Design
InstiShop follows a classic **Client-Server Architecture** utilizing a decoupled Frontend and Backend, connected via a RESTful API.

```mermaid
graph TD
    User[User (Browser)] -->|HTTP/HTTPS| CDN[Next.js Frontend (Vercel/Local)]
    CDN -->|API Calls (Fetch)| API[FastAPI Backend (Python)]
    CDN -->|Auth & Storage| Supabase[Supabase (Auth/Storage)]
    API -->|SQL Queries| DB[(Supabase PostgreSQL)]
```

## 1. Frontend Layer
-   **Framework:** Next.js (App Router).
-   **Rendering:** Hybrid approach.
    -   **Server Components (SSR):** For SEO-critical pages and initial data fetches (where applicable).
    -   **Client Components (CSR):** For interactive elements (Forms, Cart, Dashboard widgets).
-   **Styling:** Tailwind CSS for utility-first styling.
-   **State Management:**
    -   `AuthProvider`: Wraps app to handle Supabase sessions.
    -   `CartProvider`: Persists cart state in `localStorage` and provides hooks for UI.

## 2. Backend Layer
-   **Framework:** FastAPI (Python).
-   **Role:** Acts as the interface between the Frontend and the Database.
-   **Responsibility:**
    -   Validating incoming data (Pydantic models).
    -   Executing business logic.
    -   Querying the PostgreSQL database.
    -   Providing JSON responses.

## 3. Data & Infrastructure Layer
-   **Database:** PostgreSQL (hosted on Supabase).
-   **Authentication:** Supabase Auth (JWT based).
    -   Frontend handles Login/Signup directly with Supabase Client.
    -   Backend validates tokens for protected routes (Dashboard).
-   **Storage:** Supabase Storage (Buckets).
    -   Used for storing `product-images`.
    -   Publicly accessible URLs are stored in the database.

## Integration Points
-   **Frontend <-> Backend:** The frontend communicates with the backend via `http://localhost:8001/api`.
-   **Frontend <-> Supabase:** The frontend uses `@supabase/ssr` or `@supabase/js` to handle auth sessions and file uploads directly.
-   **Backend <-> Supabase DB:** The backend connects to the Postgres instance using `psycopg2` or an ORM/Driver.
