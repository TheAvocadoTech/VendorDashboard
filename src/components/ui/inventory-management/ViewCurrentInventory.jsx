import React, { useState, useEffect } from 'react';
import { 
  Search,
  // Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

// Types for our inventory items
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  supplier: string;
  lastUpdated: string;
  expiryDate?: string;
}

// Category type for filter options
interface CategoryOption {
  value: string;
  label: string;
}

const ViewCurrentInventory: React.FC = () => {
  // States
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Mock categories
  const categories: CategoryOption[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'household', label: 'Household' },
  ];

  // Mock data - This would normally come from your API
  const dummyInventory: InventoryItem[] = [
    { id: '1', name: 'Apples', category: 'fruits', price: 1.99, quantity: 120, unit: 'kg', supplier: 'Local Farms Inc.', lastUpdated: '2025-04-25' },
    { id: '2', name: 'Milk', category: 'dairy', price: 2.49, quantity: 50, unit: 'L', supplier: 'Dairy Fresh', lastUpdated: '2025-04-28', expiryDate: '2025-05-10' },
    { id: '3', name: 'Bread', category: 'bakery', price: 3.29, quantity: 35, unit: 'loaf', supplier: 'City Bakery', lastUpdated: '2025-04-29', expiryDate: '2025-05-05' },
    { id: '4', name: 'Chicken Breast', category: 'frozen', price: 8.99, quantity: 25, unit: 'kg', supplier: 'Farm Foods', lastUpdated: '2025-04-27', expiryDate: '2025-06-15' },
    { id: '5', name: 'Carrots', category: 'vegetables', price: 1.49, quantity: 80, unit: 'kg', supplier: 'Local Farms Inc.', lastUpdated: '2025-04-26' },
    { id: '6', name: 'Orange Juice', category: 'beverages', price: 3.99, quantity: 40, unit: 'L', supplier: 'Fresh Squeeze Co.', lastUpdated: '2025-04-28', expiryDate: '2025-05-20' },
    { id: '7', name: 'Potato Chips', category: 'snacks', price: 2.99, quantity: 65, unit: 'pack', supplier: 'Snack Foods Ltd.', lastUpdated: '2025-04-24', expiryDate: '2025-07-15' },
    { id: '8', name: 'Tomatoes', category: 'vegetables', price: 2.49, quantity: 70, unit: 'kg', supplier: 'Local Farms Inc.', lastUpdated: '2025-04-25' },
    { id: '9', name: 'Yogurt', category: 'dairy', price: 1.79, quantity: 45, unit: 'cup', supplier: 'Dairy Fresh', lastUpdated: '2025-04-28', expiryDate: '2025-05-12' },
    { id: '10', name: 'Pasta', category: 'bakery', price: 1.29, quantity: 90, unit: 'pack', supplier: 'Italian Imports', lastUpdated: '2025-04-23' },
    { id: '11', name: 'Ice Cream', category: 'frozen', price: 4.99, quantity: 30, unit: 'tub', supplier: 'Creamy Delights', lastUpdated: '2025-04-22', expiryDate: '2025-06-22' },
    { id: '12', name: 'Bananas', category: 'fruits', price: 0.99, quantity: 150, unit: 'kg', supplier: 'Tropical Imports', lastUpdated: '2025-04-29' },
    { id: '13', name: 'Eggs', category: 'dairy', price: 3.49, quantity: 5, unit: 'dozen', supplier: 'Free Range Farms', lastUpdated: '2025-04-28', expiryDate: '2025-05-15' },
    { id: '14', name: 'Toilet Paper', category: 'household', price: 7.99, quantity: 12, unit: 'pack', supplier: 'Clean Home Products', lastUpdated: '2025-04-20' },
    { id: '15', name: 'Dish Soap', category: 'household', price: 2.99, quantity: 8, unit: 'bottle', supplier: 'Clean Home Products', lastUpdated: '2025-04-21' },
    { id: '16', name: 'Strawberries', category: 'fruits', price: 3.99, quantity: 40, unit: 'box', supplier: 'Berry Farms', lastUpdated: '2025-04-29', expiryDate: '2025-05-04' },
    { id: '17', name: 'Coffee', category: 'beverages', price: 8.99, quantity: 25, unit: 'bag', supplier: 'Mountain Brew', lastUpdated: '2025-04-26' },
    { id: '18', name: 'Cereal', category: 'bakery', price: 4.29, quantity: 3, unit: 'box', supplier: 'Morning Foods', lastUpdated: '2025-04-23', expiryDate: '2025-08-23' },
  ];

  // Load inventory data
  useEffect(() => {
    // This would be your API call in a real app
    const fetchInventory = () => {
      setIsLoading(true);
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          setInventory(dummyInventory);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load inventory data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter(item => {
      // Search query filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // Low stock filter (items with quantity less than 10)
      if (lowStockOnly && item.quantity >= 10) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

  // Function to toggle sort order
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Function to handle item deletion (would connect to API in real app)
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  // Function to export inventory as CSV
  const exportToCSV = () => {
    // In a real app, you would implement proper CSV export
    alert('Export to CSV functionality would be implemented here');
  };

  // Function to refresh inventory data
  const refreshInventory = () => {
    setIsLoading(true);
    // Simulate fetch delay
    setTimeout(() => {
      setInventory(dummyInventory);
      setIsLoading(false);
    }, 800);
  };

  // Stock level indicator component
  const StockIndicator: React.FC<{ quantity: number }> = ({ quantity }) => {
    if (quantity <= 5) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">Very Low</span>;
    } else if (quantity <= 20) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">Low</span>;
    } else if (quantity <= 50) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">Medium</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">Good</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Current Inventory</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            onClick={() => alert('Add new item functionality would be implemented here')}
          >
            <Plus size={16} className="mr-2" />
            Add New Item
          </button>
          
          <button 
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={exportToCSV}
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
          
          <button 
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            onClick={refreshInventory}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="lastUpdated">Sort by Last Updated</option>
            </select>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStockFilter"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={lowStockOnly}
                onChange={() => setLowStockOnly(!lowStockOnly)}
              />
              <label htmlFor="lowStockFilter" className="text-gray-700">
                Low Stock Only
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-xl mb-2">No inventory items found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Product Name
                    {sortBy === 'name' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortBy === 'category' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortBy === 'price' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortBy === 'quantity' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastUpdated')}
                >
                  <div className="flex items-center">
                    Last Updated
                    {sortBy === 'lastUpdated' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{item.quantity} {item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StockIndicator quantity={item.quantity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{item.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                      {item.expiryDate && 
                        <div className="text-xs text-red-500 mt-1">
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </div>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => alert(`Edit item ${item.id}`)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        {!isLoading && filteredInventory.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredInventory.length)}
                </span>{" "}
                of <span className="font-medium">{filteredInventory.length}</span> results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pagination around current page
                let pageNum = 1;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Items per page:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCurrentInventory;