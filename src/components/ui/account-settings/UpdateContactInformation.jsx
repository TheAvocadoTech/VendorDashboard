import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  Grid, 
  TextField, 
  Typography, 
  Snackbar, 
  Alert, 
  CircularProgress,
  Avatar
} from '@mui/material';

// Mock vendor data - replace with actual API call in production
const MOCK_VENDOR_DATA = {
  id: 'v123456',
  storeName: 'Fresh Market Grocery',
  ownerName: 'Alex Johnson',
  email: 'alex@freshmarket.com',
  phone: '+1 (555) 123-4567',
  alternatePhone: '+1 (555) 987-6543',
  address: '123 Main Street',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62704',
  storeDescription: 'Your friendly neighborhood grocery store with fresh produce and essential items.',
  profileImage: null
};

const UpdateContactInformation = () => {
  // State for form data
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    storeDescription: ''
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch vendor data on component mount
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API
        setFormData(MOCK_VENDOR_DATA);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        setNotification({
          open: true,
          message: 'Failed to load vendor information. Please try again.',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    fetchVendorData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        open: true,
        message: 'Please correct the errors in the form',
        severity: 'error'
      });
      return;
    }

    setSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setNotification({
        open: true,
        message: 'Contact information updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating contact information:', error);
      setNotification({
        open: true,
        message: 'Failed to update contact information. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Update Contact Information
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph>
          Keep your store information up to date to ensure customers can reach you easily.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Store Profile Section */}
            <Grid item xs={12} md={4}>
              <Card elevation={1}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={2}>
                    <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
                      🏪
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">{formData.storeName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Vendor ID: {MOCK_VENDOR_DATA.id}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Box display="flex" alignItems="center" mb={1.5}>
                      <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>📞</Box>
                      <Typography variant="body2">{formData.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1.5}>
                      <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>📧</Box>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{formData.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="flex-start" mb={1.5}>
                      <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold', mt: 0.5 }}>📍</Box>
                      <Typography variant="body2">
                        {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Update Form Section */}
            <Grid item xs={12} md={8}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>Store Details</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} margin="normal" error={!!errors.storeName} helperText={errors.storeName} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleChange} margin="normal" error={!!errors.ownerName} helperText={errors.ownerName} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" error={!!errors.email} helperText={errors.email} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} margin="normal" error={!!errors.phone} helperText={errors.phone} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Alternate Phone (Optional)" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} margin="normal" />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>Address Information</Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Street Address" name="address" value={formData.address} onChange={handleChange} margin="normal" error={!!errors.address} helperText={errors.address} required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} margin="normal" error={!!errors.city} helperText={errors.city} required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} margin="normal" error={!!errors.state} helperText={errors.state} required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} margin="normal" error={!!errors.zipCode} helperText={errors.zipCode} required />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>Additional Information</Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Store Description" name="storeDescription" value={formData.storeDescription} onChange={handleChange} margin="normal" multiline rows={4} placeholder="Briefly describe your store and what you offer..." />
                    </Grid>
                  </Grid>

                  <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" size="large" type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Saving...
                        </>
                      ) : (
                        <>
                          💾 Save Changes
                        </>
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }} elevation={6}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default UpdateContactInformation;