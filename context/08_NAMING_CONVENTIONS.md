# 08. Naming Conventions

Consistency in naming helps keeping the codebase readable.

## Frontend (React/TS)
-   **Files/Components:** PascalCase (e.g., `ProductCard.tsx`, `Navbar.tsx`).
-   **Directories (Routing):** kebab-case (e.g., `app/dashboard/order-history/`).
-   **Helper Files:** camelCase (e.g., `utils.ts`, `formatDate.ts`).
-   **Variables/Functions:** camelCase (e.g., `const isLoading`, `function handleSubmit()`).
-   **Interfaces:** PascalCase (e.g., `interface Product`, `interface User`).
-   **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`).

## Backend (Python)
-   **Files/Modules:** snake_case (e.g., `main.py`, `product_router.py`).
-   **Classes (Pydantic):** PascalCase (e.g., `class ProductBase(BaseModel)`).
-   **Functions/Variables:** snake_case (e.g., `def get_products()`, `user_id`).
-   **Database Tables:** snake_case, plural (e.g., `products`, `orders`, `users`).
-   **Database Columns:** snake_case (e.g., `created_at`, `is_active`).

## API Endpoints
-   Use nouns, plural for collections.
-   `GET /api/products` (List)
-   `GET /api/products/{id}` (Detail)
-   `POST /api/products` (Create)
-   `PUT /api/products/{id}` (Update)
-   `DELETE /api/products/{id}` (Delete)
