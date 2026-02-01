# 09. API Design Specification

Base URL: `http://localhost:8001/api`

## Products (`/products`)

### Public
-   **GET** `/products/public`
    -   **Description:** Fetch all *active* products.
    -   **Response:** `List[Product]`

-   **GET** `/products/{id}`
    -   **Description:** Fetch single product details.
    -   **Response:** `Product`

### Admin (Protected)
-   **GET** `/products/`
    -   **Description:** Fetch ALL products (including inactive).
    -   **Response:** `List[Product]`

-   **POST** `/products/`
    -   **Body:** `{ name, description, price, stock, category, images: [], is_active }`
    -   **Response:** `Product` (Created)

-   **PUT** `/products/{id}`
    -   **Body:** Product Update Schema (Partial)
    -   **Response:** `Product` (Updated)

-   **DELETE** `/products/{id}`
    -   **Response:** `200 OK`

## Images
*Note: Images are uploaded directly to Supabase Storage from the Client. The API only receives the resulting Public URLs in the `images` array.*

## Authentication
Auth is handled via the Supabase Client. The Backend verifies the JWT token sent in the `Authorization: Bearer <token>` header for protected routes.
