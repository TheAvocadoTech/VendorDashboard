import React, { useState } from 'react';
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
 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
 
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

  Image as ImageIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const PopulationProduct: React.FC = () => {
  // Basic state for UI elements
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue] = useState(0);

  // Mock data for display only
  const mockProducts = [
    {
      _id: '1',
      name: 'Organic Bananas',
      description: 'Fresh organic bananas, bundle of 6',
      price: 2.99,
      stock: 50,
      category: 'Fruits & Vegetables',
      imageUrl: 'https://via.placeholder.com/150',
      isActive: true
    },
    {
      _id: '2',
      name: 'Whole Milk',
      description: 'Farm fresh whole milk, 1 gallon',
      price: 3.49,
      stock: 30,
      category: 'Dairy & Eggs',
      imageUrl: 'https://via.placeholder.com/150',
      isActive: true
    }
  ];

  const mockCategories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Bakery',
    'Beverages'
  ];

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
          onClick={() => setIsDialogOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
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
                value=""
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {mockCategories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: '120px' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value="all"
                label="Status"
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
                  <TableCell sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Product Name
                      <ArrowUpwardIcon fontSize="small" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Price
                    </Box>
                  </TableCell>
                  <TableCell sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Stock
                    </Box>
                  </TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockProducts.map((product) => (
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
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.isActive ? "Active" : "Inactive"} 
                        color={product.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="warning">
                          <Chip label="Deactivate" size="small" color="warning" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
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
              Upload a CSV file with your product information.
            </Typography>
            
            <Box sx={{ mt: 2, mb: 4 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Select CSV File
                <input type="file" accept=".csv" hidden />
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
                    <Typography variant="body1" fontWeight="bold">5</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add New Product
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Name"
                fullWidth
                required
                margin="normal"
              />
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Price ($)"
                    type="number"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  {mockCategories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
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
                <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" paragraph>
                  Upload a product image
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  component="label"
                >
                  Select Image
                  <input type="file" accept="image/*" hidden />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PopulationProduct;