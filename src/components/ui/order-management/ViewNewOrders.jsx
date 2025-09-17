import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Grid, 
  IconButton, 
  Paper, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Tooltip, 
  Typography 
} from '@mui/material';
import { 
  AccessTime, 
  CheckCircle, 
  Close, 
  FilterList, 
  Info, 
  Refresh, 
  ShoppingBasket 
} from '@mui/icons-material';

// Dummy data for initial development
const dummyOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001-2025',
    createdAt: '2025-04-30T09:15:00',
    items: [
      { id: 'i1', name: 'Milk', quantity: 2, price: 3.99 },
      { id: 'i2', name: 'Bread', quantity: 1, price: 2.49 },
      { id: 'i3', name: 'Eggs (dozen)', quantity: 1, price: 4.99 }
    ],
    total: 15.46,
    status: 'new',
    store: {
      id: 's1',
      name: 'QuickMart',
      address: '123 Main St',
      phone: '555-123-4567'
    },
    customer: {
      id: 'c1',
      name: 'John Doe',
      address: '456 Elm Street, Apt 7B',
      phone: '555-987-6543',
      email: 'john.doe@example.com'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    specialInstructions: 'Please leave at front door'
  },
  {
    id: '2',
    orderNumber: 'ORD-002-2025',
    createdAt: '2025-04-30T10:05:00',
    items: [
      { id: 'i4', name: 'Tomatoes', quantity: 4, price: 0.99 },
      { id: 'i5', name: 'Chicken Breast', quantity: 2, price: 7.99 },
      { id: 'i6', name: 'Rice (2kg)', quantity: 1, price: 5.49 }
    ],
    total: 23.44,
    status: 'new',
    store: {
      id: 's2',
      name: 'FreshFoods',
      address: '789 Market Ave',
      phone: '555-222-3333'
    },
    customer: {
      id: 'c2',
      name: 'Jane Smith',
      address: '101 Pine Road',
      phone: '555-444-5555',
      email: 'jane.smith@example.com'
    },
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    specialInstructions: 'Call upon arrival'
  },
  {
    id: '3',
    orderNumber: 'ORD-003-2025',
    createdAt: '2025-04-30T10:30:00',
    items: [
      { id: 'i7', name: 'Apples', quantity: 6, price: 0.79 },
      { id: 'i8', name: 'Orange Juice', quantity: 2, price: 3.99 },
      { id: 'i9', name: 'Cereal', quantity: 1, price: 4.29 }
    ],
    total: 17.51,
    status: 'new',
    store: {
      id: 's1',
      name: 'QuickMart',
      address: '123 Main St',
      phone: '555-123-4567'
    },
    customer: {
      id: 'c3',
      name: 'Robert Johnson',
      address: '222 Oak Drive',
      phone: '555-666-7777',
      email: 'robert.j@example.com'
    },
    paymentMethod: 'online',
    paymentStatus: 'paid'
  },
  {
    id: '4',
    orderNumber: 'ORD-004-2025',
    createdAt: '2025-04-30T11:15:00',
    items: [
      { id: 'i10', name: 'Pasta', quantity: 2, price: 1.29 },
      { id: 'i11', name: 'Pasta Sauce', quantity: 1, price: 3.49 },
      { id: 'i12', name: 'Ground Beef', quantity: 1, price: 8.99 },
      { id: 'i13', name: 'Garlic Bread', quantity: 1, price: 2.99 }
    ],
    total: 18.05,
    status: 'new',
    store: {
      id: 's3',
      name: 'GroceryPlus',
      address: '555 Center Blvd',
      phone: '555-888-9999'
    },
    customer: {
      id: 'c4',
      name: 'Maria Garcia',
      address: '333 Maple Court',
      phone: '555-111-2222',
      email: 'maria.g@example.com'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    specialInstructions: 'Fragile items, handle with care'
  },
  {
    id: '5',
    orderNumber: 'ORD-005-2025',
    createdAt: '2025-04-30T11:45:00',
    items: [
      { id: 'i14', name: 'Water (12-pack)', quantity: 1, price: 5.99 },
      { id: 'i15', name: 'Chips', quantity: 3, price: 3.49 },
      { id: 'i16', name: 'Salsa', quantity: 1, price: 4.29 },
      { id: 'i17', name: 'Soda', quantity: 2, price: 1.99 }
    ],
    total: 24.73,
    status: 'new',
    store: {
      id: 's2',
      name: 'FreshFoods',
      address: '789 Market Ave',
      phone: '555-222-3333'
    },
    customer: {
      id: 'c5',
      name: 'David Wilson',
      address: '444 Beach Street',
      phone: '555-333-4444',
      email: 'david.w@example.com'
    },
    paymentMethod: 'cash',
    paymentStatus: 'pending'
  }
];

const ViewNewOrders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [loading, setLoading] = useState(false);
  const [page] = useState(0);
  const [rowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setOrders(dummyOrders);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setOrderDetailsOpen(false);
  };

  const handleConfirmAction = (order, action) => {
    setSelectedOrder(order);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialog = async () => {
    if (!selectedOrder || !actionType) return;

    setLoading(true);
    try {
      setTimeout(() => {
        const updatedOrders = orders.filter(order => order.id !== selectedOrder.id);
        setOrders(updatedOrders);
        setLoading(false);
        setConfirmDialogOpen(false);
      }, 800);
    } catch (error) {
      console.error(`Error updating order:`, error);
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'accepted': return 'info';
      case 'preparing': return 'warning';
      case 'ready': return 'success';
      case 'delivering': return 'warning';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTimeElapsed = (createdAt) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const diff = currentTime - orderTime;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* header, cards, table, dialogs - unchanged */}
      {/* 👆 keep same JSX from your TypeScript version */}
    </Box>
  );
};

export default ViewNewOrders;
