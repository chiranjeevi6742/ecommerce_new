# 04. Data Flow diagrams

## 1. User Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SupabaseAuth
    
    User->>Frontend: Click "Sign In"
    Frontend->>SupabaseAuth: Send Email/Password
    SupabaseAuth-->>Frontend: Return Session (JWT)
    Frontend->>Frontend: Store Session in Context (AuthProvider)
    Frontend->>User: Redirect to Profile/Dashboard
```

## 2. Product Fetch Flow (Public Shop)
```mermaid
sequenceDiagram
    participant User
    participant Frontend (Shop Page)
    participant BackendAPI
    participant Database
    
    User->>Frontend: Visits /shop
    Frontend->>BackendAPI: GET /api/products/public
    BackendAPI->>Database: SELECT * FROM products WHERE is_active = true
    Database-->>BackendAPI: Return Rows
    BackendAPI-->>Frontend: Return JSON [Product List]
    Frontend->>User: Render Product Grid
```

## 3. Image Upload Flow (Admin Dashboard)
```mermaid
sequenceDiagram
    participant Admin
    participant Frontend (Edit Page)
    participant SupabaseStorage
    participant BackendAPI
    
    Admin->>Frontend: Selects 3 Images
    loop For Each Image
        Frontend->>SupabaseStorage: upload(file)
        SupabaseStorage-->>Frontend: Return Public URL
    end
    Frontend->>BackendAPI: PUT /api/products/{id} (payload includes new image_urls)
    BackendAPI->>Database: UPDATE products SET images = [...]
    BackendAPI-->>Frontend: HTTP 200 OK
    Frontend->>Admin: Show "Success" Toast
```

## 4. Add to Cart Flow
1.  User clicks "Add to Cart".
2.  `CartProvider` receives request.
3.  Check if item exists in `cartItems`.
    -   **Yes:** Increment quantity (validate against max stock).
    -   **No:** Push new object `{ product, quantity: 1 }`.
4.  Update `localStorage`.
5.  Trigger React re-render to update Cart Icon badge in Navbar.
