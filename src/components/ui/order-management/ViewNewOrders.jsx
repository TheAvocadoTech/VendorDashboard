import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Grid, Button, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography
} from '@mui/material';
import { AccessTime, CheckCircle, Close, FilterList, Info, Refresh, ShoppingBasket, Store } from '@mui/icons-material';

// ─── Vendor Details ────────────────────────────────────────────────────────────
const vendorDetails = {
  id: 'v1',
  name: 'Ambika Traders',
  type: 'Kirana Store',
  address: '12, Gandhi Market, Sector 4, Rohini, Delhi – 110085',
  phone: '+91-98110-45678',
  email: 'ambikatraders@gmail.com',
  gstin: '07AABCA1234C1Z5',
  ownerName: 'Ramesh Gupta',
};

// ─── Demo Orders ───────────────────────────────────────────────────────────────
const dummyOrders = [
  {
    id: '1',
    orderNumber: 'ORD-AMB-001',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    items: [
      { id: 'i1', name: 'Aashirvaad Atta (5kg)', quantity: 2, price: 280 },
      { id: 'i2', name: 'Fortune Sunflower Oil (1L)', quantity: 1, price: 175 },
      { id: 'i3', name: 'Tata Salt (1kg)', quantity: 3, price: 22 },
      { id: 'i4', name: 'Parle-G Biscuits (800g)', quantity: 2, price: 95 },
    ],
    total: 959,
    status: 'new',
    store: vendorDetails,
    customer: {
      id: 'c1', name: 'Priya Sharma',
      address: '45, Shastri Nagar, Delhi – 110052',
      phone: '+91-99100-12345',
      email: 'priya.sharma@example.com',
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    specialInstructions: 'Please deliver before 11 AM',
  },
  {
    id: '2',
    orderNumber: 'ORD-AMB-002',
    createdAt: new Date(Date.now() - 27 * 60000).toISOString(),
    items: [
      { id: 'i5', name: 'Amul Full Cream Milk (500ml)', quantity: 4, price: 30 },
      { id: 'i6', name: 'Britannia Brown Bread', quantity: 2, price: 45 },
      { id: 'i7', name: 'Maggi Masala Noodles (70g x6)', quantity: 1, price: 108 },
      { id: 'i8', name: 'Lipton Green Tea (25 bags)', quantity: 1, price: 140 },
    ],
    total: 458,
    status: 'new',
    store: vendorDetails,
    customer: {
      id: 'c2', name: 'Arjun Mehta',
      address: 'B-302, Rohini Sector 10, Delhi – 110085',
      phone: '+91-98765-54321',
      email: 'arjun.mehta@example.com',
    },
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    specialInstructions: '',
  },
  {
    id: '3',
    orderNumber: 'ORD-AMB-003',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { id: 'i9',  name: 'MDH Chana Masala (100g)',  quantity: 2, price: 55 },
      { id: 'i10', name: 'Haldiram Bhujia (400g)',    quantity: 1, price: 135 },
      { id: 'i11', name: 'Surf Excel Detergent (1kg)', quantity: 1, price: 220 },
      { id: 'i12', name: 'Colgate Max Fresh (150g)',   quantity: 2, price: 92 },
      { id: 'i13', name: 'Lays Classic Salted (26g x5)', quantity: 1, price: 100 },
    ],
    total: 749,
    status: 'new',
    store: vendorDetails,
    customer: {
      id: 'c3', name: 'Sunita Verma',
      address: 'C-14, Model Town, Delhi – 110009',
      phone: '+91-91234-67890',
      email: 'sunita.verma@example.com',
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    specialInstructions: 'Ring the bell twice',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const ViewNewOrders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => { fetchOrders(); }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleCloseDetails = () => setOrderDetailsOpen(false);

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
        setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
        setLoading(false);
        setConfirmDialogOpen(false);
      }, 800);
    } catch (error) {
      console.error('Error updating order:', error);
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const getStatusColor = (status) => {
    const map = { new: 'primary', accepted: 'info', preparing: 'warning', ready: 'success', delivering: 'warning', delivered: 'success', cancelled: 'error' };
    return map[status] || 'default';
  };

  const getTimeElapsed = (createdAt) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* ── Vendor Banner ── */}
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: 2.5, borderRadius: 3,
          background: 'linear-gradient(135deg, #e65100 0%, #ff6f00 60%, #ffa726 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', gap: 2,
        }}
      >
        <Box sx={{
          width: 56, height: 56, borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Store sx={{ fontSize: 32 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {vendorDetails.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {vendorDetails.type} &nbsp;|&nbsp; {vendorDetails.address}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Owner: {vendorDetails.ownerName} &nbsp;·&nbsp; {vendorDetails.phone} &nbsp;·&nbsp; GSTIN: {vendorDetails.gstin}
          </Typography>
        </Box>
        <Chip
          label={`${orders.length} New Order${orders.length !== 1 ? 's' : ''}`}
          sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}
        />
      </Paper>

      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingBasket color="primary" />
          <Typography variant="h6" fontWeight={700}>New Orders</Typography>
        </Box>
        <Button
          variant="outlined" size="small" startIcon={loading ? <CircularProgress size={14} /> : <Refresh />}
          onClick={fetchOrders} disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* ── Orders Table ── */}
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: '#fff3e0' }}>
                {['Order #', 'Time', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#e65100', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={36} color="warning" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1, color: '#c8e6c9' }} /><br />
                    No new orders right now
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} hover sx={{ '&:hover': { bgcolor: '#fff8f0' } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#e65100', fontSize: '0.85rem' }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={formatDate(order.createdAt)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem', color: 'text.secondary' }}>
                          <AccessTime fontSize="small" />
                          {getTimeElapsed(order.createdAt)}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{order.customer.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{order.customer.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, display: 'block' }}>
                        {order.items.slice(0, 2).map(i => i.name).join(', ')}{order.items.length > 2 ? '…' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={order.paymentMethod === 'upi' ? 'UPI' : 'COD'}
                        color={order.paymentStatus === 'paid' ? 'success' : 'default'}
                        variant="outlined"
                        sx={{ fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={order.status.toUpperCase()}
                        color={getStatusColor(order.status)}
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View Details">
                          <Button
                            size="small" variant="outlined" color="info"
                            onClick={() => handleViewDetails(order)}
                            sx={{ minWidth: 0, px: 1 }}
                          >
                            <Info fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Accept Order">
                          <Button
                            size="small" variant="contained" color="success"
                            onClick={() => handleConfirmAction(order, 'accept')}
                            sx={{ minWidth: 0, px: 1 }}
                          >
                            <CheckCircle fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Reject Order">
                          <Button
                            size="small" variant="outlined" color="error"
                            onClick={() => handleConfirmAction(order, 'reject')}
                            sx={{ minWidth: 0, px: 1 }}
                          >
                            <Close fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Order Details Dialog ── */}
      <Dialog open={orderDetailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ bgcolor: '#fff3e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={700} color="#e65100">{selectedOrder.orderNumber}</Typography>
                <Typography variant="caption" color="text.secondary">{formatDate(selectedOrder.createdAt)}</Typography>
              </Box>
              <Chip label={selectedOrder.status.toUpperCase()} color={getStatusColor(selectedOrder.status)} size="small" />
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2.5 }}>

              {/* Customer */}
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Customer</Typography>
              <Paper variant="outlined" sx={{ p: 1.5, mb: 2, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600}>{selectedOrder.customer.name}</Typography>
                <Typography variant="caption" display="block" color="text.secondary">{selectedOrder.customer.phone}</Typography>
                <Typography variant="caption" display="block" color="text.secondary">{selectedOrder.customer.address}</Typography>
              </Paper>

              {/* Items */}
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Items Ordered</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#fff8f0' }}>
                      <TableCell colSpan={3} sx={{ fontWeight: 700, color: '#e65100' }}>Order Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#e65100', fontSize: '1rem' }}>
                        {formatCurrency(selectedOrder.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Payment */}
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedOrder.paymentMethod === 'upi' ? '📲 UPI' : '💵 Cash on Delivery'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                  <Chip
                    size="small"
                    label={selectedOrder.paymentStatus.toUpperCase()}
                    color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}
                    sx={{ display: 'block', width: 'fit-content', mt: 0.5 }}
                  />
                </Grid>
              </Grid>

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>Special Instructions</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fffde7' }}>
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      "{selectedOrder.specialInstructions}"
                    </Typography>
                  </Paper>
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={handleCloseDetails} variant="outlined">Close</Button>
              <Button onClick={() => { handleCloseDetails(); handleConfirmAction(selectedOrder, 'reject'); }} variant="outlined" color="error" startIcon={<Close />}>
                Reject
              </Button>
              <Button onClick={() => { handleCloseDetails(); handleConfirmAction(selectedOrder, 'accept'); }} variant="contained" color="success" startIcon={<CheckCircle />}>
                Accept Order
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Confirm Action Dialog ── */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionType === 'accept' ? '✅ Accept Order' : '❌ Reject Order'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'accept'
              ? `Confirm accepting order ${selectedOrder?.orderNumber} from ${selectedOrder?.customer?.name}?`
              : `Are you sure you want to reject order ${selectedOrder?.orderNumber}? This cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" disabled={loading}>Cancel</Button>
          <Button
            onClick={handleConfirmDialog}
            variant="contained"
            color={actionType === 'accept' ? 'success' : 'error'}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Processing…' : actionType === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ViewNewOrders;