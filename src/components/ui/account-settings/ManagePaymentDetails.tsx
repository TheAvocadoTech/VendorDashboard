import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  TextField, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  MenuItem, 
  Select, 
  Snackbar, 
  Alert,
  IconButton,
  Divider,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Types
interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  isDefault: boolean;
  name: string;
  lastFour?: string;
  expiryDate?: string;
  cardType?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  dateAdded: string;
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  method: string;
  description: string;
}

// Dummy Data
const dummyPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    isDefault: true,
    name: 'Business Visa',
    lastFour: '4242',
    expiryDate: '12/26',
    cardType: 'visa',
    dateAdded: '2024-04-01'
  },
  {
    id: '2',
    type: 'card',
    isDefault: false,
    name: 'Personal Mastercard',
    lastFour: '5678',
    expiryDate: '09/25',
    cardType: 'mastercard',
    dateAdded: '2024-03-15'
  },
  {
    id: '3',
    type: 'bank',
    isDefault: false,
    name: 'Business Checking',
    bankName: 'Chase Bank',
    accountNumber: '******7890',
    routingNumber: '******1234',
    dateAdded: '2024-01-10'
  }
];

const dummyPaymentHistory: PaymentHistoryItem[] = [
  {
    id: 'txn1',
    date: '2024-04-25',
    amount: 299.99,
    status: 'success',
    method: 'Business Visa (****4242)',
    description: 'Monthly subscription'
  },
  {
    id: 'txn2',
    date: '2024-04-20',
    amount: 19.99,
    status: 'success',
    method: 'Personal Mastercard (****5678)',
    description: 'Additional storage fee'
  },
  {
    id: 'txn3',
    date: '2024-04-15',
    amount: 49.99,
    status: 'failed',
    method: 'Business Visa (****4242)',
    description: 'Premium feature add-on'
  },
  {
    id: 'txn4', 
    date: '2024-04-05', 
    amount: 149.99, 
    status: 'pending', 
    method: 'Business Checking (******7890)', 
    description: 'Quarterly service fee'
  }
];

// Months and Years for credit card expiry selection
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const years: string[] = [];
const currentYear = new Date().getFullYear();

for (let i = 0; i < 15; i++) {
  years.push((currentYear + i).toString());
}

const ManagePaymentDetails: React.FC = () => {
  // State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(dummyPaymentMethods);
  const [paymentHistory] = useState<PaymentHistoryItem[]>(dummyPaymentHistory);
  const [selectedTab, setSelectedTab] = useState<'methods' | 'history'>('methods');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);
  const [paymentType, setPaymentType] = useState<'card' | 'bank'>('card');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // New payment method form state
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiryMonth: months[0],
    expiryYear: years[0],
    cvv: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    isDefault: false
  });

  const handleTabChange = (tab: 'methods' | 'history') => {
    setSelectedTab(tab);
  };

  const handleOpenAddDialog = () => {
    setPaymentType('card');
    setFormData({
      name: '',
      cardNumber: '',
      expiryMonth: months[0],
      expiryYear: years[0],
      cvv: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      isDefault: false
    });
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (method: PaymentMethod) => {
    setCurrentMethod(method);
    setPaymentType(method.type);
    
    if (method.type === 'card') {
      setFormData({
        name: method.name,
        cardNumber: `************${method.lastFour}`,
        expiryMonth: method.expiryDate?.split('/')[0] || months[0],
        expiryYear: method.expiryDate ? `20${method.expiryDate.split('/')[1]}` : years[0],
        cvv: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        isDefault: method.isDefault
      });
    } else {
      setFormData({
        name: method.name,
        cardNumber: '',
        expiryMonth: months[0],
        expiryYear: years[0],
        cvv: '',
        bankName: method.bankName || '',
        accountNumber: method.accountNumber?.replace('******', '') || '',
        routingNumber: method.routingNumber?.replace('******', '') || '',
        isDefault: method.isDefault
      });
    }
    
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (method: PaymentMethod) => {
    setCurrentMethod(method);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentType(e.target.value as 'card' | 'bank');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showSnackbar('Please provide a name for this payment method', 'error');
      return false;
    }

    if (paymentType === 'card') {
      if (formData.cardNumber.trim().length < 13 && !formData.cardNumber.includes('*')) {
        showSnackbar('Please enter a valid card number', 'error');
        return false;
      }
      if (!formData.cvv.trim() && !openEditDialog) {
        showSnackbar('Please enter a valid CVV', 'error');
        return false;
      }
    } else {
      if (!formData.bankName.trim()) {
        showSnackbar('Please enter a bank name', 'error');
        return false;
      }
      if (!formData.accountNumber.trim() && !openEditDialog) {
        showSnackbar('Please enter an account number', 'error');
        return false;
      }
      if (!formData.routingNumber.trim() && !openEditDialog) {
        showSnackbar('Please enter a routing number', 'error');
        return false;
      }
    }

    return true;
  };

  const handleAddPaymentMethod = () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMethod: PaymentMethod = {
        id: `${Date.now()}`,
        type: paymentType,
        isDefault: formData.isDefault,
        name: formData.name,
        dateAdded: new Date().toISOString().split('T')[0]
      };

      if (paymentType === 'card') {
        newMethod.lastFour = formData.cardNumber.slice(-4);
        newMethod.expiryDate = `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`;
        newMethod.cardType = detectCardType(formData.cardNumber);
      } else {
        newMethod.bankName = formData.bankName;
        newMethod.accountNumber = `******${formData.accountNumber.slice(-4)}`;
        newMethod.routingNumber = `******${formData.routingNumber.slice(-4)}`;
      }

      // If this is set as default, update other methods
      let updatedMethods = [...paymentMethods];
      if (formData.isDefault) {
        updatedMethods = updatedMethods.map(method => ({
          ...method,
          isDefault: false
        }));
      }

      setPaymentMethods([newMethod, ...updatedMethods]);
      handleCloseDialogs();
      showSnackbar('Payment method added successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleEditPaymentMethod = () => {
    if (!validateForm() || !currentMethod) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedMethod: PaymentMethod = {
        ...currentMethod,
        name: formData.name,
        isDefault: formData.isDefault,
      };

      if (paymentType === 'card') {
        // Only update if the card number was changed (doesn't contain '*')
        if (!formData.cardNumber.includes('*')) {
          updatedMethod.lastFour = formData.cardNumber.slice(-4);
          updatedMethod.cardType = detectCardType(formData.cardNumber);
        }
        updatedMethod.expiryDate = `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`;
      } else {
        updatedMethod.bankName = formData.bankName;
        // Only update if account/routing were changed (don't contain '*')
        if (!formData.accountNumber.includes('*')) {
          updatedMethod.accountNumber = `******${formData.accountNumber.slice(-4)}`;
        }
        if (!formData.routingNumber.includes('*')) {
          updatedMethod.routingNumber = `******${formData.routingNumber.slice(-4)}`;
        }
      }

      // If this is set as default, update other methods
      // let updatedMethods = paymentMethods.map(method => 
      //   method.id === currentMethod.id ? updatedMethod : 
      //   formData.isDefault ? { ...method, isDefault: false } : method
      // );

      // setPaymentMethods(updatedMethods);
      handleCloseDialogs();
      showSnackbar('Payment method updated successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleDeletePaymentMethod = () => {
    if (!currentMethod) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter out the deleted method
      const updatedMethods = paymentMethods.filter(method => method.id !== currentMethod.id);
      
      // If the deleted method was the default and there are other methods,
      // set the first remaining method as default
      if (currentMethod.isDefault && updatedMethods.length > 0) {
        updatedMethods[0].isDefault = true;
      }
      
      setPaymentMethods(updatedMethods);
      handleCloseDialogs();
      showSnackbar('Payment method deleted successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleSetDefaultMethod = (methodId: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));
      
      setPaymentMethods(updatedMethods);
      showSnackbar('Default payment method updated', 'success');
      setLoading(false);
    }, 500);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Helper function to detect card type based on number
  const detectCardType = (cardNumber: string): string => {
    const number = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    
    return 'unknown';
  };

  // Format a date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Manage Payment Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add, edit, or delete payment methods for your Minutos vendor account
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant={selectedTab === 'methods' ? 'contained' : 'outlined'}
          onClick={() => handleTabChange('methods')}
          sx={{ mr: 2 }}
        >
          Payment Methods
        </Button>
        <Button
          variant={selectedTab === 'history' ? 'contained' : 'outlined'}
          onClick={() => handleTabChange('history')}
        >
          Payment History
        </Button>
      </Box>

      {selectedTab === 'methods' ? (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Your Payment Methods
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
            >
              Add Payment Method
            </Button>
          </Box>

          {paymentMethods.length === 0 ? (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <WarningIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>No Payment Methods Found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't added any payment methods yet. Add a payment method to get started.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                >
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} sm={6} md={4} key={method.id}>
                  <Card variant={method.isDefault ? 'elevation' : 'outlined'} 
                      elevation={method.isDefault ? 4 : 0}
                      sx={{ 
                        position: 'relative',
                        border: method.isDefault ? '1px solid #4caf50' : undefined,
                        height: '100%'
                      }}>
                    {method.isDefault && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: '10px', 
                          right: '10px',
                          bgcolor: '#4caf50',
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}
                      >
                        Default
                      </Box>
                    )}
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {method.name}
                        </Typography>
                      </Box>
                      
                      {method.type === 'card' ? (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            **** **** **** {method.lastFour}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expires: {method.expiryDate}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {method.bankName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Account: {method.accountNumber}
                          </Typography>
                        </>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Added on {formatDate(method.dateAdded)}
                      </Typography>
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        {!method.isDefault && (
                          <Button 
                            size="small" 
                            onClick={() => handleSetDefaultMethod(method.id)}
                            startIcon={<CheckCircleIcon />}
                          >
                            Set Default
                          </Button>
                        )}
                        <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenEditDialog(method)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleOpenDeleteDialog(method)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">
              Payment History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent payment transactions for your Minutos vendor account
            </Typography>
          </Box>

          {paymentHistory.length === 0 ? (
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6">No Payment History</Typography>
                <Typography variant="body2" color="text.secondary">
                  You have no payment history yet.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card variant="outlined">
              <CardContent>
                {paymentHistory.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <Box sx={{ py: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(transaction.date)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">
                            Amount
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ${transaction.amount.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Payment Method
                          </Typography>
                          <Typography variant="body1">
                            {transaction.method}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">
                            Description
                          </Typography>
                          <Typography variant="body1">
                            {transaction.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: { xs: 'flex-start', md: 'flex-end' }
                          }}>
                            <Box sx={{ 
                              borderRadius: '16px', 
                              px: 1.5, 
                              py: 0.5,
                              bgcolor: 
                                transaction.status === 'success' ? '#e8f5e9' : 
                                transaction.status === 'pending' ? '#fff8e1' : '#ffebee',
                              color:
                                transaction.status === 'success' ? '#2e7d32' :
                                transaction.status === 'pending' ? '#f57c00' : '#c62828'
                            }}>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {transaction.status}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    {index < paymentHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Add Payment Method Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Add a new payment method to your Minutos vendor account.
          </DialogContentText>

          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Payment Type
            </Typography>
            <RadioGroup
              row
              name="paymentType"
              value={paymentType}
              onChange={handlePaymentTypeChange}
            >
              <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
              <FormControlLabel value="bank" control={<Radio />} label="Bank Account" />
            </RadioGroup>
          </FormControl>

          <TextField
            margin="dense"
            label="Payment Method Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            placeholder="e.g. Business Card, Personal Account"
            sx={{ mb: 2 }}
          />

          {paymentType === 'card' ? (
            <>
              <TextField
                margin="dense"
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="1234 5678 9012 3456"
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={8}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Expiry Date
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <FormControl variant="outlined" sx={{ width: '50%', mr: 1 }}>
                      <Select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleSelectChange}
                      >
                        {months.map(month => (
                          <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ width: '50%' }}>
                      <Select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleSelectChange}
                      >
                        {years.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="e.g. Chase, Bank of America"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Your bank account number"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Routing Number"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Your bank routing number"
                sx={{ mb: 2 }}
              />
            </>
          )}

          <FormControlLabel
            control={
              <Radio
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              />
            }
            label="Set as default payment method"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleAddPaymentMethod} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Payment Method'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Payment Method</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Update your payment method details.
          </DialogContentText>

          <TextField
            margin="dense"
            label="Payment Method Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />

          {paymentType === 'card' ? (
            <>
              <TextField
                margin="dense"
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Update Expiry Date
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <FormControl variant="outlined" sx={{ width: '50%', mr: 1 }}>
                      <Select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleSelectChange}
                      >
                        {months.map(month => (
                          <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ width: '50%' }}>
                      <Select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleSelectChange}
                      >
                        {years.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={formData.accountNumber.includes('*')}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Routing Number"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={formData.routingNumber.includes('*')}
                sx={{ mb: 2 }}
              />
            </>
          )}

          <FormControlLabel
            control={
              <Radio
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              />
            }
            label="Set as default payment method"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleEditPaymentMethod}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Payment Method Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialogs}
      >
        <DialogTitle>Delete Payment Method</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {currentMethod?.name}? This action cannot be undone.
            {currentMethod?.isDefault && (
              <Box sx={{ mt: 2, fontWeight: 'bold', color: 'error.main' }}>
                This is your default payment method. If deleted, another payment method will be set as default.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleDeletePaymentMethod} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagePaymentDetails;