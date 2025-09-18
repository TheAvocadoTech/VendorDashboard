import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy data generator
const generateDummySalesData = () => {
  const today = new Date();
  const data = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseFactor = isWeekend ? 1.5 : 1;

    const orders = Math.floor(Math.random() * 30 * baseFactor) + 20;
    const averageOrderValue = Math.floor(Math.random() * 20) + 30;
    const revenue = orders * averageOrderValue;

    data.push({
      date: date.toISOString().split("T")[0],
      orders,
      averageOrderValue,
      revenue,
    });
  }

  return data;
};

// Dummy Pie chart data
const dummySalesByCategory = [
  { name: "Fresh Produce", value: 35 },
  { name: "Dairy & Eggs", value: 20 },
  { name: "Bakery", value: 15 },
  { name: "Snacks", value: 12 },
  { name: "Beverages", value: 10 },
  { name: "Other", value: 8 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

function SalesPerformance() {
  const [timeRange, setTimeRange] = useState("30days");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    growthRate: 0,
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateDummySalesData();
      setSalesData(data);

      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
      const averageOrderValue = totalRevenue / totalOrders;

      const midpoint = Math.floor(data.length / 2);
      const firstHalfRevenue = data
        .slice(0, midpoint)
        .reduce((sum, item) => sum + item.revenue, 0);
      const secondHalfRevenue = data
        .slice(midpoint)
        .reduce((sum, item) => sum + item.revenue, 0);
      const growthRate =
        ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;

      setSummaryMetrics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        growthRate,
      });

      setLoading(false);
    }, 800);
  }, [timeRange]);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Performance</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h3 className="text-xl font-bold">
            {formatCurrency(summaryMetrics.totalRevenue)}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h3 className="text-xl font-bold">{summaryMetrics.totalOrders}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <h3 className="text-xl font-bold">
            {formatCurrency(summaryMetrics.averageOrderValue)}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Growth Rate</p>
          <h3 className="text-xl font-bold">
            {summaryMetrics.growthRate.toFixed(2)}%
          </h3>
        </div>
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dummySalesByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={(entry) => `${entry.name} (${entry.value}%)`}
            >
              {dummySalesByCategory.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesPerformance;
