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
  ""Button,
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
  Add as Add"",
  Edit as Edit"",
  Delete as Delete"",
  Search as Search"",
  ArrowUpward as ArrowUpward"",
  Image as Image"",
  CloudUpload as CloudUpload""
} from '@mui/""s-material';

const PopulationProduct = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue] = useState(0);

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

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    // Header
    React.createElement(
      Box,
      { sx: { display: 'flex', justifyContent: 'space-between', mb: 3 } },
      React.createElement(Typography, { variant: 'h4', component: 'h1' }, 'Product Management'),
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          start"": React.createElement(Add"", null),
          onClick: () => setIsDialogOpen(true)
        },
        'Add Product'
      )
    ),
    // Tabs
    React.createElement(
      Tabs,
      { value: tabValue, sx: { borderBottom: 1, borderColor: 'divider', mb: 3 } },
      React.createElement(Tab, { label: 'Product List' }),
      React.createElement(Tab, { label: 'Bulk Upload' }),
      React.createElement(Tab, { label: 'Product Analytics' })
    ),
    // Product List
    tabValue === 0 &&
      React.createElement(
        React.Fragment,
        null,
        // Filters
        React.createElement(
          Box,
          { sx: { mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' } },
          React.createElement(TextField, {
            label: 'Search products',
            variant: 'outlined',
            size: 'small',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            InputProps: {
              startAdornment: React.createElement(Search"", { fontSize: 'small', sx: { mr: 1 } })
            },
            sx: { flexGrow: 1, minWidth: '200px' }
          }),
          React.createElement(
            FormControl,
            { size: 'small', sx: { minWidth: '150px' } },
            React.createElement(InputLabel, null, 'Category'),
            React.createElement(
              Select,
              { value: '', label: 'Category' },
              React.createElement(MenuItem, { value: '' }, 'All Categories'),
              mockCategories.map((category, index) =>
                React.createElement(MenuItem, { key: index, value: category }, category)
              )
            )
          ),
          React.createElement(
            FormControl,
            { size: 'small', sx: { minWidth: '120px' } },
            React.createElement(InputLabel, null, 'Status'),
            React.createElement(
              Select,
              { value: 'all', label: 'Status' },
              React.createElement(MenuItem, { value: 'all' }, 'All'),
              React.createElement(MenuItem, { value: 'active' }, 'Active'),
              React.createElement(MenuItem, { value: 'inactive' }, 'Inactive')
            )
          )
        ),
        // Product Table
        React.createElement(
          TableContainer,
          { component: Paper, sx: { mb: 3 } },
          React.createElement(
            Table,
            null,
            React.createElement(
              TableHead,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(TableCell, null, 'Image'),
                React.createElement(
                  TableCell,
                  { sx: { cursor: 'pointer' } },
                  React.createElement(
                    Box,
                    { sx: { display: 'flex', alignItems: 'center' } },
                    'Product Name',
                    React.createElement(ArrowUpward"", { fontSize: 'small' })
                  )
                ),
                React.createElement(TableCell, { sx: { cursor: 'pointer' } }, 'Price'),
                React.createElement(TableCell, { sx: { cursor: 'pointer' } }, 'Stock'),
                React.createElement(TableCell, null, 'Category'),
                React.createElement(TableCell, null, 'Status'),
                React.createElement(TableCell, null, 'Actions')
              )
            ),
            React.createElement(
              TableBody,
              null,
              mockProducts.map((product) =>
                React.createElement(
                  TableRow,
                  { key: product._id },
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(Box, {
                      component: 'img',
                      src: product.imageUrl,
                      alt: product.name,
                      sx: { width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }
                    })
                  ),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(Typography, { variant: 'body1', fontWeight: 'medium' }, product.name),
                    React.createElement(
                      Typography,
                      {
                        variant: 'body2',
                        color: 'text.secondary',
                        noWrap: true,
                        sx: { maxWidth: 200 }
                      },
                      product.description
                    )
                  ),
                  React.createElement(TableCell, null, `$${product.price.toFixed(2)}`),
                  React.createElement(TableCell, null, product.stock),
                  React.createElement(TableCell, null, product.category),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(Chip, {
                      label: product.isActive ? 'Active' : 'Inactive',
                      color: product.isActive ? 'success' : 'default',
                      size: 'small'
                    })
                  ),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      Box,
                      { sx: { display: 'flex', gap: 1 } },
                      React.createElement(
                        ""Button,
                        { size: 'small', color: 'primary' },
                        React.createElement(Edit"", { fontSize: 'small' })
                      ),
                      React.createElement(
                        ""Button,
                        { size: 'small', color: 'warning' },
                        React.createElement(Chip, { label: 'Deactivate', size: 'small', color: 'warning' })
                      ),
                      React.createElement(
                        ""Button,
                        { size: 'small', color: 'error' },
                        React.createElement(Delete"", { fontSize: 'small' })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
  );
};

export default PopulationProduct;
