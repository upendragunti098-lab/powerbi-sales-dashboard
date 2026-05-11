/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Percent, 
  BarChart3,
  Search,
  Bell,
  User,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockSalesData } from './data/mockData';
import { DashboardPage, KPIStats } from './types';
import { KPICard } from './components/KPICard';
import { formatCurrency, formatPercentage, cn } from './lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function App() {
  const [activePage, setActivePage] = useState<DashboardPage>('Overview');

  const stats = useMemo<KPIStats>(() => {
    const totalSales = mockSalesData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalProfit = mockSalesData.reduce((acc, curr) => acc + curr.profit, 0);
    const totalOrders = mockSalesData.length;
    const profitMargin = totalSales > 0 ? totalProfit / totalSales : 0;

    return { totalSales, totalProfit, totalOrders, profitMargin };
  }, []);

  const salesByRegion = useMemo(() => {
    const data: Record<string, number> = {};
    mockSalesData.forEach(s => {
      data[s.region] = (data[s.region] || 0) + s.sales;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, []);

  const salesByProduct = useMemo(() => {
    const data: Record<string, number> = {};
    mockSalesData.forEach(s => {
      data[s.product] = (data[s.product] || 0) + s.sales;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  const trendData = useMemo(() => {
    const data: Record<string, { sales: number; profit: number }> = {};
    mockSalesData.forEach(s => {
      const month = s.date.substring(0, 7); // YYYY-MM
      if (!data[month]) data[month] = { sales: 0, profit: 0 };
      data[month].sales += s.sales;
      data[month].profit += s.profit;
    });
    return Object.entries(data)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    mockSalesData.forEach(s => {
      data[s.category] = (data[s.category] || 0) + s.sales;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-bottom border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Power BI</h1>
            <p className="text-xs text-slate-400 font-medium tracking-tight">Sales Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          <SidebarLink 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activePage === 'Overview'} 
            onClick={() => setActivePage('Overview')} 
          />
          <SidebarLink 
            icon={Package} 
            label="Product Analysis" 
            active={activePage === 'Products'} 
            onClick={() => setActivePage('Products')} 
          />
          <SidebarLink 
            icon={TrendingUp} 
            label="Trend Analysis" 
            active={activePage === 'Trends'} 
            onClick={() => setActivePage('Trends')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100 italic text-[10px] text-slate-400">
          Built according to Step 3.1 - 3.9 spec
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-display">
              {activePage === 'Overview' && "Executive Overview"}
              {activePage === 'Products' && "Product Performance Analysis"}
              {activePage === 'Trends' && "Monthly Trend Insights"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Real-time data visualization based on sales_data.csv</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search project data..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all w-64"
                />
             </div>
             <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                  <User className="w-full h-full p-2 text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-700">User Analyst</span>
             </button>
          </div>
        </header>

        {/* Dashboard Pages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activePage === 'Overview' && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard title="Total Sales" value={formatCurrency(stats.totalSales)} icon={DollarSign} trend={{ value: 12.5, isPositive: true }} />
                  <KPICard title="Total Profit" value={formatCurrency(stats.totalProfit)} icon={BarChart3} trend={{ value: 8.2, isPositive: true }} />
                  <KPICard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} trend={{ value: 3.1, isPositive: false }} />
                  <KPICard title="Profit Margin" value={formatPercentage(stats.profitMargin)} icon={Percent} trend={{ value: 0.5, isPositive: true }} />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                       <BarChart3 className="w-5 h-5 text-blue-500" />
                       Sales by Region
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByRegion}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [formatCurrency(value), 'Sales']}
                          />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                       <BarChart3 className="w-5 h-5 text-emerald-500" />
                       Category-wise Revenue
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                             formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                      {categoryData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-[10px] text-slate-500 font-medium uppercase">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'Products' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-8">Top 5 Performing Products</h3>
                  <div className="space-y-6">
                    {salesByProduct.map((product, index) => (
                      <div key={product.name} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="font-semibold text-slate-700 flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-xs text-slate-500">{index + 1}</span>
                            {product.name}
                          </span>
                          <span className="font-bold text-blue-600">{formatCurrency(product.value)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(product.value / salesByProduct[0].value) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
                      <h3 className="text-lg font-bold mb-6">Profit Analysis by Product</h3>
                      <p className="text-slate-500 text-sm italic">Highly accurate breakdown of margins per product line.</p>
                      {/* Placeholder for more detail */}
                      <div className="mt-8 border-t border-slate-100 pt-8 grid grid-cols-2 gap-8">
                         <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Most Profitable</p>
                            <p className="text-lg font-bold text-slate-800">UltraHD Monitor</p>
                            <p className="text-sm text-emerald-600 font-medium">32% Margin</p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Best Seller</p>
                            <p className="text-lg font-bold text-slate-800">Wireless Mouse</p>
                            <p className="text-sm text-slate-500 font-medium">420 Units Sold</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between">
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold leading-tight">Product Insight</h3>
                        <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                          Electronics drive 65% of the total revenue. South region shows a 12% higher conversion rate for Home goods.
                        </p>
                      </div>
                      <div className="mt-8 relative z-10">
                        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 w-full justify-center py-3 rounded-lg transition-colors">
                           View Full Report <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                   </div>
                </div>
              </div>
            )}

            {activePage === 'Trends' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-8">Revenue & Profit Trends (12 Months)</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tickFormatter={(val) => {
                            const [y, m] = val.split('-');
                            const date = new Date(parseInt(y), parseInt(m) - 1);
                            return date.toLocaleString('default', { month: 'short' });
                          }}
                        />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                           formatter={(value: number) => [formatCurrency(value), 'Value']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#3b82f6" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 flex justify-center gap-8">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-blue-500 rounded"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Sales</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-emerald-500 rounded"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Profit</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Growth Projection</h4>
                      <p className="text-slate-800 font-bold text-xl">Estimated 15% Increase Q3</p>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">Based on current trajectory, we expect significant growth in the Electronics segment as holiday demand peaks.</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Margin Stability</h4>
                      <p className="text-slate-800 font-bold text-xl">Maintaining 25% Avg Profit</p>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">Consistent margins across all categories despite seasonal supply chain variations.</p>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarLink({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
        active 
          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-colors",
        active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
      )} />
      {label}
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto w-1 h-4 bg-blue-600 rounded-full"
        />
      )}
    </button>
  );
}
