# 06. Coding Standards

## General Guidelines
-   **DRY (Don't Repeat Yourself):** Extract repeated logic into hooks (`useAuth`, `useCart`) or utility functions.
-   **Explicit Typing:** Always use TypeScript interfaces/types for props, state, and API responses.
-   **Environment Variables:** Never hardcode secrets. Use `.env.local` for frontend and `.env` for backend.

## Frontend (React/Next.js)
1.  **Component Structure:**
    -   Imports (React -> External -> Internal -> Styles).
    -   Interfaces/Types.
    -   Component Definition.
    -   Hooks & State.
    -   Effects (`useEffect`).
    -   Helper Functions.
    -   Render Return.
2.  **Hooks:** Use custom hooks (e.g., `useAuth`) instead of interacting with global stores directly in UI components.
3.  **Client vs Server:**
    -   Mark components as `"use client"` only when necessary (state, interactivity).
    -   Keep page roots as Server Components if possible.
4.  **Styling:** Use Tailwind utility classes. For complex conditionals, use `cn()` (clsx + tailwind-merge).

## Backend (FastAPI)
1.  **Type Hinting:** Use Python type hints eagerly (e.g., `def get_item(id: int) -> Item:`).
2.  **Pydantic Models:** Use Pydantic schemas (`app/models/`) for request bodies and response models.
3.  **Routers:** Split routes into separate files under `app/routers/` (e.g., `products.py`, `auth.py`) and include them in `main.py`.
4.  **Error Handling:** Use `HTTPException` with clear status codes (404, 400, 500) and messages.

## Git / Version Control
-   **Commit Messages:** Use imperative mood ("Add login feature", not "Added login").
-   **Clean Code:** Remove `console.log` (Frontend) and `print` (Backend) before committing, unless used for structured logging.
