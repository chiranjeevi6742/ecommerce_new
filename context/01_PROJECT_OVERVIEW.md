# 01. Project Overview

## What is InstiShop?
**InstiShop** is a campus-centric e-commerce platform designed to bridge the gap between institutional supplies (merchandise, books, electronics) and the student body. It functions as a closed-loop market where administrators manage inventory and students browse and purchase items for quick, local delivery.

## Why is it being built?
1.  **Convenience:** Students often need course books or campus gear quickly without waiting for standard shipping times.
2.  **Trust:** A platform officially verified by the institute ensures authentic products.
3.  **Efficiency:** Streamlining the sale of old inventory or seasonal merchandise for the administration.

## Key Features
### For Customers (Students/Faculty)
-   **Browse & Search:** Filter products by category (Clothing, Books, Electronics) and search by keyword.
-   **Product Details:** View multiple images, stock status, and descriptions.
-   **Cart System:** Add/remove items, adjust quantities, view subtotal.
-   **User Accounts:** Sign up/Login to view order history and manage profiles.
-   **Responsive Design:** Optimized for mobile purchasing on the go.

### For Administrators
-   **Dashboard:** Real-time overview of revenue, active orders, and customer counts.
-   **Product Management:** CRUD operations for products, including multi-image uploads via Supabase Storage.
-   **Order Management:** (Planned) View and update order status (Pending → Delivered).
-   **Settings:** Configure store details and preferences.

## User Personas
1.  **The Student (Buyer):**
    -   Needs quick access to study materials.
    -   Value-conscious (looks for discounts).
    -   Mobile-first user.
2.  **The Administrator (Seller):**
    -   Needs a desktop-optimized interface for data entry.
    -   Requires accurate inventory tracking to prevent overselling.
    -   Needs insights into sales performance.

## Success Metrics
-   Seamless checkout flow (no errors).
-   Accurate inventory synchronization.
-   Fast page load times (< 1.5s).
-   Consistent UI experience across Dashboard and Shop.
