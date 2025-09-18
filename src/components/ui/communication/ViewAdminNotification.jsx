/* eslint-disable */
import React, { useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ViewAdminNotification = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Dummy data - replace with API in real app
  const dummyNotifications = [
    {
      id: "1",
      type: "order",
      title: "New Order Received",
      message: "Customer #1234 has placed a new order for $45.60",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      meta: {
        orderId: "ORD-2023-001",
        storeId: "ST-001",
        urgency: "high",
      },
    },
    {
      id: "2",
      type: "inventory",
      title: "Low Stock Alert",
      message: "Milk is running low (only 5 units left)",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      meta: {
        storeId: "ST-001",
        urgency: "medium",
      },
    },
    {
      id: "3",
      type: "system",
      title: "System Maintenance",
      message:
        "Scheduled maintenance tonight at 2 AM (30 min downtime expected)",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: "4",
      type: "report",
      title: "Weekly Sales Report",
      message: "Your weekly sales report is ready for review",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      meta: {
        urgency: "low",
      },
    },
    {
      id: "5",
      type: "order",
      title: "Order Cancellation",
      message: "Customer #5678 has cancelled order #ORD-2023-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
      meta: {
        orderId: "ORD-2023-002",
        storeId: "ST-001",
      },
    },
  ];

  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  // Mark as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Get notification symbol
  const getNotificationSymbol = (type) => {
    switch (type) {
      case "order":
        return "🛒";
      case "inventory":
        return "🏪";
      case "system":
        return "⚠️";
      case "report":
        return "📊";
      default:
        return "ℹ️";
    }
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Handle click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  // Back
  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  // Handle action
  const handleAction = (notification) => {
    switch (notification.type) {
      case "order":
        if (notification.meta?.orderId) {
          navigate(`/orders/${notification.meta.orderId}`);
        }
        break;
      case "inventory":
        if (notification.meta?.storeId) {
          navigate(`/inventory/${notification.meta.storeId}`);
        }
        break;
      default:
        handleBackToList();
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        {isMobile && selectedNotification && (
          <Button onClick={handleBackToList} sx={{ mr: 1 }}>
            ← Back
          </Button>
        )}
        <Typography sx={{ fontSize: 32, mr: 2 }}>🔔</Typography>
        <Typography variant="h5">Notifications</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {filter === "unread" && filteredNotifications.length > 0 && (
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
          {/* Filter chips */}
          <Box sx={{ display: "flex", overflowX: "auto", mb: 2, pb: 1 }}>
            {["all", "unread", "order", "inventory", "system", "report"].map(
              (f) => (
                <Chip
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  onClick={() => setFilter(f)}
                  color={filter === f ? "primary" : "default"}
                  sx={{ mr: 1 }}
                />
              )
            )}
          </Box>

          {/* List */}
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
                        backgroundColor: notification.read
                          ? "inherit"
                          : "action.hover",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "action.selected" },
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={notification.read}
                        >
                          <Avatar sx={{ bgcolor: "background.paper", fontSize: '1.5rem' }}>
                            {getNotificationSymbol(notification.type)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontWeight: notification.read
                                  ? "normal"
                                  : "bold",
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {notification.meta?.urgency === "high" && (
                              <Chip
                                label="Urgent"
                                size="small"
                                color="error"
                                sx={{
                                  ml: 1,
                                  fontSize: "0.6rem",
                                  height: 20,
                                }}
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
                              sx={{ display: "block" }}
                            >
                              {notification.message}
                            </Typography>
                            {formatTime(notification.timestamp)}
                          </>
                        }
                      />
                      <Button
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        sx={{ ml: 1 }}
                        size="small"
                      >
                        🗑️
                      </Button>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "background.paper", mr: 2, fontSize: '1.5rem' }}>
              {getNotificationSymbol(selectedNotification.type)}
            </Avatar>
            <Typography variant="h6">{selectedNotification.title}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              label={selectedNotification.read ? "Read" : "Unread"}
              size="small"
              color={selectedNotification.read ? "default" : "primary"}
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                deleteNotification(selectedNotification.id);
                handleBackToList();
              }}
              sx={{ mr: 2 }}
            >
              🗑️ Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => handleAction(selectedNotification)}
            >
              {selectedNotification.type === "order"
                ? "View Order"
                : selectedNotification.type === "inventory"
                ? "Check Inventory"
                : "Close"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ViewAdminNotification;