export interface SaleRecord {
  id: string;
  date: string;
  product: string;
  category: 'Electronics' | 'Clothing' | 'Home' | 'Beauty' | 'Sports';
  region: 'North' | 'South' | 'East' | 'West';
  sales: number;
  profit: number;
  quantity: number;
}

export type DashboardPage = 'Overview' | 'Products' | 'Trends';

export interface KPIStats {
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
  profitMargin: number;
}
