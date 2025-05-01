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
  // Divider, 
  Grid, 
  IconButton, 
  Paper, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  Tooltip, 
  Typography 
} from '@mui/material';
import { 
  AccessTime, 
  CheckCircle, 
  Close, 
  // Details, 
  // Done, 
  FilterList, 
  Info, 
  Refresh, 
  // Search, 
  ShoppingBasket 
} from '@mui/icons-material';

// Define types for order and related data
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  store: Store;
  customer: Customer;
  paymentMethod: 'cash' | 'credit_card' | 'online';
  paymentStatus: 'pending' | 'paid';
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
}

// Dummy data for initial development
const dummyOrders: Order[] = [
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

const ViewNewOrders: React.FC = () => {
  // State management
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

  // Fetch orders - in real implementation, this would call your API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // In real implementation, replace with API call
      // const response = await axios.get('/api/orders/new');
      // setOrders(response.data);
      
      // Simulating API delay with dummy data
      setTimeout(() => {
        setOrders(dummyOrders);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      // Handle error state
    }
  };

  // Initial data load
  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination handlers
  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle viewing order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  // Handle closing the order details dialog
  const handleCloseDetails = () => {
    setOrderDetailsOpen(false);
  };

  // Handle accept/reject confirmation
  const handleConfirmAction = (order: Order, action: 'accept' | 'reject') => {
    setSelectedOrder(order);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  // Handle confirming the action
  const handleConfirmDialog = async () => {
    if (!selectedOrder || !actionType) return;
    
    setLoading(true);
    try {
      // In real implementation, replace with API call
      // For accept: await axios.put(`/api/orders/${selectedOrder.id}/status`, { status: 'accepted' });
      // For reject: await axios.put(`/api/orders/${selectedOrder.id}/status`, { status: 'cancelled' });
      
      // Simulating API call and updating state
      setTimeout(() => {
        const updatedOrders = orders.filter(order => order.id !== selectedOrder.id);
        setOrders(updatedOrders);
        setLoading(false);
        setConfirmDialogOpen(false);
        
        // Show success message or notification here
      }, 800);
    } catch (error) {
      console.error(`Error ${actionType === 'accept' ? 'accepting' : 'rejecting'} order:`, error);
      setLoading(false);
      setConfirmDialogOpen(false);
      // Handle error state
    }
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Get status chip color
  const getStatusColor = (status: Order['status']) => {
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

  // Calculate time elapsed since order creation
  const getTimeElapsed = (createdAt: string) => {
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          New Orders
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            onClick={() => {/* Add filter functionality */}}
          >
            Filter
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Refresh />}
            onClick={() => fetchOrders()}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total New Orders
              </Typography>
              <Typography variant="h4">
                {orders.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Waiting for acceptance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Order Value
              </Typography>
              <Typography variant="h4">
                ${orders.length > 0 ? 
                  (orders.reduce((acc, order) => acc + order.total, 0) / orders.length).toFixed(2) : 
                  '0.00'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Today's orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Oldest Order
              </Typography>
              <Typography variant="h4">
                {orders.length > 0 ? 
                  getTimeElapsed(orders.reduce((oldest, order) => 
                    new Date(oldest.createdAt) < new Date(order.createdAt) ? oldest : order
                  , orders[0]).createdAt) : 
                  'No orders'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Waiting time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Response Rate
              </Typography>
              <Typography variant="h4">
                98%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 400,
            textAlign: 'center'
          }}>
            <ShoppingBasket sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No New Orders
            </Typography>
            <Typography variant="body2" color="textSecondary">
              New orders will appear here. Check again later or refresh.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />} 
              sx={{ mt: 2 }}
              onClick={() => fetchOrders()}
            >
              Refresh
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="new orders table">
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Store</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Payment</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow hover key={order.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              size="small" 
                              label={order.status.toUpperCase()} 
                              color={getStatusColor(order.status)}
                              sx={{ mr: 1 }}
                            />
                            {order.orderNumber}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {formatDate(order.createdAt)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                              {getTimeElapsed(order.createdAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{order.customer.name}</Typography>
                            <Typography variant="caption" color="textSecondary">{order.customer.phone}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{order.store.name}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            size="small" 
                            label={order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'} 
                            color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Tooltip title="View Details">
                              <IconButton onClick={() => handleViewDetails(order)} size="small">
                                <Info />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Accept Order">
                              <IconButton 
                                onClick={() => handleConfirmAction(order, 'accept')} 
                                color="success"
                                size="small"
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject Order">
                              <IconButton 
                                onClick={() => handleConfirmAction(order, 'reject')} 
                                color="error"
                                size="small"
                              >
                                <Close />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Order Details: {selectedOrder.orderNumber}
                </Typography>
                <Chip 
                  label={selectedOrder.status.toUpperCase()} 
                  color={getStatusColor(selectedOrder.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Customer Info */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Customer Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {selectedOrder.customer.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Phone:</strong> {selectedOrder.customer.phone}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {selectedOrder.customer.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Delivery Address:</strong> {selectedOrder.customer.address}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Store Info */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Store Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {selectedOrder.store.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Phone:</strong> {selectedOrder.store.phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {selectedOrder.store.address}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Order Details */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Order Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Payment Method:</strong> {selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Payment Status:</strong> {selectedOrder.paymentStatus.toUpperCase()}
                      </Typography>
                      {selectedOrder.specialInstructions && (
                        <Typography variant="body2" gutterBottom>
                          <strong>Special Instructions:</strong> {selectedOrder.specialInstructions}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Items
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                              <TableCell align="right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right">
                              <Typography variant="subtitle2">Order Total:</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2">${selectedOrder.total.toFixed(2)}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => {
                  handleCloseDetails();
                  handleConfirmAction(selectedOrder, 'reject');
                }}
              >
                Reject Order
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => {
                  handleCloseDetails();
                  handleConfirmAction(selectedOrder, 'accept');
                }}
              >
                Accept Order
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          {actionType === 'accept' ? 'Accept Order' : 'Reject Order'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'accept' 
              ? `Are you sure you want to accept order ${selectedOrder?.orderNumber}? This will notify the store to start preparing the order.`
              : `Are you sure you want to reject order ${selectedOrder?.orderNumber}? This action cannot be undone.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDialog} 
            color={actionType === 'accept' ? 'success' : 'error'}
            variant="contained"
            autoFocus
          >
            {actionType === 'accept' ? 'Yes, Accept' : 'Yes, Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewNewOrders;