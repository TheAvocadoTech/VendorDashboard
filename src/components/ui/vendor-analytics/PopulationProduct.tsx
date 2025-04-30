import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

// Types definitions
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
}

// Mock data for development
const mockCategories: Category[] = [
  { _id: '1', name: 'Fruits & Vegetables' },
  { _id: '2', name: 'Dairy & Eggs' },
  { _id: '3', name: 'Bakery' },
  { _id: '4', name: 'Beverages' },
  { _id: '5', name: 'Snacks' },
  { _id: '6', name: 'Household' }
];

const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Organic Bananas',
    description: 'Fresh organic bananas, bundle of 6',
    price: 2.99,
    stock: 50,
    category: '1',
    imageUrl: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2025-04-15T10:30:00Z',
    updatedAt: '2025-04-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Whole Milk',
    description: 'Farm fresh whole milk, 1 gallon',
    price: 3.49,
    stock: 30,
    category: '2',
    imageUrl: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2025-04-14T09:15:00Z',
    updatedAt: '2025-04-15T11:20:00Z'
  },
  {
    _id: '3',
    name: 'Sourdough Bread',
    description: 'Freshly baked artisan sourdough bread',
    price: 4.99,
    stock: 15,
    category: '3',
    imageUrl: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2025-04-13T14:45:00Z',
    updatedAt: '2025-04-15T08:10:00Z'
  },
  {
    _id: '4',
    name: 'Sparkling Water',
    description: 'Refreshing sparkling water, pack of 12',
    price: 8.99,
    stock: 40,
    category: '4',
    imageUrl: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2025-04-12T16:20:00Z',
    updatedAt: '2025-04-14T13:30:00Z'
  },
  {
    _id: '5',
    name: 'Potato Chips',
    description: 'Crispy salted potato chips, family size',
    price: 3.29,
    stock: 25,
    category: '5',
    imageUrl: 'https://via.placeholder.com/150',
    isActive: false,
    createdAt: '2025-04-10T11:10:00Z',
    updatedAt: '2025-04-15T09:50:00Z'
  }
];

const PopulationProduct: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  
  // Product form state
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    isActive: true
  });
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Notification state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Load initial data
  useEffect(() => {
    // In a real application, you would fetch data from your API
    // For now, we'll use the mock data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setProducts(mockProducts);
        setCategories(mockCategories);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dialog handlers
  const openAddDialog = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: '',
      isActive: true
    });
    setPreviewUrl('');
    setSelectedFile(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct({ ...product });
    setPreviewUrl(product.imageUrl);
    setSelectedFile(null);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name as string]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: checked
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0) {
        setSnackbar({
          open: true,
          message: 'Please fill all required fields.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      // In a real application, you would upload the file and save the product to your API
      // For now, we'll simulate the API call and update the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isEditing && currentProduct._id) {
        // Update existing product
        const updatedProducts = products.map(product => 
          product._id === currentProduct._id ? { 
            ...currentProduct as Product, 
            updatedAt: new Date().toISOString(),
            imageUrl: previewUrl || currentProduct.imageUrl
          } : product
        );
        
        setProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success'
        });
      } else {
        // Add new product
        const newProduct: Product = {
          _id: Date.now().toString(), // In a real app, this would come from the backend
          ...currentProduct as Omit<Product, '_id' | 'createdAt' | 'updatedAt'>,
          imageUrl: previewUrl || 'https://via.placeholder.com/150',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setProducts([...products, newProduct]);
        setSnackbar({
          open: true,
          message: 'Product added successfully!',
          severity: 'success'
        });
      }
      
      setLoading(false);
      closeDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: isEditing ? 'Failed to update product.' : 'Failed to add product.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      
      // In a real application, you would call your API to delete the product
      // For now, we'll just update the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProducts = products.filter(product => product._id !== productId);
      setProducts(updatedProducts);
      
      setSnackbar({
        open: true,
        message: 'Product deleted successfully!',
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete product.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      setLoading(true);
      
      // In a real application, you would call your API to update the product status
      // For now, we'll just update the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProducts = products.map(p => 
        p._id === product._id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() } : p
      );
      setProducts(updatedProducts);
      
      setSnackbar({
        open: true,
        message: `Product ${product.isActive ? 'deactivated' : 'activated'} successfully!`,
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update product status.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  // Filter and sort functions
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    const matchesStatus = statusFilter === 'all' ? true : 
                          statusFilter === 'active' ? product.isActive : 
                          !product.isActive;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortField as keyof Product];
    let bValue: any = b[sortField as keyof Product];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Get category name from id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render loading state
  if (loading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error && products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Add Product
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Product List" />
        <Tab label="Bulk Upload" />
        <Tab label="Product Analytics" />
      </Tabs>

      {/* Product List Tab */}
      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search products"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
              }}
              sx={{ flexGrow: 1, minWidth: '200px' }}
            />
            
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: '120px' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Product Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell 
                    onClick={() => handleSort('name')} 
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Product Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('price')} 
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Price
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('stock')} 
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Stock
                      {sortField === 'stock' && (
                        sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No products found. Try adjusting your filters or add a new product.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box 
                          component="img" 
                          src={product.imageUrl} 
                          alt={product.name}
                          sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {product.description}
                        </Typography>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{getCategoryName(product.category)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.isActive ? "Active" : "Inactive"} 
                          color={product.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => openEditDialog(product)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color={product.isActive ? "warning" : "success"}
                            onClick={() => handleToggleStatus(product)}
                          >
                            {product.isActive ? (
                              <Chip label="Deactivate" size="small" color="warning" />
                            ) : (
                              <Chip label="Activate" size="small" color="success" />
                            )}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Bulk Upload Tab */}
      {tabValue === 1 && (
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk Upload Products
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload a CSV file with your product information. The file should include columns for name, description, price, stock, and category.
            </Typography>
            
            <Box sx={{ mt: 2, mb: 4 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Select CSV File
                <input
                  type="file"
                  accept=".csv"
                  hidden
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Maximum file size: 5MB
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled
              >
                Upload and Process
              </Button>
              <Button
                variant="text"
                color="primary"
                sx={{ ml: 2 }}
                onClick={() => {
                  // In a real app, this would download a template
                  setSnackbar({
                    open: true,
                    message: 'Template downloaded successfully!',
                    severity: 'success'
                  });
                }}
              >
                Download Template
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Statistics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Total Products</Typography>
                    <Typography variant="body1" fontWeight="bold">{products.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Active Products</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {products.filter(p => p.isActive).length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Out of Stock Products</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {products.filter(p => p.stock === 0).length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Low Stock Products (&lt;10)</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {products.filter(p => p.stock > 0 && p.stock < 10).length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Distribution
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {categories.map(category => {
                    const count = products.filter(p => p.category === category._id).length;
                    const percentage = (count / products.length) * 100 || 0;
                    
                    return (
                      <Box key={category._id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{category.name}</Typography>
                          <Typography variant="body2">{count} products ({percentage.toFixed(1)}%)</Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: '#f0f0f0', 
                            borderRadius: 1, 
                            overflow: 'hidden' 
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              bgcolor: 'primary.main' 
                            }} 
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Product Info */}
              <TextField
                name="name"
                label="Product Name"
                value={currentProduct.name || ''}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              
              <TextField
                name="description"
                label="Description"
                value={currentProduct.description || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="price"
                    label="Price ($)"
                    type="number"
                    value={currentProduct.price || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="stock"
                    label="Stock"
                    type="number"
                    value={currentProduct.stock || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </Grid>
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={currentProduct.category || ''}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <FormControl component="fieldset">
                  <Box display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={currentProduct.isActive || false}
                      onChange={handleCheckboxChange}
                      id="product-active"
                    />
                    <label htmlFor="product-active" style={{ marginLeft: '8px' }}>
                      <Typography variant="body2">
                        Product is active and available for purchase
                      </Typography>
                    </label>
                  </Box>
                </FormControl>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {/* Product Image */}
              <Typography variant="subtitle1" gutterBottom>
                Product Image
              </Typography>
              
              <Box 
                sx={{ 
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  minHeight: '200px',
                  mt: 2
                }}
              >
                {previewUrl ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Product preview"
                      sx={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'contain',
                        mb: 2
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      component="label"
                      sx={{ mt: 1 }}
                    >
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Upload a product image (PNG, JPG, WEBP)
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      component="label"
                    >
                      Select Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Recommended image size: 800x800 pixels (1:1 ratio)
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Maximum file size: 5MB
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              isEditing ? 'Update Product' : 'Add Product'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PopulationProduct;