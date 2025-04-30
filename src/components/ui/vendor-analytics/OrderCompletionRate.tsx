import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Calendar, 
  Filter, 
  Download, 
  ArrowUp, 
  ArrowDown,
  RefreshCcw
} from 'lucide-react';

// Types
interface OrderCompletionData {
  date: string;
  completionRate: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface FilterOption {
  id: string;
  label: string;
}

interface AnalyticCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

// Dummy data for demonstration
const generateDummyData = (days: number): OrderCompletionData[] => {
  const data: OrderCompletionData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const totalOrders = Math.floor(Math.random() * 50) + 30;
    const completedOrders = Math.floor(Math.random() * totalOrders);
    const cancelledOrders = totalOrders - completedOrders;
    const completionRate = (completedOrders / totalOrders) * 100;
    
    data.push({
      date: date.toISOString().split('T')[0],
      completionRate: parseFloat(completionRate.toFixed(2)),
      totalOrders,
      completedOrders,
      cancelledOrders
    });
  }
  
  return data;
};

// Dummy data for different time periods
const dummyData = {
  daily: generateDummyData(7),
  weekly: generateDummyData(4),
  monthly: generateDummyData(6),
  yearly: generateDummyData(12)
};

// Filter options
const timeFilterOptions: FilterOption[] = [
  { id: 'daily', label: 'Last 7 Days' },
  { id: 'weekly', label: 'Last 4 Weeks' },
  { id: 'monthly', label: 'Last 6 Months' },
  { id: 'yearly', label: 'Last 12 Months' }
];

// Analytic Card Component
const AnalyticCard: React.FC<AnalyticCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <div className="p-2 rounded-full bg-gray-100">{icon}</div>
      </div>
      <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-1">{Math.abs(change)}% from previous period</span>
      </div>
    </div>
  );
};

const OrderCompletionRate: React.FC = () => {
  // State
  const [timeFilter, setTimeFilter] = useState<string>('daily');
  const [data, setData] = useState<OrderCompletionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  // Calculate the overall completion rate
  const calculateOverallRate = (data: OrderCompletionData[]): number => {
    if (data.length === 0) return 0;
    
    const totalCompletedOrders = data.reduce((sum, item) => sum + item.completedOrders, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.totalOrders, 0);
    
    return totalOrders === 0 ? 0 : parseFloat(((totalCompletedOrders / totalOrders) * 100).toFixed(2));
  };

  // Calculate the change compared to previous period
  const calculateChange = (currentData: OrderCompletionData[]): number => {
    if (currentData.length === 0) return 0;
    
    // For simplicity, we'll compare the first half vs second half of the data
    const midpoint = Math.floor(currentData.length / 2);
    
    const firstHalf = currentData.slice(0, midpoint);
    const secondHalf = currentData.slice(midpoint);
    
    const firstHalfRate = calculateOverallRate(firstHalf);
    const secondHalfRate = calculateOverallRate(secondHalf);
    
    if (firstHalfRate === 0) return 0;
    const change = ((secondHalfRate - firstHalfRate) / firstHalfRate) * 100;
    
    return parseFloat(change.toFixed(2));
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Load data based on selected filter
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const filteredData = dummyData[timeFilter as keyof typeof dummyData] || [];
        setData(filteredData);
        
        if (filteredData.length > 0) {
          setDateRange({
            start: filteredData[0].date,
            end: filteredData[filteredData.length - 1].date
          });
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, [timeFilter]);

  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setTimeFilter(filterId);
  };

  // Calculate analytics
  const overallCompletionRate = calculateOverallRate(data);
  const completionRateChange = calculateChange(data);
  
  const totalOrders = data.reduce((sum, item) => sum + item.totalOrders, 0);
  const totalOrdersChange = 5.2; // Dummy change percentage
  
  const cancelRate = data.length === 0 ? 0 : 
    parseFloat((data.reduce((sum, item) => sum + item.cancelledOrders, 0) / totalOrders * 100).toFixed(2));
  const cancelRateChange = -3.1; // Dummy change percentage

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(generateDummyData(timeFilter === 'daily' ? 7 : timeFilter === 'weekly' ? 4 : timeFilter === 'monthly' ? 6 : 12));
      setIsLoading(false);
    }, 800);
  };

  // Handle export data
  const handleExportData = () => {
    // In a real application, this would generate and download a CSV/Excel file
    alert('Export functionality would be implemented here in a real application');
  };

  return (
    <div className="p-6 max-w-full overflow-x-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Order Completion Rate</h1>
        <p className="text-gray-600">
          Track and analyze your store's order completion performance over time
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {dateRange.start && dateRange.end
              ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
              : 'Select date range'}
          </span>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={timeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              {timeFilterOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <button 
            className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50"
            onClick={handleExportData}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          <button 
            className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm font-medium underline"
            onClick={handleRefresh}
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-24 bg-gray-200 rounded w-full max-w-4xl"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticCard 
              title="Completion Rate" 
              value={`${overallCompletionRate}%`} 
              change={completionRateChange} 
              icon={<LineChart size={24} className="text-blue-500" />} 
            />
            <AnalyticCard 
              title="Total Orders" 
              value={totalOrders} 
              change={totalOrdersChange} 
              icon={<Bar size={24} className="text-purple-500" />} 
            />
            <AnalyticCard 
              title="Cancellation Rate" 
              value={`${cancelRate}%`} 
              change={cancelRateChange} 
              icon={<ArrowDown size={24} className="text-red-500" />} 
            />
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Completion Rate Trend</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Completion Rate']}
                    labelFormatter={(label) => `Date: ${formatDate(label.toString())}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completionRate" 
                    name="Completion Rate" 
                    stroke="#3B82F6" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Breakdown</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${formatDate(label.toString())}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="completedOrders" 
                    name="Completed Orders" 
                    fill="#10B981" 
                    stackId="a" 
                  />
                  <Bar 
                    dataKey="cancelledOrders" 
                    name="Cancelled Orders" 
                    fill="#EF4444" 
                    stackId="a" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Detailed Data</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancelled Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.completedOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.cancelledOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                          item.completionRate >= 75 ? 'bg-blue-100 text-blue-800' :
                          item.completionRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.completionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {data.length === 0 && !isLoading && (
              <div className="py-8 text-center">
                <p className="text-gray-500">No data available for the selected time period.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* No Data State */}
      {!isLoading && !error && data.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <div className="mb-4">
            <LineChart size={48} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No order data available</h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any order data for the selected time period.
          </p>
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleRefresh}
          >
            <RefreshCcw size={16} className="mr-2" />
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCompletionRate;