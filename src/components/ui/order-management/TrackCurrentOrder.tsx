import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Badge,
  Card,
  CardContent,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  Refresh,
  LocalShipping,
  FilterList,
  Phone,
  Message,
  Store,
  ShoppingBasket,
  AccessTime,
  LocationOn,
  Person,
  Close,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

// Types
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
  phone: string;
  address: string;
}

interface OrderStatus {
  current: string;
  timestamp: number;
  history: {
    status: string;
    timestamp: number;
  }[];
}

interface Order {
  id: string;
  orderNumber: string;
  placedAt: number;
  estimatedDelivery: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customer: Customer;
  store: Store;
  paymentMethod: string;
  deliveryNotes?: string;
}

const orderStatuses = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Pending':
      return '#FFA000'; // amber
    case 'Confirmed':
      return '#1976D2'; // blue
    case 'Preparing':
      return '#7B1FA2'; // purple
    case 'Ready for Pickup':
      return '#388E3C'; // green
    case 'Out for Delivery':
      return '#D32F2F'; // red
    case 'Delivered':
      return '#388E3C'; // green
    case 'Cancelled':
      return '#616161'; // grey
    default:
      return '#757575'; // default grey
  }
};

// Mock Data
const generateMockOrders = (): Order[] => {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  
  return [
    {
      id: 'ord-001',
      orderNumber: 'MIN-10294',
      placedAt: now - 1.5 * hour,
      estimatedDelivery: now + 0.5 * hour,
      status: {
        current: 'Out for Delivery',
        timestamp: now - 0.5 * hour,
        history: [
          { status: 'Pending', timestamp: now - 1.5 * hour },
          { status: 'Confirmed', timestamp: now - 1.4 * hour },
          { status: 'Preparing', timestamp: now - hour },
          { status: 'Ready for Pickup', timestamp: now - 0.7 * hour },
          { status: 'Out for Delivery', timestamp: now - 0.5 * hour },
        ],
      },
      items: [
        { id: 'item-001', name: 'Organic Bananas', quantity: 2, price: 1.99 },
        { id: 'item-002', name: 'Whole Milk', quantity: 1, price: 3.49 },
        { id: 'item-003', name: 'Sourdough Bread', quantity: 1, price: 4.99 },
      ],
      total: 10.47,
      customer: {
        id: 'cust-001',
        name: 'Sarah Johnson',
        phone: '555-123-4567',
        address: '123 Main St, Apt 4B, Springfield',
      },
      store: {
        id: 'store-001',
        name: 'Fresh Market',
        address: '500 Oak Avenue, Springfield',
        phone: '555-987-6543',
      },
      paymentMethod: 'Credit Card',
      deliveryNotes: 'Please leave at the door',
    },
    {
      id: 'ord-002',
      orderNumber: 'MIN-10295',
      placedAt: now - hour,
      estimatedDelivery: now + hour,
      status: {
        current: 'Preparing',
        timestamp: now - 0.7 * hour,
        history: [
          { status: 'Pending', timestamp: now - hour },
          { status: 'Confirmed', timestamp: now - 0.9 * hour },
          { status: 'Preparing', timestamp: now - 0.7 * hour },
        ],
      },
      items: [
        { id: 'item-004', name: 'Chicken Breast', quantity: 1, price: 8.99 },
        { id: 'item-005', name: 'Brown Rice', quantity: 1, price: 3.29 },
        { id: 'item-006', name: 'Broccoli', quantity: 2, price: 2.49 },
        { id: 'item-007', name: 'Olive Oil', quantity: 1, price: 7.99 },
      ],
      total: 25.25,
      customer: {
        id: 'cust-002',
        name: 'Michael Chen',
        phone: '555-234-5678',
        address: '456 Elm Street, Unit 2, Springfield',
      },
      store: {
        id: 'store-002',
        name: 'Green Grocer',
        address: '250 Pine Road, Springfield',
        phone: '555-876-5432',
      },
      paymentMethod: 'Cash',
    },
    {
      id: 'ord-003',
      orderNumber: 'MIN-10293',
      placedAt: now - 3 * hour,
      estimatedDelivery: now - hour,
      status: {
        current: 'Delivered',
        timestamp: now - hour,
        history: [
          { status: 'Pending', timestamp: now - 3 * hour },
          { status: 'Confirmed', timestamp: now - 2.8 * hour },
          { status: 'Preparing', timestamp: now - 2.5 * hour },
          { status: 'Ready for Pickup', timestamp: now - 2 * hour },
          { status: 'Out for Delivery', timestamp: now - 1.5 * hour },
          { status: 'Delivered', timestamp: now - hour },
        ],
      },
      items: [
        { id: 'item-008', name: 'Orange Juice', quantity: 2, price: 4.99 },
        { id: 'item-009', name: 'Bagels', quantity: 6, price: 5.49 },
        { id: 'item-010', name: 'Cream Cheese', quantity: 1, price: 3.29 },
      ],
      total: 18.76,
      customer: {
        id: 'cust-003',
        name: 'Emily Rodriguez',
        phone: '555-345-6789',
        address: '789 Maple Drive, Springfield',
      },
      store: {
        id: 'store-001',
        name: 'Fresh Market',
        address: '500 Oak Avenue, Springfield',
        phone: '555-987-6543',
      },
      paymentMethod: 'Credit Card',
    },
    {
      id: 'ord-004',
      orderNumber: 'MIN-10296',
      placedAt: now - 0.5 * hour,
      estimatedDelivery: now + 1.5 * hour,
      status: {
        current: 'Confirmed',
        timestamp: now - 0.4 * hour,
        history: [
          { status: 'Pending', timestamp: now - 0.5 * hour },
          { status: 'Confirmed', timestamp: now - 0.4 * hour },
        ],
      },
      items: [
        { id: 'item-011', name: 'Ground Coffee', quantity: 1, price: 12.99 },
        { id: 'item-012', name: 'Almond Milk', quantity: 2, price: 4.59 },
        { id: 'item-013', name: 'Chocolate Cookies', quantity: 1, price: 3.99 },
      ],
      total: 26.16,
      customer: {
        id: 'cust-004',
        name: 'David Wilson',
        phone: '555-456-7890',
        address: '321 Cedar Lane, Springfield',
      },
      store: {
        id: 'store-003',
        name: 'Market Square',
        address: '125 Broadway, Springfield',
        phone: '555-765-4321',
      },
      paymentMethod: 'Digital Wallet',
      deliveryNotes: 'Call upon arrival',
    },
    {
      id: 'ord-005',
      orderNumber: 'MIN-10292',
      placedAt: now - 4 * hour,
      estimatedDelivery: now - 2.5 * hour,
      status: {
        current: 'Cancelled',
        timestamp: now - 3 * hour,
        history: [
          { status: 'Pending', timestamp: now - 4 * hour },
          { status: 'Confirmed', timestamp: now - 3.8 * hour },
          { status: 'Cancelled', timestamp: now - 3 * hour },
        ],
      },
      items: [
        { id: 'item-014', name: 'Potato Chips', quantity: 2, price: 3.29 },
        { id: 'item-015', name: 'Soda', quantity: 6, price: 1.29 },
        { id: 'item-016', name: 'Ice Cream', quantity: 1, price: 5.99 },
      ],
      total: 17.15,
      customer: {
        id: 'cust-005',
        name: 'Jessica Brown',
        phone: '555-567-8901',
        address: '555 Willow Avenue, Springfield',
      },
      store: {
        id: 'store-002',
        name: 'Green Grocer',
        address: '250 Pine Road, Springfield',
        phone: '555-876-5432',
      },
      paymentMethod: 'Credit Card',
    }
  ];
};

const TrackCurrentOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch data on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockOrders();
      setOrders(mockData);
      setFilteredOrders(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle filtering and searching
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status.current === statusFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.phone.includes(searchTerm) ||
        order.store.name.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm]);

  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockOrders();
      setOrders(mockData);
      setFilteredOrders(mockData);
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Orders refreshed successfully',
        severity: 'success'
      });
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleStatusChange = (e: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real application, this would make an API call
    setLoading(true);
    
    setTimeout(() => {
      const now = Date.now();
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: {
              current: newStatus,
              timestamp: now,
              history: [
                ...order.status.history,
                { status: newStatus, timestamp: now }
              ]
            }
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = updatedOrders.find(o => o.id === orderId);
        if (updatedOrder) setSelectedOrder(updatedOrder);
      }
      
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: `Order #${orderId.split('-')[1]} status updated to ${newStatus}`,
        severity: 'success'
      });
    }, 800);
  };

  const handleCancelOrder = (orderId: string) => {
    // In a real application, this would make an API call
    setLoading(true);
    
    setTimeout(() => {
      handleUpdateStatus(orderId, 'Cancelled');
    }, 800);
  };

  const handleContactCustomer = (customerId: string, method: 'phone' | 'message') => {
    // In a real application, this would handle the contact action
    setSnackbar({
      open: true,
      message: `${method === 'phone' ? 'Calling' : 'Messaging'} customer ${customerId}`,
      severity: 'info'
    });
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const currentIndex = orderStatuses.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === orderStatuses.length - 1) return null;
    return orderStatuses[currentIndex + 1];
  };

  // Status count badges
  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: orders.length };
    
    orderStatuses.forEach(status => {
      counts[status] = orders.filter(order => order.status.current === status).length;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box sx={{ padding: 3, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Order Management
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by order #, customer, or store"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                Filter by status:
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Tabs */}
      <Tabs
        value={statusFilter}
        onChange={handleStatusChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab 
          label={
            <Badge badgeContent={statusCounts.all} color="primary">
              <Typography>All Orders</Typography>
            </Badge>
          } 
          value="all" 
        />
        {orderStatuses.map(status => (
          <Tab 
            key={status} 
            label={
              <Badge badgeContent={statusCounts[status] || 0} color="primary">
                <Typography>{status}</Typography>
              </Badge>
            } 
            value={status} 
          />
        ))}
      </Tabs>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBasket sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {searchTerm || statusFilter !== 'all'
              ? "Try adjusting your search or filter to find what you're looking for."
              : 'There are no current orders to track.'}
          </Typography>
          {(searchTerm || statusFilter !== 'all') && (
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      )}

      {/* Orders List */}
      {!loading && filteredOrders.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell component="th" scope="row">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{formatDate(order.placedAt)}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.store.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.current}
                      sx={{
                        backgroundColor: getStatusColor(order.status.current),
                        color: '#fff',
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        onClick={() => handleViewDetails(order)}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Order #{selectedOrder.orderNumber}
            </Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Status Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrder.status.current}
                      sx={{
                        backgroundColor: getStatusColor(selectedOrder.status.current),
                        color: '#fff',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Ordered: {formatDate(selectedOrder.placedAt)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShipping sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {selectedOrder.status.current === 'Delivered' 
                        ? `Delivered: ${formatDate(selectedOrder.status.timestamp)}`
                        : selectedOrder.status.current === 'Cancelled'
                          ? `Cancelled: ${formatDate(selectedOrder.status.timestamp)}`
                          : `Estimated Delivery: ${formatDate(selectedOrder.estimatedDelivery)}`}
                    </Typography>
                  </Box>
                </Paper>

                {/* Status Timeline */}
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Status History
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    {[...selectedOrder.status.history].reverse().map((historyItem, index) => (
                      <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: getStatusColor(historyItem.status),
                          mt: 1,
                          mr: 2
                        }} />
                        <Box>
                          <Typography variant="body1">
                            {historyItem.status}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(historyItem.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Order Details */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body1">{selectedOrder.customer.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{selectedOrder.customer.phone}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedOrder.customer.address}</Typography>
                    </Box>
                    
                    {selectedOrder.deliveryNotes && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Delivery Notes:
                        </Typography>
                        <Typography variant="body2">{selectedOrder.deliveryNotes}</Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Phone />}
                        onClick={() => handleContactCustomer(selectedOrder.customer.id, 'phone')}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Message />}
                        onClick={() => handleContactCustomer(selectedOrder.customer.id, 'message')}
                      >
                        Message
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Store Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Store sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body1">{selectedOrder.store.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{selectedOrder.store.phone}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedOrder.store.address}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Payment Method:
                      </Typography>
                      <Typography variant="body2">{selectedOrder.paymentMethod}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Items */}
              <Grid item xs={12}>
                <Paper>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                          <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography variant="subtitle1">Total</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">{formatCurrency(selectedOrder.total)}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            {/* Left side */}
            <Box>
              {selectedOrder.status.current !== 'Delivered' && selectedOrder.status.current !== 'Cancelled' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleCancelOrder(selectedOrder.id);
                    handleCloseDetails();
                  }}
                  startIcon={<Cancel />}
                >
                  Cancel Order
                </Button>
              )}
            </Box>
            
            {/* Right side */}
            <Box>
              <Button onClick={handleCloseDetails} sx={{ mr: 1 }}>
                Close
              </Button>
              
              {getNextStatus(selectedOrder.status.current) && selectedOrder.status.current !== 'Cancelled' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const nextStatus = getNextStatus(selectedOrder.status.current);
                    if (nextStatus) {
                      handleUpdateStatus(selectedOrder.id, nextStatus);
                    }
                  }}
                  startIcon={<CheckCircle />}
                >
                  Mark as {getNextStatus(selectedOrder.status.current)}
                </Button>
              )}
            </Box>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default TrackCurrentOrders;