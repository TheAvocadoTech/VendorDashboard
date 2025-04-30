import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Divider,
  Chip,
  Button,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as ReadIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  ArrowBack as BackIcon,
  LocalGroceryStore as StoreIcon,
  ShoppingCart as OrderIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Assignment as ReportIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types for TypeScript
type Notification = {
  id: string;
  type: 'order' | 'inventory' | 'system' | 'report';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  meta?: {
    orderId?: string;
    storeId?: string;
    urgency?: 'high' | 'medium' | 'low';
  };
};

const ViewAdminNotification: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Dummy data - replace with actual API calls in a real application
  const dummyNotifications: Notification[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'Customer #1234 has placed a new order for $45.60',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      meta: {
        orderId: 'ORD-2023-001',
        storeId: 'ST-001',
        urgency: 'high'
      }
    },
    {
      id: '2',
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Milk is running low (only 5 units left)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      meta: {
        storeId: 'ST-001',
        urgency: 'medium'
      }
    },
    {
      id: '3',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 2 AM (30 min downtime expected)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true
    },
    {
      id: '4',
      type: 'report',
      title: 'Weekly Sales Report',
      message: 'Your weekly sales report is ready for review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      meta: {
        urgency: 'low'
      }
    },
    {
      id: '5',
      type: 'order',
      title: 'Order Cancellation',
      message: 'Customer #5678 has cancelled order #ORD-2023-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      read: true,
      meta: {
        orderId: 'ORD-2023-002',
        storeId: 'ST-001'
      }
    }
  ];

  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'inventory' | 'system' | 'report'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    // In a real app, you would also call an API to update the read status
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ));
    
    // In a real app, you would also call an API to update all read statuses
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    
    // In a real app, you would also call an API to delete the notification
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <OrderIcon color="primary" />;
      case 'inventory':
        return <StoreIcon color="secondary" />;
      case 'system':
        return <WarningIcon color="warning" />;
      case 'report':
        return <ReportIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  // Format timestamp to relative time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  // Handle back to list view
  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  // Handle action based on notification type
  const handleAction = (notification: Notification) => {
    switch (notification.type) {
      case 'order':
        if (notification.meta?.orderId) {
          navigate(`/orders/${notification.meta.orderId}`);
        }
        break;
      case 'inventory':
        if (notification.meta?.storeId) {
          navigate(`/inventory/${notification.meta.storeId}`);
        }
        break;
      default:
        // For other types, just close the detail view
        handleBackToList();
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {isMobile && selectedNotification && (
          <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
        )}
        <NotificationsIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h5" component="h1">
          Notifications
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {filter === 'unread' && filteredNotifications.length > 0 && (
          <Button 
            variant="outlined" 
            onClick={markAllAsRead}
            size="small"
            sx={{ ml: 2 }}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      {!selectedNotification ? (
        <>
          <Box sx={{ display: 'flex', overflowX: 'auto', mb: 2, pb: 1 }}>
            {['all', 'unread', 'order', 'inventory', 'system', 'report'].map((f) => (
              <Chip
                key={f}
                label={f.charAt(0).toUpperCase() + f.slice(1)}
                onClick={() => setFilter(f as any)}
                color={filter === f ? 'primary' : 'default'}
                sx={{ mr: 1 }}
                icon={f === 'unread' ? <Badge color="error" variant="dot" invisible={filteredNotifications.length === 0}><FilterIcon fontSize="small" /></Badge> : undefined}
              />
            ))}
          </Box>

          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <List sx={{ p: 0 }}>
              {filteredNotifications.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No notifications found" 
                    secondary={`Try changing your filter (current: ${filter})`} 
                  />
                </ListItem>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{
                        backgroundColor: notification.read ? 'inherit' : 'action.hover',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.selected' }
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={notification.read}
                        >
                          <Avatar sx={{ bgcolor: 'background.paper' }}>
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                              {notification.title}
                            </Typography>
                            {notification.meta?.urgency === 'high' && (
                              <Chip 
                                label="Urgent" 
                                size="small" 
                                color="error" 
                                sx={{ ml: 1, fontSize: '0.6rem', height: 20 }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'block' }}
                            >
                              {notification.message}
                            </Typography>
                            {formatTime(notification.timestamp)}
                          </>
                        }
                      />
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'background.paper', mr: 2 }}>
              {getNotificationIcon(selectedNotification.type)}
            </Avatar>
            <Typography variant="h6" component="h2">
              {selectedNotification.title}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Chip 
              label={selectedNotification.read ? 'Read' : 'Unread'} 
              size="small" 
              color={selectedNotification.read ? 'default' : 'primary'} 
              icon={selectedNotification.read ? <ReadIcon fontSize="small" /> : undefined}
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedNotification.message}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Notification Type: 
            </Typography>
            <Chip 
              label={selectedNotification.type.toUpperCase()} 
              size="small" 
              sx={{ ml: 1 }} 
            />

            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              Received: 
            </Typography>
            <Typography variant="caption" sx={{ ml: 1 }}>
              {selectedNotification.timestamp.toLocaleString()}
            </Typography>
          </Box>

          {selectedNotification.meta && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Details:
              </Typography>
              {selectedNotification.meta.orderId && (
                <Typography variant="body2">
                  Order ID: {selectedNotification.meta.orderId}
                </Typography>
              )}
              {selectedNotification.meta.storeId && (
                <Typography variant="body2">
                  Store ID: {selectedNotification.meta.storeId}
                </Typography>
              )}
              {selectedNotification.meta.urgency && (
                <Typography variant="body2">
                  Priority: {selectedNotification.meta.urgency.toUpperCase()}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="outlined" 
              startIcon={<DeleteIcon />} 
              onClick={() => {
                deleteNotification(selectedNotification.id);
                handleBackToList();
              }}
              sx={{ mr: 2 }}
            >
              Delete
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleAction(selectedNotification)}
            >
              {selectedNotification.type === 'order' ? 'View Order' : 
               selectedNotification.type === 'inventory' ? 'Check Inventory' : 'Close'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ViewAdminNotification;