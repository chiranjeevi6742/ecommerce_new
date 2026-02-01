from fastapi import APIRouter
from app.core.database import supabase
from app.models.analytics import DashboardStats, KPIData, SalesTrend
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats():
    # 1. Total Revenue
    res_revenue = supabase.table("orders").select("total_amount").execute()
    total_revenue = sum(item["total_amount"] for item in res_revenue.data) if res_revenue.data else 0

    # 2. Active Orders (Pending)
    res_active = supabase.table("orders").select("id", count="exact").eq("status", "Pending").execute()
    active_orders = res_active.count or 0

    # 3. Total Customers (Unique Emails)
    res_customers = supabase.table("orders").select("email").execute()
    total_customers = len(set(o["email"] for o in res_customers.data)) if res_customers.data else 0

    # 4. Low Stock (< 5)
    res_stock = supabase.table("products").select("id", count="exact").lt("stock", 5).execute()
    low_stock_count = res_stock.count or 0

    # 5. Recent Orders (Last 5)
    res_recent = supabase.table("orders").select("*").order("created_at", desc=True).limit(5).execute()
    recent_orders = res_recent.data

    # 6. Sales Trend (Last 7 Days) - Mock/Simple calculation
    # Ideally, use a database view for this, but Python loop is fine for MVP
    today = datetime.now()
    trend = []
    
    # We will fetch all orders from last 7 days
    seven_days_ago = (today - timedelta(days=7)).isoformat()
    res_week_orders = supabase.table("orders").select("created_at, total_amount").gte("created_at", seven_days_ago).execute()
    
    # Bucket by day
    daily_map = {}
    for i in range(7):
        d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        daily_map[d] = 0.0

    if res_week_orders.data:
        for order in res_week_orders.data:
            # Parse date "2023-10-27T10:00:00+00:00" -> "2023-10-27"
            day_str = order["created_at"].split("T")[0]
            if day_str in daily_map:
                daily_map[day_str] += order["total_amount"]
    
    # Convert to list sorted by date
    for d, rev in sorted(daily_map.items()):
        trend.append(SalesTrend(date=d, revenue=rev))

    return DashboardStats(
        kpi=KPIData(
            total_revenue=total_revenue,
            active_orders=active_orders,
            total_customers=total_customers,
            low_stock_count=low_stock_count
        ),
        sales_trend=trend,
        recent_orders=recent_orders
    )
