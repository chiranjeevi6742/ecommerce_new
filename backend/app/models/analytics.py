from pydantic import BaseModel
from typing import List, Dict, Any

class KPIData(BaseModel):
    total_revenue: float
    active_orders: int
    total_customers: int
    low_stock_count: int

class SalesTrend(BaseModel):
    date: str
    revenue: float

class DashboardStats(BaseModel):
    kpi: KPIData
    sales_trend: List[SalesTrend]
    recent_orders: List[Dict[str, Any]]
