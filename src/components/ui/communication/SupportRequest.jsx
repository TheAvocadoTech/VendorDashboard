/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// Dummy data
const dummySupportRequests = [
  {
    id: "SR-001",
    userId: "U123",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    subject: "Order #ORD-5678 not delivered",
    message:
      "I placed an order yesterday but it hasn't been delivered yet. The app shows it as delivered but I didn't receive anything.",
    status: "open",
    priority: "high",
    category: "delivery",
    createdAt: new Date("2025-04-29T10:30:00"),
    updatedAt: new Date("2025-04-29T10:30:00"),
    orderReference: "ORD-5678",
    replies: [],
  },
  {
    id: "SR-002",
    userId: "U456",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    subject: "Payment issue with recent order",
    message:
      "I was charged twice for my order #ORD-8901. Please refund the extra payment.",
    status: "in-progress",
    priority: "medium",
    category: "payment",
    createdAt: new Date("2025-04-28T15:45:00"),
    updatedAt: new Date("2025-04-30T09:15:00"),
    orderReference: "ORD-8901",
    assignedTo: "Agent001",
    replies: [
      {
        id: "RPL-001",
        supportRequestId: "SR-002",
        sender: "support",
        senderName: "Support Agent",
        message:
          "I can see the duplicate charge. I have initiated a refund which should appear in your account within 3-5 business days.",
        createdAt: new Date("2025-04-30T09:15:00"),
      },
    ],
  },
  {
    id: "SR-003",
    userId: "U789",
    userName: "Michael Brown",
    userEmail: "michael.b@example.com",
    subject: "Unable to login to my account",
    message:
      "Every time I try to login, I get an error message saying 'Invalid credentials' even though I'm sure I'm using the correct details.",
    status: "resolved",
    priority: "urgent",
    category: "technical",
    createdAt: new Date("2025-04-27T09:00:00"),
    updatedAt: new Date("2025-04-29T14:20:00"),
    replies: [
      {
        id: "RPL-002",
        supportRequestId: "SR-003",
        sender: "support",
        senderName: "Support Agent",
        message:
          "We've reset your password and sent you a password reset link to your registered email. Please try logging in with the new password.",
        createdAt: new Date("2025-04-28T11:30:00"),
      },
      {
        id: "RPL-003",
        supportRequestId: "SR-003",
        sender: "user",
        senderName: "Michael Brown",
        message: "That worked, thank you for the quick assistance!",
        createdAt: new Date("2025-04-29T14:20:00"),
      },
    ],
  },
];

const SupportRequest = () => {
  const [supportRequests, setSupportRequests] = useState(dummySupportRequests);
  const [filteredRequests, setFilteredRequests] = useState(
    dummySupportRequests
  );
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const statusTabs = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in-progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  useEffect(() => {
    applyFilters();
  }, [tabValue, searchTerm, supportRequests]);

  const applyFilters = () => {
    let result = [...supportRequests];

    if (tabValue > 0) {
      const status = statusTabs[tabValue].value;
      result = result.filter((request) => request.status === status);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (request) =>
          request.subject.toLowerCase().includes(term) ||
          request.message.toLowerCase().includes(term) ||
          request.userName.toLowerCase().includes(term) ||
          request.userEmail.toLowerCase().includes(term) ||
          (request.orderReference &&
            request.orderReference.toLowerCase().includes(term))
      );
    }

    setFilteredRequests(result);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleReplyOpen = (request) => {
    setSelectedRequest(request);
    setReplyDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedRequest || !replyMessage.trim()) return;

    const newReply = {
      id: `RPL-${Math.floor(Math.random() * 10000)}`,
      supportRequestId: selectedRequest.id,
      sender: "support",
      senderName: "Support Agent",
      message: replyMessage,
      createdAt: new Date(),
    };

    const updatedRequests = supportRequests.map((request) => {
      if (request.id === selectedRequest.id) {
        const newStatus =
          request.status === "open" ? "in-progress" : request.status;
        return {
          ...request,
          status: newStatus,
          replies: [...request.replies, newReply],
          updatedAt: new Date(),
          assignedTo: request.assignedTo || "Agent001",
        };
      }
      return request;
    });

    setSupportRequests(updatedRequests);
    setReplyMessage("");
    setReplyDialogOpen(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "error";
      case "in-progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "info";
      case "medium":
        return "success";
      case "high":
        return "warning";
      case "urgent":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Support Requests
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newVal) => setTabValue(newVal)}
        sx={{ mb: 2 }}
      >
        {statusTabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by subject, user, email, or order reference"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.subject}</TableCell>
                <TableCell>{request.userName}</TableCell>
                <TableCell>
                  <Chip label={request.status} color={getStatusColor(request.status)} />
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.priority}
                    color={getPriorityColor(request.priority)}
                  />
                </TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{formatDate(request.updatedAt)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton onClick={() => handleViewRequest(request)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reply">
                    <IconButton onClick={() => handleReplyOpen(request)}>
                      <ReplyIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Support Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box>
              <Typography variant="h6">{selectedRequest.subject}</Typography>
              <Typography variant="body2" color="textSecondary">
                From: {selectedRequest.userName} ({selectedRequest.userEmail})
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                {selectedRequest.message}
              </Typography>
              <Typography variant="subtitle1">Replies:</Typography>
              {selectedRequest.replies.map((reply) => (
                <Box
                  key={reply.id}
                  sx={{
                    p: 1,
                    my: 1,
                    bgcolor:
                      reply.sender === "support"
                        ? "rgba(0,0,255,0.05)"
                        : "rgba(0,255,0,0.05)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>{reply.senderName}</strong> ({formatDate(reply.createdAt)})
                  </Typography>
                  <Typography variant="body1">{reply.message}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reply to Support Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained">
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupportRequest;
