# 07. Folder Structure

## Root Directory
-   `frontend/`: Next.js Application.
-   `backend/`: FastAPI Application.
-   `context/`: This documentation.

## Frontend Structure (`frontend/src/`)
```
src/
├── app/                 # App Router (Pages & Layouts)
│   ├── dashboard/       # Protected Admin Routes
│   ├── shop/            # Public Shop Routes
│   ├── auth/            # Auth Callbacks
│   ├── globals.css      # TailWind & Global Styles
│   ├── layout.tsx       # Root Layout
│   └── page.tsx         # Home Page
├── components/          # Reusable Components
│   ├── ui/              # Primitive UI (Button, Input, Avatar)
│   ├── layout/          # Navbar, Footer, Sidebar
│   ├── shop/            # ProductCard, CartDrawer
│   └── dashboard/       # Admin specific widgets
├── lib/                 # Utilities (supabase client, utils.ts)
├── providers/           # Context Providers (Auth, Cart)
└── types/               # TypeScript Interfaces (product.ts)
```

## Backend Structure (`backend/app/`)
```
app/
├── main.py              # Entry Point (FastAPI app)
├── models/              # Pydantic Schemas (products.py)
├── routers/             # Route Handlers
│   ├── products.py      # Product CRUD
│   └── ...
└── core/                # Config (Database connection)
```
