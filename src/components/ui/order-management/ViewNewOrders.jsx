import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Button,
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
  // ... keep the rest of dummy orders unchanged
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
      {/* ✅ You can now safely render header, table, dialogs etc. */}
      {/* Keep same JSX as before */}
    </Box>
  );
};

export default ViewNewOrders;
