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
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Define support request types
interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'order' | 'payment' | 'delivery' | 'account' | 'technical' | 'other';
  createdAt: Date;
  updatedAt: Date;
  orderReference?: string;
  assignedTo?: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  supportRequestId: string;
  sender: 'customer' | 'support';
  senderName: string;
  message: string;
  createdAt: Date;
}

// Dummy data for demonstration
const dummySupportRequests: SupportRequest[] = [
  {
    id: 'SR-001',
    userId: 'U123',
    userName: 'John Smith',
    userEmail: 'john.smith@example.com',
    subject: 'Order #ORD-5678 not delivered',
    message: 'I placed an order yesterday but it hasn\'t been delivered yet. The app shows it as delivered but I didn\'t receive anything.',
    status: 'open',
    priority: 'high',
    category: 'delivery',
    createdAt: new Date('2025-04-29T10:30:00'),
    updatedAt: new Date('2025-04-29T10:30:00'),
    orderReference: 'ORD-5678',
    replies: []
  },
  {
    id: 'SR-002',
    userId: 'U456',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@example.com',
    subject: 'Payment issue with recent order',
    message: 'I was charged twice for my order #ORD-8901. Please refund the extra payment.',
    status: 'in-progress',
    priority: 'medium',
    category: 'payment',
    createdAt: new Date('2025-04-28T15:45:00'),
    updatedAt: new Date('2025-04-30T09:15:00'),
    orderReference: 'ORD-8901',
    assignedTo: 'Agent001',
    replies: [
      {
        id: 'RPL-001',
        supportRequestId: 'SR-002',
        sender: 'support',
        senderName: 'Support Agent',
        message: 'I can see the duplicate charge. I have initiated a refund which should appear in your account within 3-5 business days.',
        createdAt: new Date('2025-04-30T09:15:00')
      }
    ]
  },
  {
    id: 'SR-003',
    userId: 'U789',
    userName: 'Michael Davis',
    userEmail: 'michael.d@example.com',
    subject: 'Missing items in delivery',
    message: 'My order #ORD-2345 was missing 3 items that I paid for: tomatoes, bread, and cheese.',
    status: 'resolved',
    priority: 'medium',
    category: 'order',
    createdAt: new Date('2025-04-27T08:20:00'),
    updatedAt: new Date('2025-04-28T11:10:00'),
    orderReference: 'ORD-2345',
    assignedTo: 'Agent002',
    replies: [
      {
        id: 'RPL-002',
        supportRequestId: 'SR-003',
        sender: 'support',
        senderName: 'Support Agent',
        message: 'I apologize for the missing items. We will issue a refund for these items to your account.',
        createdAt: new Date('2025-04-27T14:30:00')
      },
      {
        id: 'RPL-003',
        supportRequestId: 'SR-003',
        sender: 'customer',
        senderName: 'Michael Davis',
        message: 'Thank you, I received the refund.',
        createdAt: new Date('2025-04-28T10:15:00')
      },
      {
        id: 'RPL-004',
        supportRequestId: 'SR-003',
        sender: 'support',
        senderName: 'Support Agent',
        message: 'You\'re welcome! Let us know if you need anything else.',
        createdAt: new Date('2025-04-28T11:10:00')
      }
    ]
  },
  {
    id: 'SR-004',
    userId: 'U321',
    userName: 'Emily Wilson',
    userEmail: 'emily.w@example.com',
    subject: 'Can\'t update my delivery address',
    message: 'I\'m trying to change my delivery address in the app but keep getting an error message. Please help.',
    status: 'open',
    priority: 'low',
    category: 'technical',
    createdAt: new Date('2025-04-30T16:05:00'),
    updatedAt: new Date('2025-04-30T16:05:00'),
    replies: []
  },
  {
    id: 'SR-005',
    userId: 'U654',
    userName: 'Robert Chen',
    userEmail: 'robert.c@example.com',
    subject: 'Need to cancel my subscription',
    message: 'I want to cancel my premium subscription but can\'t find the option in my account settings.',
    status: 'closed',
    priority: 'low',
    category: 'account',
    createdAt: new Date('2025-04-25T09:45:00'),
    updatedAt: new Date('2025-04-26T14:20:00'),
    assignedTo: 'Agent003',
    replies: [
      {
        id: 'RPL-005',
        supportRequestId: 'SR-005',
        sender: 'support',
        senderName: 'Support Agent',
        message: 'To cancel your subscription, go to Profile > Subscriptions > Manage > Cancel. Let me know if you need further assistance.',
        createdAt: new Date('2025-04-25T11:30:00')
      },
      {
        id: 'RPL-006',
        supportRequestId: 'SR-005',
        sender: 'customer',
        senderName: 'Robert Chen',
        message: 'Found it, thanks! I\'ve cancelled successfully.',
        createdAt: new Date('2025-04-26T13:45:00')
      },
      {
        id: 'RPL-007',
        supportRequestId: 'SR-005',
        sender: 'support',
        senderName: 'Support Agent',
        message: 'Great! Your subscription will remain active until the end of the current billing period. We\'ve closed this ticket, but feel free to reach out if you have any other questions.',
        createdAt: new Date('2025-04-26T14:20:00')
      }
    ]
  },
  {
    id: 'SR-006',
    userId: 'U987',
    userName: 'Jessica Brown',
    userEmail: 'jessica.b@example.com',
    subject: 'Wrong store for my order',
    message: 'I selected Store A for my order #ORD-7123 but items came from Store B and some substitutions were made that I didn\'t approve.',
    status: 'in-progress',
    priority: 'high',
    category: 'order',
    createdAt: new Date('2025-04-29T13:15:00'),
    updatedAt: new Date('2025-04-30T10:45:00'),
    orderReference: 'ORD-7123',
    assignedTo: 'Agent001',
    replies: [
      {
        id: 'RPL-008',
        supportRequestId: 'SR-006',
        sender: 'support',
        senderName: 'Support Agent',
        message: 'I apologize for this mix-up. I\'m looking into why this happened and what we can do to make it right.',
        createdAt: new Date('2025-04-30T10:45:00')
      }
    ]
  }
];

// Main Support Request Component
const SupportRequest: React.FC = () => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(dummySupportRequests);
  const [filteredRequests, setFilteredRequests] = useState<SupportRequest[]>(dummySupportRequests);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: string, to: string}>({
    from: '',
    to: ''
  });

  // Status tab labels and their corresponding statuses
  const statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' }
  ];

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [tabValue, searchTerm, statusFilter, priorityFilter, categoryFilter, dateRangeFilter, supportRequests]);

  // Apply all active filters to the support requests
  const applyFilters = () => {
    let result = [...supportRequests];

    // Apply status tab filter
    if (tabValue > 0) {
      const status = statusTabs[tabValue].value;
      result = result.filter(request => request.status === status);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.subject.toLowerCase().includes(term) ||
        request.message.toLowerCase().includes(term) ||
        request.userName.toLowerCase().includes(term) ||
        request.userEmail.toLowerCase().includes(term) ||
        (request.orderReference && request.orderReference.toLowerCase().includes(term))
      );
    }

    // Apply status filter (from advanced filter dialog)
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(request => request.priority === priorityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(request => request.category === categoryFilter);
    }

    // Apply date range filter
    if (dateRangeFilter.from) {
      const fromDate = new Date(dateRangeFilter.from);
      result = result.filter(request => new Date(request.createdAt) >= fromDate);
    }
    if (dateRangeFilter.to) {
      const toDate = new Date(dateRangeFilter.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(request => new Date(request.createdAt) <= toDate);
    }

    setFilteredRequests(result);
  };

  // Reset all filters
  const resetFilters = () => {
    setTabValue(0);
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setDateRangeFilter({ from: '', to: '' });
    setFilterDialogOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleReplyOpen = (request: SupportRequest) => {
    setSelectedRequest(request);
    setReplyDialogOpen(true);
  };

  const handleEditRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
    setEditDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedRequest || !replyMessage.trim()) return;

    const newReply: Reply = {
      id: `RPL-${Math.floor(Math.random() * 10000)}`,
      supportRequestId: selectedRequest.id,
      sender: 'support',
      senderName: 'Support Agent',
      message: replyMessage,
      createdAt: new Date()
    };

    // Update the support request with the new reply
    const updatedRequests = supportRequests.map(request => {
      if (request.id === selectedRequest.id) {
        // If status is 'open', change to 'in-progress'
        const newStatus = request.status === 'open' ? 'in-progress' : request.status;
        return {
          ...request,
          status: newStatus,
          replies: [...request.replies, newReply],
          updatedAt: new Date(),
          assignedTo: request.assignedTo || 'Agent001' // Assign if not already assigned
        };
      }
      return request;
    });

    setSupportRequests(updatedRequests);
    setReplyMessage('');
    setReplyDialogOpen(false);
    // Keep view dialog open to see the updated conversation
  };

  const handleUpdateRequest = (updatedData: Partial<SupportRequest>) => {
    if (!selectedRequest) return;

    const updatedRequests = supportRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          ...updatedData,
          updatedAt: new Date()
        };
      }
      return request;
    });

    setSupportRequests(updatedRequests);
    setEditDialogOpen(false);
    // Update the selected request for the view dialog
    setSelectedRequest({
      ...selectedRequest,
      ...updatedData,
      updatedAt: new Date()
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    // In a real application, you would make an API call to delete
    const updatedRequests = supportRequests.filter(request => request.id !== requestId);
    setSupportRequests(updatedRequests);
    setViewDialogOpen(false);
  };

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get color for status chip
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get color for priority chip
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'info';
      case 'medium':
        return 'success';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Support Requests
      </Typography>
      
      {/* Tabs for quick status filtering */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          {statusTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Search and filter toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          placeholder="Search requests..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        <Button 
          variant="outlined" 
          startIcon={<FilterListIcon />}
          onClick={() => setFilterDialogOpen(true)}
        >
          Filters
        </Button>
        
        <Tooltip title="Refresh">
          <IconButton onClick={resetFilters}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Support requests table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>
                      {request.subject}
                      {request.orderReference && (
                        <Typography variant="body2" color="textSecondary">
                          Order: {request.orderReference}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.userName}
                      <Typography variant="body2" color="textSecondary">
                        {request.userEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')} 
                        color={getStatusColor(request.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} 
                        color={getPriorityColor(request.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>
                      {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewRequest(request)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reply">
                        <IconButton 
                          size="small" 
                          onClick={() => handleReplyOpen(request)}
                          disabled={request.status === 'closed'}
                        >
                          <ReplyIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No support requests match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Support Request Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6">
                  {selectedRequest.subject}
                  <Typography variant="body2" color="textSecondary">
                    Request ID: {selectedRequest.id}
                    {selectedRequest.orderReference && ` • Order: ${selectedRequest.orderReference}`}
                  </Typography>
                </Typography>
                <IconButton onClick={() => setViewDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  {/* Request details and conversation */}
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2">Original Request:</Typography>
                    <Typography variant="body1" paragraph>
                      {selectedRequest.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Submitted on {formatDate(selectedRequest.createdAt)}
                    </Typography>
                  </Paper>

                  {/* Conversation history */}
                  {selectedRequest.replies.length > 0 && (
                    <Typography variant="subtitle1" gutterBottom>
                      Conversation History:
                    </Typography>
                  )}
                  
                  {selectedRequest.replies.map((reply) => (
                    <Paper 
                      key={reply.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        ml: reply.sender === 'support' ? 0 : 4,
                        mr: reply.sender === 'support' ? 4 : 0,
                        bgcolor: reply.sender === 'support' ? 'primary.light' : 'background.paper'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">
                          {reply.senderName} 
                          {reply.sender === 'support' && ' (Support)'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(reply.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {reply.message}
                      </Typography>
                    </Paper>
                  ))}

                  {/* Quick reply section if not closed */}
                  {selectedRequest.status !== 'closed' && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<ReplyIcon />}
                        onClick={() => handleReplyOpen(selectedRequest)}
                        fullWidth
                      >
                        Reply to Customer
                      </Button>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {/* Request metadata */}
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Request Details
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Status</Typography>
                      <Chip 
                        label={selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1).replace('-', ' ')} 
                        color={getStatusColor(selectedRequest.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Priority</Typography>
                      <Chip 
                        label={selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)} 
                        color={getPriorityColor(selectedRequest.priority) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Category</Typography>
                      <Typography>
                        {selectedRequest.category.charAt(0).toUpperCase() + selectedRequest.category.slice(1)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Customer</Typography>
                      <Typography>{selectedRequest.userName}</Typography>
                      <Typography variant="body2">{selectedRequest.userEmail}</Typography>
                    </Box>
                    
                    {selectedRequest.assignedTo && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">Assigned To</Typography>
                        <Typography>{selectedRequest.assignedTo}</Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Last Updated</Typography>
                      <Typography>{formatDate(selectedRequest.updatedAt)}</Typography>
                    </Box>
                    
                    {/* Action buttons */}
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 1 }}
                        onClick={() => handleEditRequest(selectedRequest)}
                      >
                        Edit Request
                      </Button>
                      
                      {selectedRequest.status !== 'closed' && (
                        <Button
                          variant="outlined"
                          color="success"
                          fullWidth
                          sx={{ mb: 1 }}
                          onClick={() => handleUpdateRequest({ status: selectedRequest.status === 'resolved' ? 'closed' : 'resolved' })}
                        >
                          Mark as {selectedRequest.status === 'resolved' ? 'Closed' : 'Resolved'}
                        </Button>
                      )}
                      
                      {selectedRequest.status === 'closed' && (
                        <Button
                          variant="outlined"
                          color="warning"
                          fullWidth
                          sx={{ mb: 1 }}
                          onClick={() => handleUpdateRequest({ status: 'open' })}
                        >
                          Reopen Request
                        </Button>
                      )}
                      
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleDeleteRequest(selectedRequest.id)}
                      >
                        Delete Request
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Reply to {selectedRequest.userName}
                </Typography>
                <IconButton onClick={() => setReplyDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                Re: {selectedRequest.subject}
              </Typography>
              
              {/* Original request and latest reply */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
                <Typography variant="body2" color="textSecondary">
                  Original request:
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedRequest.message}
                </Typography>
                
                {selectedRequest.replies.length > 0 && (
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Latest reply:
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.replies[selectedRequest.replies.length - 1].message}
                    </Typography>
                  </>
                )}
              </Paper>
              
              {/* Reply text field */}
              <TextField
                autoFocus
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSendReply}
                disabled={!replyMessage.trim()}
              >
                Send Reply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Request Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Edit Support Request
                </Typography>
                <IconButton onClick={() => setEditDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Subject"
                  fullWidth
                  margin="normal"
                  defaultValue={selectedRequest.subject}
                  variant="outlined"
                  onChange={(e) => {
                    const updatedSubject = e.target.value;
                    setSelectedRequest({
                      ...selectedRequest,
                      subject: updatedSubject
                    });
                  }}
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedRequest.status}
                    label="Status"
                    onChange={(e) => {
                      const updatedStatus = e.target.value as SupportRequest['status'];
                      setSelectedRequest({
                        ...selectedRequest,
                        status: updatedStatus
                      });
                    }}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={selectedRequest.priority}
                    label="Priority"
                    onChange={(e) => {
                      const updatedPriority = e.target.value as SupportRequest['priority'];
                      setSelectedRequest({
                        ...selectedRequest,
                        priority: updatedPriority
                      });
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedRequest.category}
                    label="Category"
                    onChange={(e) => {
                      const updatedCategory = e.target.value as SupportRequest['category'];
                      setSelectedRequest({
                        ...selectedRequest,
                        category: updatedCategory
                      });
                    }}
                  >
                    <MenuItem value="order">Order</MenuItem>
                    <MenuItem value="payment">Payment</MenuItem>
                    <MenuItem value="delivery">Delivery</MenuItem>
                    <MenuItem value="account">Account</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Assigned To"
                  fullWidth
                  margin="normal"
                  defaultValue={selectedRequest.assignedTo || ''}
                  variant="outlined"
                  onChange={(e) => {
                    const updatedAssignedTo = e.target.value;
                    setSelectedRequest({
                      ...selectedRequest,
                      assignedTo: updatedAssignedTo
                    });
                  }}
                />
                
                {selectedRequest.orderReference && (
                  <TextField
                    label="Order Reference"
                    fullWidth
                    margin="normal"
                    defaultValue={selectedRequest.orderReference}
                    variant="outlined"
                    onChange={(e) => {
                      const updatedOrderReference = e.target.value;
                      setSelectedRequest({
                        ...selectedRequest,
                        orderReference: updatedOrderReference
                      });
                    }}
                  />
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleUpdateRequest(selectedRequest)}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Advanced Filters
            </Typography>
            <IconButton onClick={() => setFilterDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="order">Order</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                  <MenuItem value="account">Account</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="From Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateRangeFilter.from}
                onChange={(e) => setDateRangeFilter({
                  ...dateRangeFilter,
                  from: e.target.value
                })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="To Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateRangeFilter.to}
                onChange={(e) => setDateRangeFilter({
                  ...dateRangeFilter,
                  to: e.target.value
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters}>Clear Filters</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              applyFilters();
              setFilterDialogOpen(false);
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupportRequest;