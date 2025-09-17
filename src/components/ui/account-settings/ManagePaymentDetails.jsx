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
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Dummy Data
const dummyPaymentMethods = [
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

const dummyPaymentHistory = [
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
const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const years = [];
const currentYear = new Date().getFullYear();
for (let i = 0; i < 15; i++) years.push((currentYear + i).toString());

const ManagePaymentDetails = () => {
  const [paymentMethods, setPaymentMethods] = useState(dummyPaymentMethods);
  const [paymentHistory] = useState(dummyPaymentHistory);
  const [selectedTab, setSelectedTab] = useState('methods');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [paymentType, setPaymentType] = useState('card');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
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

  const handleTabChange = (tab) => setSelectedTab(tab);

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

  const handleOpenEditDialog = (method) => {
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
        accountNumber: method.accountNumber?.replace('******','') || '',
        routingNumber: method.routingNumber?.replace('******','') || '',
        isDefault: method.isDefault
      });
    }
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (method) => {
    setCurrentMethod(method);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handlePaymentTypeChange = (e) => setPaymentType(e.target.value);

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
    setTimeout(() => {
      const newMethod = {
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
      let updatedMethods = [...paymentMethods];
      if (formData.isDefault) updatedMethods = updatedMethods.map(m => ({...m, isDefault:false}));
      setPaymentMethods([newMethod, ...updatedMethods]);
      handleCloseDialogs();
      showSnackbar('Payment method added successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleEditPaymentMethod = () => {
    if (!validateForm() || !currentMethod) return;
    setLoading(true);
    setTimeout(() => {
      const updatedMethod = {...currentMethod, name: formData.name, isDefault: formData.isDefault};
      if (paymentType === 'card') {
        if (!formData.cardNumber.includes('*')) {
          updatedMethod.lastFour = formData.cardNumber.slice(-4);
          updatedMethod.cardType = detectCardType(formData.cardNumber);
        }
        updatedMethod.expiryDate = `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`;
      } else {
        updatedMethod.bankName = formData.bankName;
        if (!formData.accountNumber.includes('*')) updatedMethod.accountNumber = `******${formData.accountNumber.slice(-4)}`;
        if (!formData.routingNumber.includes('*')) updatedMethod.routingNumber = `******${formData.routingNumber.slice(-4)}`;
      }
      handleCloseDialogs();
      showSnackbar('Payment method updated successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleDeletePaymentMethod = () => {
    if (!currentMethod) return;
    setLoading(true);
    setTimeout(() => {
      const updatedMethods = paymentMethods.filter(m => m.id !== currentMethod.id);
      if (currentMethod.isDefault && updatedMethods.length > 0) updatedMethods[0].isDefault = true;
      setPaymentMethods(updatedMethods);
      handleCloseDialogs();
      showSnackbar('Payment method deleted successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleSetDefaultMethod = (methodId) => {
    setLoading(true);
    setTimeout(() => {
      const updatedMethods = paymentMethods.map(m => ({...m, isDefault: m.id === methodId}));
      setPaymentMethods(updatedMethods);
      showSnackbar('Default payment method updated', 'success');
      setLoading(false);
    }, 500);
  };

  const showSnackbar = (message, severity) => setSnackbar({open:true, message, severity});
  const handleCloseSnackbar = () => setSnackbar({...snackbar, open:false});

  const detectCardType = (cardNumber) => {
    const number = cardNumber.replace(/\D/g,'');
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    return 'unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight:'bold', mb:1 }}>Manage Payment Details</Typography>
        <Typography color="text.secondary">Add, edit, or delete payment methods for your Minutos vendor account</Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb:3 }}>
        <Button variant={selectedTab==='methods'?'contained':'outlined'} onClick={()=>handleTabChange('methods')} sx={{ mr:2 }}>Payment Methods</Button>
        <Button variant={selectedTab==='history'?'contained':'outlined'} onClick={()=>handleTabChange('history')}>Payment History</Button>
      </Box>

      {/* Payment Methods */}
      {selectedTab==='methods' ? (
        <>
          <Box sx={{ mb:3, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <Typography variant="h6">Your Payment Methods</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>Add Payment Method</Button>
          </Box>

          {paymentMethods.length===0 ? (
            <Card variant="outlined" sx={{ mb:3 }}>
              <CardContent sx={{ textAlign:'center', py:4 }}>
                <WarningIcon sx={{ fontSize:60, color:'text.secondary', mb:2 }} />
                <Typography variant="h6" sx={{ mb:1 }}>No Payment Methods Found</Typography>
                <Typography color="text.secondary" sx={{ mb:3 }}>You haven't added any payment methods yet. Add a payment method to get started.</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>Add Payment Method</Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {paymentMethods.map(method=>(
                <Grid item xs={12} sm={6} md={4} key={method.id}>
                  <Card variant={method.isDefault?'elevation':'outlined'} elevation={method.isDefault?4:0} sx={{ position:'relative', border:method.isDefault?'1px solid #4caf50':undefined, height:'100%' }}>
                    {method.isDefault && <Box sx={{ position:'absolute', top:'10px', right:'10px', bgcolor:'#4caf50', color:'white', fontSize:'0.7rem', px:1.5, py:0.5, borderRadius:'10px' }}>Default</Box>}
                    <CardContent>
                      <Typography variant="h6">{method.name}</Typography>
                      {method.type==='card'?(
                        <>
                          <Typography color="text.secondary">**** **** **** {method.lastFour}</Typography>
                          <Typography color="text.secondary">Expires: {method.expiryDate}</Typography>
                        </>
                      ):(
                        <>
                          <Typography color="text.secondary">{method.bankName}</Typography>
                          <Typography color="text.secondary">Account: {method.accountNumber}</Typography>
                        </>
                      )}
                      <Typography color="text.secondary" sx={{ mt:1 }}>Added on {formatDate(method.dateAdded)}</Typography>
                      <Box sx={{ mt:3, display:'flex', justifyContent:'space-between' }}>
                        {!method.isDefault && <Button size="small" onClick={()=>handleSetDefaultMethod(method.id)} startIcon={<CheckCircleIcon />}>Set Default</Button>}
                        <Box sx={{ marginLeft:'auto', display:'flex' }}>
                          <IconButton size="small" color="primary" onClick={()=>handleOpenEditDialog(method)}><EditIcon /></IconButton>
                          <IconButton size="small" color="error" onClick={()=>handleOpenDeleteDialog(method)}><DeleteIcon /></IconButton>
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
          {/* Payment History */}
          <Box sx={{ mb:3 }}>
            <Typography variant="h6">Payment History</Typography>
            <Typography color="text.secondary">Recent payment transactions for your Minutos vendor account</Typography>
          </Box>

          {paymentHistory.length===0 ? (
            <Card variant="outlined">
              <CardContent sx={{ textAlign:'center', py:4 }}>
                <Typography variant="h6">No Payment History</Typography>
                <Typography color="text.secondary">You have no payment history yet.</Typography>
              </CardContent>
            </Card>
          ) : (
            <Card variant="outlined">
              <CardContent>
                {paymentHistory.map((transaction,index)=>(
                  <React.Fragment key={transaction.id}>
                    <Box sx={{ py:2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}><Typography color="text.secondary">Date</Typography><Typography>{formatDate(transaction.date)}</Typography></Grid>
                        <Grid item xs={12} sm={6} md={2}><Typography color="text.secondary">Amount</Typography><Typography fontWeight="bold">${transaction.amount.toFixed(2)}</Typography></Grid>
                        <Grid item xs={12} sm={6} md={3}><Typography color="text.secondary">Payment Method</Typography><Typography>{transaction.method}</Typography></Grid>
                        <Grid item xs={12} sm={6} md={2}><Typography color="text.secondary">Description</Typography><Typography>{transaction.description}</Typography></Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Box sx={{ display:'flex', alignItems:'center', justifyContent:{ xs:'flex-start', md:'flex-end' } }}>
                            <Box sx={{ borderRadius:'16px', px:1.5, py:0.5, bgcolor: transaction.status==='success'?'#e8f5e9':transaction.status==='pending'?'#fff8e1':'#ffebee', color: transaction.status==='success'?'#2e7d32':transaction.status==='pending'?'#f57c00':'#c62828' }}>
                              <Typography sx={{ textTransform:'capitalize' }}>{transaction.status}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    {index < paymentHistory.length-1 && <Divider />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Add/Edit/Delete Dialogs & Snackbar */}
      {/* ... keep all dialogs and snackbar logic identical but remove TS types ... */}

    </Box>
  );
};

export default ManagePaymentDetails;
