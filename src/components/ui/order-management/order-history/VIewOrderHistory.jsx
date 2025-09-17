import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Grid,
  ""Button,
  CircularProgress,
  alpha
} from '@mui/material';
import { Search, FilterList, Refresh, ArrowForward } from '@mui/""s-material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    cursor: 'pointer'
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const StatusChip = styled(Chip)(() => ({
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.7rem'
}));

// Dummy data generator
const generateDummyOrders = (count) => {
  const statuses = ['pending', 'processing', 'completed', 'cancelled', 'delivered'];
  const stores = ['Fresh Mart', 'Quick Grocery', 'Neighborhood Store', 'Super Saver', 'Organic Heaven'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    store: stores[Math.floor(Math.random() * stores.length)],
    date: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toISOString(),
    items: Math.floor(Math.random() * 15) + 1,
    amount: parseFloat((Math.random() * 200 + 10).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    deliveryAddress: `${Math.floor(Math.random() * 100) + 1} Main St, Apt ${Math.floor(Math.random() * 50) + 1}`
  }));
};

const ViewOrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Initialize with dummy data
  useEffect(() => {
    const timer = setTimeout(() => {
      const dummyOrders = generateDummyOrders(50);
      setOrders(dummyOrders);
      setFilteredOrders(dummyOrders);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = orders;
    
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.store.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
    setPage(1);
  }, [searchTerm, statusFilter, orders]);

  const handleViewOrder = (orderId) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    const dummyOrders = generateDummyOrders(50);
    setOrders(dummyOrders);
    setFilteredOrders(dummyOrders);
    setLoading(false);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'processing':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Pagination calculations
  const count = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Order History
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          start""={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search orders by ID or store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              startAdornment={
                <InputAdornment position="start">
                  <FilterList color="action" />
                </InputAdornment>
              }
              displayEmpty
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="textSecondary" align="right">
            {filteredOrders.length} orders found
          </Typography>
        </Grid>
      </Grid>

      {/* Order Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }} aria-label="order history table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.paper' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Store</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <StyledTableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.store}</TableCell>
                      <TableCell>{dayjs(order.date).format('MMM D, YYYY h:mm A')}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusChip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.deliveryAddress}
                      </TableCell>
                      <TableCell>
                        <""Button
                          color="primary"
                          onClick={() => handleViewOrder(order.id)}
                          aria-label={`View order ${order.id}`}
                        >
                          <ArrowForward />
                        </""Button>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No orders found matching your criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={count}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ViewOrderHistory;
