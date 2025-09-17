const React = require("react");
const { useState, useEffect } = React;
const {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} = require("recharts");

// Dummy data
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

const dummyProductPerformance = [
  { name: "Fresh Vegetables", sales: 245, revenue: 9800 },
  { name: "Dairy Products", sales: 187, revenue: 7480 },
  { name: "Bakery Items", sales: 134, revenue: 5360 },
  { name: "Snacks", sales: 156, revenue: 4680 },
  { name: "Beverages", sales: 145, revenue: 4350 },
  { name: "Frozen Foods", sales: 92, revenue: 3680 },
  { name: "Organic Products", sales: 68, revenue: 3400 },
  { name: "Canned Goods", sales: 76, revenue: 1900 },
];

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
    return React.createElement(
      "div",
      { className: "flex items-center justify-center h-screen" },
      React.createElement(
        "div",
        { className: "text-center" },
        React.createElement("div", {
          className: "spinner-border text-primary",
          role: "status",
        }),
        React.createElement("p", { className: "mt-2" }, "Loading sales data...")
      )
    );
  }

  return React.createElement(
    "div",
    { className: "p-6 bg-gray-50 min-h-screen" },
    // Header
    React.createElement(
      "div",
      { className: "flex justify-between items-center mb-6" },
      React.createElement("h1", { className: "text-2xl font-bold text-gray-800" }, "Sales Performance"),
      React.createElement(
        "select",
        {
          value: timeRange,
          onChange: (e) => setTimeRange(e.target.value),
          className: "px-3 py-2 border rounded-md shadow-sm",
        },
        React.createElement("option", { value: "7days" }, "Last 7 Days"),
        React.createElement("option", { value: "30days" }, "Last 30 Days"),
        React.createElement("option", { value: "90days" }, "Last 90 Days"),
        React.createElement("option", { value: "year" }, "This Year")
      )
    ),
    // Metrics
    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" },
      React.createElement(
        "div",
        { className: "bg-white rounded-lg shadow-md p-4" },
        React.createElement("p", { className: "text-sm text-gray-500" }, "Total Revenue"),
        React.createElement("h3", { className: "text-xl font-bold" }, formatCurrency(summaryMetrics.totalRevenue))
      ),
      React.createElement(
        "div",
        { className: "bg-white rounded-lg shadow-md p-4" },
        React.createElement("p", { className: "text-sm text-gray-500" }, "Total Orders"),
        React.createElement("h3", { className: "text-xl font-bold" }, summaryMetrics.totalOrders)
      ),
      React.createElement(
        "div",
        { className: "bg-white rounded-lg shadow-md p-4" },
        React.createElement("p", { className: "text-sm text-gray-500" }, "Avg Order Value"),
        React.createElement("h3", { className: "text-xl font-bold" }, formatCurrency(summaryMetrics.averageOrderValue))
      ),
      React.createElement(
        "div",
        { className: "bg-white rounded-lg shadow-md p-4" },
        React.createElement("p", { className: "text-sm text-gray-500" }, "Growth Rate"),
        React.createElement(
          "h3",
          { className: "text-xl font-bold" },
          summaryMetrics.growthRate.toFixed(2),
          "%"
        )
      )
    ),
    // Chart
    React.createElement(
      "div",
      { className: "bg-white rounded-lg shadow-md p-4 mb-6" },
      React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Revenue Trend"),
      React.createElement(
        ResponsiveContainer,
        { width: "100%", height: 300 },
        React.createElement(
          LineChart,
          { data: salesData },
          React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
          React.createElement(XAxis, { dataKey: "date" }),
          React.createElement(YAxis, null),
          React.createElement(Tooltip, null),
          React.createElement(Legend, null),
          React.createElement(Line, { type: "monotone", dataKey: "revenue", stroke: "#8884d8", activeDot: { r: 8 } }),
          React.createElement(Line, { type: "monotone", dataKey: "orders", stroke: "#82ca9d" })
        )
      )
    ),
    // Pie Chart
    React.createElement(
      "div",
      { className: "bg-white rounded-lg shadow-md p-4" },
      React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Sales by Category"),
      React.createElement(
        ResponsiveContainer,
        { width: "100%", height: 300 },
        React.createElement(
          PieChart,
          null,
          React.createElement(
            Pie,
            {
              data: dummySalesByCategory,
              cx: "50%",
              cy: "50%",
              labelLine: false,
              outerRadius: 100,
              fill: "#8884d8",
              dataKey: "value",
              label: (entry) => `${entry.name} (${entry.value}%)`,
            },
            dummySalesByCategory.map((entry, index) =>
              React.createElement(Cell, { key: index, fill: COLORS[index % COLORS.length] })
            )
          ),
          React.createElement(Tooltip, null)
        )
      )
    )
  );
}

module.exports = SalesPerformance;
