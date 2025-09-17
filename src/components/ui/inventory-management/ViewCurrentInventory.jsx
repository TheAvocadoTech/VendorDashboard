import React, { useState, useEffect } from 'react';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

const ViewCurrentInventory = () => {
  // States
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Mock categories
  const categories = [
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

  // Mock data
  const dummyInventory = [
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
    const fetchInventory = () => {
      setIsLoading(true);
      try {
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
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (lowStockOnly && item.quantity >= 10) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'category': comparison = a.category.localeCompare(b.category); break;
        case 'price': comparison = a.price - b.price; break;
        case 'quantity': comparison = a.quantity - b.quantity; break;
        case 'lastUpdated': comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated); break;
        default: comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const exportToCSV = () => {
    alert('Export to CSV functionality would be implemented here');
  };

  const refreshInventory = () => {
    setIsLoading(true);
    setTimeout(() => {
      setInventory(dummyInventory);
      setIsLoading(false);
    }, 800);
  };

  const StockIndicator = ({ quantity }) => {
    if (quantity <= 5) return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">Very Low</span>;
    if (quantity <= 20) return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">Low</span>;
    if (quantity <= 50) return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">Medium</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">Good</span>;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header, Filters, Table, Pagination - same as TypeScript version */}
      {/* You can copy all JSX from your TypeScript code here, no changes needed in JSX */}
    </div>
  );
};

export default ViewCurrentInventory;
