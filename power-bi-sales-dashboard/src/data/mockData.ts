import { SaleRecord } from '../types';

const products = [
  { name: 'UltraHD Monitor', category: 'Electronics' },
  { name: 'Wireless Mouse', category: 'Electronics' },
  { name: 'Mechanical Keyboard', category: 'Electronics' },
  { name: 'Denim Jacket', category: 'Clothing' },
  { name: 'Cotton T-Shirt', category: 'Clothing' },
  { name: 'Smart Table Lamp', category: 'Home' },
  { name: 'Ergonomic Chair', category: 'Home' },
  { name: 'Matte Lipstick', category: 'Beauty' },
  { name: 'Face Moisturizer', category: 'Beauty' },
  { name: 'Yoga Mat', category: 'Sports' },
  { name: 'Running Shoes', category: 'Sports' },
] as const;

const regions = ['North', 'South', 'East', 'West'] as const;

export const mockSalesData: SaleRecord[] = Array.from({ length: 150 }).map((_, i) => {
  const productInfo = products[Math.floor(Math.random() * products.length)];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const quantity = Math.floor(Math.random() * 5) + 1;
  const unitPrice = [20, 50, 100, 200, 500, 1200][Math.floor(Math.random() * 6)];
  const sales = unitPrice * quantity;
  const profitMargin = 0.1 + Math.random() * 0.3; // 10% to 40% margin
  const profit = sales * profitMargin;

  // Generate dates over the last 12 months
  const date = new Date(2025, 0, 1);
  date.setDate(date.getDate() + Math.floor(Math.random() * 400));

  return {
    id: `ORD-${1000 + i}`,
    date: date.toISOString().split('T')[0],
    product: productInfo.name,
    category: productInfo.category as any,
    region,
    sales,
    profit,
    quantity,
  };
});
