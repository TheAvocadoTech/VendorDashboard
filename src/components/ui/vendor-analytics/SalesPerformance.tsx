import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Define type interfaces
interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
}

interface SalesByCategory {
  name: string;
  value: number;
}

interface TimeRangeOption {
  label: string;
  value: string;
}

// Dummy data
const generateDummySalesData = (): SalesData[] => {
  const today = new Date();
  const data: SalesData[] = [];
  
  // Generate data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random values with some trends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseFactor = isWeekend ? 1.5 : 1; // Weekends have higher sales
    
    const orders = Math.floor(Math.random() * 30 * baseFactor) + 20;
    const averageOrderValue = Math.floor(Math.random() * 20) + 30;
    const revenue = orders * averageOrderValue;
    
    data.push({
      date: date.toISOString().split('T')[0],
      orders,
      averageOrderValue,
      revenue,
    });
  }
  
  return data;
};

const dummyProductPerformance: ProductPerformance[] = [
  { name: 'Fresh Vegetables', sales: 245, revenue: 9800 },
  { name: 'Dairy Products', sales: 187, revenue: 7480 },
  { name: 'Bakery Items', sales: 134, revenue: 5360 },
  { name: 'Snacks', sales: 156, revenue: 4680 },
  { name: 'Beverages', sales: 145, revenue: 4350 },
  { name: 'Frozen Foods', sales: 92, revenue: 3680 },
  { name: 'Organic Products', sales: 68, revenue: 3400 },
  { name: 'Canned Goods', sales: 76, revenue: 1900 },
];

const dummySalesByCategory: SalesByCategory[] = [
  { name: 'Fresh Produce', value: 35 },
  { name: 'Dairy & Eggs', value: 20 },
  { name: 'Bakery', value: 15 },
  { name: 'Snacks', value: 12 },
  { name: 'Beverages', value: 10 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Time range options
const timeRangeOptions: TimeRangeOption[] = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'This Year', value: 'year' },
];

const SalesPerformance: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30days');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    growthRate: 0,
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const data = generateDummySalesData();
      setSalesData(data);
      
      // Calculate summary metrics
      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
      const averageOrderValue = totalRevenue / totalOrders;
      
      // Calculate fake growth rate (comparing first half to second half)
      const midpoint = Math.floor(data.length / 2);
      const firstHalfRevenue = data.slice(0, midpoint).reduce((sum, item) => sum + item.revenue, 0);
      const secondHalfRevenue = data.slice(midpoint).reduce((sum, item) => sum + item.revenue, 0);
      const growthRate = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
      
      setSummaryMetrics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        growthRate,
      });
      
      setLoading(false);
    }, 800);
  }, [timeRange]);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Performance</h1>
        <p className="text-gray-600">Monitor your store's sales metrics and performance</p>
      </div>

      {/* Time range selector */}
      <div className="mb-6 flex justify-end">
        <div className="w-48">
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryMetrics.totalRevenue)}</p>
          <div className={`mt-2 flex items-center text-sm ${summaryMetrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{summaryMetrics.growthRate >= 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.growthRate).toFixed(1)}%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{summaryMetrics.totalOrders}</p>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>Conversion rate: 4.2%</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Average Order Value</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryMetrics.averageOrderValue)}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <span>↑ 2.5% from previous period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Return Rate</h3>
          <p className="text-2xl font-bold text-gray-900">1.8%</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <span>↓ 0.3% from previous period</span>
          </div>
        </div>
      </div>

      {/* Revenue trend chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number) => [`$${value}`, 'Revenue']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Daily Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }}
              />
              <Legend />
              <Bar dataKey="orders" name="Orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column layout for additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top-selling products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyProductPerformance.slice(0, 5).map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales by category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dummySalesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                 {dummySalesByCategory.map((_, index) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales performance metrics */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
            <p className="text-xl font-bold text-gray-900">4.2%</p>
            <div className="mt-2 text-sm text-green-600">
              <span>↑ 0.3% from previous period</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Repeat Customer Rate</h3>
            <p className="text-xl font-bold text-gray-900">38.5%</p>
            <div className="mt-2 text-sm text-green-600">
              <span>↑ 2.1% from previous period</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Satisfaction</h3>
            <p className="text-xl font-bold text-gray-900">4.7/5</p>
            <div className="mt-2 text-sm text-green-600">
              <span>↑ 0.2 from previous period</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Processing Time</h3>
            <p className="text-xl font-bold text-gray-900">15 min</p>
            <div className="mt-2 text-sm text-green-600">
              <span>↓ 2 min from previous period</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Success Rate</h3>
            <p className="text-xl font-bold text-gray-900">98.2%</p>
            <div className="mt-2 text-sm text-green-600">
              <span>↑ 0.5% from previous period</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Delivery Time</h3>
            <p className="text-xl font-bold text-gray-900">32 min</p>
            <div className="mt-2 text-sm text-red-600">
              <span>↑ 3 min from previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Download Report
        </button>
        <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          Share Report
        </button>
      </div>
    </div>
  );
};

export default SalesPerformance;