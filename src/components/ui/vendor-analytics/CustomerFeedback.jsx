import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Rating,
  Avatar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Button,
  Tabs,
  Tab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Colors for charts
const SENTIMENT_COLORS = {
  Positive: '#00C49F',
  Neutral: '#FFBB28',
  Negative: '#FF4842'
};

// Helper functions for mock data
const generateRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateRandomComment = (rating) => {
  const positiveComments = [
    "Great service! The delivery was fast and the groceries were fresh.",
    "Excellent experience overall. Will definitely order again!",
    "The items were packed nicely and delivered ahead of time.",
    "Really impressed with the quality of products. Thanks!",
    "Best grocery delivery service I've used so far."
  ];
  const neutralComments = [
    "Delivery was on time, but some items were missing.",
    "Average experience. Nothing special but nothing bad either.",
    "The app is easy to use but the delivery took longer than expected.",
    "Products were fine but customer service could improve.",
    "Decent service but prices are a bit high compared to other options."
  ];
  const negativeComments = [
    "Disappointed with the service. Items arrived very late.",
    "Poor quality products. Several items were damaged.",
    "Difficult to get in touch with customer support when there was an issue.",
    "Wrong items delivered and no resolution provided.",
    "The delivery person was rude and mishandled my groceries."
  ];
  if (rating >= 4) return positiveComments[Math.floor(Math.random() * positiveComments.length)];
  if (rating === 3) return neutralComments[Math.floor(Math.random() * neutralComments.length)];
  return negativeComments[Math.floor(Math.random() * negativeComments.length)];
};

const generateMockFeedback = () => {
  const categories = ['Delivery Speed', 'Product Quality', 'Customer Service', 'App Experience', 'Order Accuracy', 'Value for Money'];
  const sentiments = ['positive', 'neutral', 'negative'];
  const names = ['Alex Johnson', 'Maria Garcia', 'James Wilson', 'Priya Patel', 'David Smith', 'Sophie Chen', 'Omar Hassan', 'Emma Davis'];
  
  const feedback = [];
  
  for (let i = 1; i <= 50; i++) {
    const rating = Math.floor(Math.random() * 5) + 1;
    const sentimentIndex = rating >= 4 ? 0 : rating === 3 ? 1 : 2;
    
    feedback.push({
      id: `feedback-${i}`,
      userName: names[Math.floor(Math.random() * names.length)],
      userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      rating,
      comment: generateRandomComment(rating),
      date: generateRandomDate(new Date(2023, 0, 1), new Date()),
      orderId: `ORD-${10000 + i}`,
      helpful: Math.floor(Math.random() * 20),
      notHelpful: Math.floor(Math.random() * 5),
      replied: Math.random() > 0.7,
      vendorReply: Math.random() > 0.7 ? "Thank you for your feedback! We're constantly working to improve our service." : undefined,
      category: categories[Math.floor(Math.random() * categories.length)],
      sentiment: sentiments[sentimentIndex],
    });
  }
  
  return feedback;
};

const generateMockStats = (feedbackItems) => {
  const totalReviews = feedbackItems.length;
  const avgRating = feedbackItems.reduce((acc, item) => acc + item.rating, 0) / totalReviews;
  
  const ratingsDistribution = [];
  for (let i = 1; i <= 5; i++) {
    ratingsDistribution.push({ rating: i, count: feedbackItems.filter(item => item.rating === i).length });
  }
  
  const categoryMap = new Map();
  feedbackItems.forEach(item => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
  });
  const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));
  
  const sentimentDistribution = [
    { sentiment: 'Positive', count: feedbackItems.filter(item => item.sentiment === 'positive').length },
    { sentiment: 'Neutral', count: feedbackItems.filter(item => item.sentiment === 'neutral').length },
    { sentiment: 'Negative', count: feedbackItems.filter(item => item.sentiment === 'negative').length }
  ];
  
  const monthlyRatings = new Map();
  feedbackItems.forEach(item => {
    const month = item.date.substring(0, 7);
    const current = monthlyRatings.get(month) || { sum: 0, count: 0 };
    monthlyRatings.set(month, { sum: current.sum + item.rating, count: current.count + 1 });
  });
  
  const ratingTrend = Array.from(monthlyRatings.entries())
    .map(([month, data]) => ({ month, avgRating: data.sum / data.count }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  return { avgRating, totalReviews, ratingsDistribution, categoryDistribution, sentimentDistribution, ratingTrend };
};

const CustomerFeedback = () => {
  const [tabValue, setTabValue] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [ratingFilter, setRatingFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockFeedback();
      setFeedbackData(data);
      setFilteredFeedback(data);
      setStats(generateMockStats(data));
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (feedbackData.length === 0) return;
    
    let filtered = [...feedbackData];
    if (ratingFilter !== '') filtered = filtered.filter(item => item.rating === ratingFilter);
    if (categoryFilter) filtered = filtered.filter(item => item.category === categoryFilter);
    if (sentimentFilter) filtered = filtered.filter(item => item.sentiment === sentimentFilter.toLowerCase());
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => item.userName.toLowerCase().includes(term) || item.comment.toLowerCase().includes(term) || item.orderId.toLowerCase().includes(term));
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') comparison = new Date(a.date) - new Date(b.date);
      else if (sortBy === 'rating') comparison = a.rating - b.rating;
      else if (sortBy === 'helpful') comparison = a.helpful - b.helpful;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredFeedback(filtered);
    setPage(1);
  }, [feedbackData, ratingFilter, categoryFilter, sentimentFilter, searchTerm, sortBy, sortDirection]);

  const handleTabChange = (_event, newValue) => setTabValue(newValue);
  const handleOpenReplyDialog = (feedback) => { setCurrentFeedback(feedback); setReplyText(feedback.vendorReply || ''); setReplyDialogOpen(true); };
  const handleCloseReplyDialog = () => { setReplyDialogOpen(false); setCurrentFeedback(null); setReplyText(''); };
  const handleSubmitReply = () => {
    const updated = feedbackData.map(item => item.id === currentFeedback.id ? { ...item, replied: true, vendorReply: replyText } : item);
    setFeedbackData(updated);
    setSnackbarMessage('Reply submitted successfully!');
    setSnackbarOpen(true);
    handleCloseReplyDialog();
  };

  const displayedFeedback = filteredFeedback.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) return <Container><Box textAlign="center" mt={5}><CircularProgress /></Box></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Customer Feedback</Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Feedback List" />
        <Tab label="Detailed Analytics" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Search" fullWidth value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Rating</InputLabel>
                <Select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))}>
                  <MenuItem value="">All</MenuItem>
                  {[5, 4, 3, 2, 1].map(r => <MenuItem key={r} value={r}>{r} Stars</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(feedbackData.map(item => item.category))].map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sentiment</InputLabel>
                <Select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Positive">Positive</MenuItem>
                  <MenuItem value="Neutral">Neutral</MenuItem>
                  <MenuItem value="Negative">Negative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {displayedFeedback.map(feedback => (
              <Grid item xs={12} key={feedback.id}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar src={feedback.userAvatar} alt={feedback.userName} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">{feedback.userName}</Typography>
                      <Rating value={feedback.rating} readOnly />
                      <Typography variant="body2">{feedback.comment}</Typography>
                      <Chip label={feedback.category} size="small" sx={{ mt: 1 }} />
                      <Typography variant="caption" display="block">{feedback.date} | Order: {feedback.orderId}</Typography>
                      {feedback.replied && <Typography variant="body2" color="primary">Vendor Reply: {feedback.vendorReply}</Typography>}
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" onClick={() => handleOpenReplyDialog(feedback)}>Reply</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filteredFeedback.length / rowsPerPage)}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {tabValue === 1 && stats && (
        <Box>
          <Grid container spacing={3}>
            {/* Average Rating & Total Reviews */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Average Rating</Typography>
                <Typography variant="h3">{stats.avgRating.toFixed(1)} / 5</Typography>
                <Rating value={stats.avgRating} precision={0.1} readOnly />
                <Typography>Total Reviews: {stats.totalReviews}</Typography>
              </Paper>
            </Grid>

            {/* Ratings Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Ratings Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.ratingsDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Reviews" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Sentiment Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Sentiment Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats.sentimentDistribution} dataKey="count" nameKey="sentiment" cx="50%" cy="50%" outerRadius={100} label>
                      {stats.sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.sentiment]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Rating Trend */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Rating Trend (Monthly)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.ratingTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgRating" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Rating by Category */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Rating by Category</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart layout="vertical" data={stats.categoryDistribution} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Reviews" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog} fullWidth maxWidth="sm">
        <DialogTitle>{currentFeedback?.replied ? 'Edit Reply' : 'Reply to Feedback'}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={3}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>Cancel</Button>
          <Button onClick={handleSubmitReply} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Box sx={{ bgcolor: 'success.main', color: '#fff', p: 1, borderRadius: 1 }}>{snackbarMessage}</Box>
      </Snackbar>
    </Container>
  );
};

export default CustomerFeedback;
