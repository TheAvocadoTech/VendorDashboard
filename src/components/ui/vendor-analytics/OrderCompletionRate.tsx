import React from 'react';
import { 
  Calendar, 
  Filter, 
  Download, 
  ArrowUp, 
  ArrowDown,
  RefreshCcw
} from 'lucide-react';

const OrderCompletionRate: React.FC = () => {
  // Static data for display
  const staticData = [
    { date: '2023-05-01', totalOrders: 45, completedOrders: 40, cancelledOrders: 5, completionRate: 88.89 },
    { date: '2023-05-02', totalOrders: 52, completedOrders: 48, cancelledOrders: 4, completionRate: 92.31 },
    { date: '2023-05-03', totalOrders: 38, completedOrders: 35, cancelledOrders: 3, completionRate: 92.11 }
  ];

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            May 1 - May 3, 2023
          </span>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-sm appearance-none"
              defaultValue="daily"
            >
              <option value="daily">Last 7 Days</option>
              <option value="weekly">Last 4 Weeks</option>
              <option value="monthly">Last 6 Months</option>
              <option value="yearly">Last 12 Months</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm">
            <Download size={16} />
            <span>Export</span>
          </button>
          
          <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm">
            <RefreshCcw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Completion Rate Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Completion Rate</p>
              <h3 className="text-2xl font-semibold">91.11%</h3>
            </div>
            <div className="p-2 rounded-full bg-gray-100">
              <div className="text-blue-500">↑</div>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-green-500">
            <ArrowUp size={16} />
            <span className="ml-1">5.2% from previous period</span>
          </div>
        </div>
        
        {/* Total Orders Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Orders</p>
              <h3 className="text-2xl font-semibold">135</h3>
            </div>
            <div className="p-2 rounded-full bg-gray-100">
              <div className="text-purple-500">↗</div>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-green-500">
            <ArrowUp size={16} />
            <span className="ml-1">3.8% from previous period</span>
          </div>
        </div>
        
        {/* Cancellation Rate Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Cancellation Rate</p>
              <h3 className="text-2xl font-semibold">8.89%</h3>
            </div>
            <div className="p-2 rounded-full bg-gray-100">
              <div className="text-red-500">↓</div>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-red-500">
            <ArrowDown size={16} />
            <span className="ml-1">2.1% from previous period</span>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 h-72 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Completion Rate Trend Chart</p>
          <p className="text-sm mt-2">(Chart visualization would appear here)</p>
        </div>
      </div>

      {/* Order Breakdown Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 h-72 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Order Breakdown Chart</p>
          <p className="text-sm mt-2">(Bar chart visualization would appear here)</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Detailed Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cancelled Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staticData.map((item, index) => (
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
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.completionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletionRate;