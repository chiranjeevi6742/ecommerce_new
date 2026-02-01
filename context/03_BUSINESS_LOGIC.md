# 03. Business Logic

## 1. Product Management
-   **Creation:** Only authenticated Admins can create products.
-   **Images:** A product can have multiple images. The first image in the array is treated as the "Main/Cover" image.
-   **Stock:** Stock is an integer value. It must be decremented upon order completion (logic to be implemented in checkout).
-   **Visibility:** Products has an `is_active` flag (default True). Logic should exist to hide inactive products from the public shop.

## 2. Shopping & Cart
-   **Guest Shopping:** Users can browse and add items to the cart without logging in.
-   **Cart Persistence:** Cart items are saved to `localStorage`, so they survive page refreshes.
-   **Stock Validation:** Users should not be able to add more qty than available in `stock`.
    -   *Current UI Check:* The "+" button is disabled if `qty >= stock`.

## 3. Order Processing (Conceptual)
-   **Checkout:** User reviews cart -> Enters Details -> Confirms Order.
-   **Inventory Update:** Backend MUST check stock availability *again* at the moment of purchase to prevent race conditions.
-   **Status Lifecycle:** `PENDING` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` / `CANCELLED`.

## 4. User Roles & Permissions
-   **Public:** Can view active products (`/shop`).
-   **Authenticated User:** Can view profile, manage addresses, view order history.
-   **Admin:**
    -   Can view ALL products (active/inactive).
    -   Can Create/Update/Delete products.
    -   Can view usage analytics (`/dashboard`).
    -   *Access Control:* The `/dashboard` route is protected by a check for the authenticated user session.

## 5. Pricing & Discounts
-   Prices are stored as `Decimal` or `Float`.
-   Display prices are formatted to 2 decimal places (e.g., "$15.00").
-   (Future) Coupon logic would apply a percentage or fixed deduction to the `subtotal`.
