import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Rating,
  Avatar,
  // Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Button,
  IconButton,
  Tabs,
  Tab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  // Star,
  // StarBorder,
  ThumbUp,
  ThumbDown,
  // Sort,
  // FilterList,
  Search,
  Reply,
  // Delete,
  // Report,
  // Check,
  KeyboardArrowDown,
  KeyboardArrowUp,
  // MoreVert,
  // InsertChart
} from '@mui/icons-material';
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

// Define types for feedback and statistics
interface FeedbackItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  helpful: number;
  notHelpful: number;
  replied: boolean;
  vendorReply?: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface FeedbackStats {
  avgRating: number;
  totalReviews: number;
  ratingsDistribution: { rating: number; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  sentimentDistribution: { sentiment: string; count: number }[];
  ratingTrend: { month: string; avgRating: number }[];
}

// Mock data for feedback and statistics
const generateMockFeedback = (): FeedbackItem[] => {
  const categories = ['Delivery Speed', 'Product Quality', 'Customer Service', 'App Experience', 'Order Accuracy', 'Value for Money'];
  const sentiments = ['positive', 'neutral', 'negative'] as const;
  const names = ['Alex Johnson', 'Maria Garcia', 'James Wilson', 'Priya Patel', 'David Smith', 'Sophie Chen', 'Omar Hassan', 'Emma Davis'];
  
  const feedback: FeedbackItem[] = [];
  
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

// Helper functions for mock data generation
const generateRandomComment = (rating: number): string => {
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
  
  if (rating >= 4) {
    return positiveComments[Math.floor(Math.random() * positiveComments.length)];
  } else if (rating === 3) {
    return neutralComments[Math.floor(Math.random() * neutralComments.length)];
  } else {
    return negativeComments[Math.floor(Math.random() * negativeComments.length)];
  }
};

const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Generate mock statistics
const generateMockStats = (feedbackItems: FeedbackItem[]): FeedbackStats => {
  const totalReviews = feedbackItems.length;
  
  // Calculate average rating
  const avgRating = feedbackItems.reduce((acc, item) => acc + item.rating, 0) / totalReviews;
  
  // Calculate ratings distribution
  const ratingsDistribution = [];
  for (let i = 1; i <= 5; i++) {
    const count = feedbackItems.filter(item => item.rating === i).length;
    ratingsDistribution.push({ rating: i, count });
  }
  
  // Category distribution
  const categoryMap = new Map<string, number>();
  feedbackItems.forEach(item => {
    const currentCount = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, currentCount + 1);
  });
  
  const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));
  
  // Sentiment distribution
  const sentimentDistribution = [
    { sentiment: 'Positive', count: feedbackItems.filter(item => item.sentiment === 'positive').length },
    { sentiment: 'Neutral', count: feedbackItems.filter(item => item.sentiment === 'neutral').length },
    { sentiment: 'Negative', count: feedbackItems.filter(item => item.sentiment === 'negative').length }
  ];
  
  // Rating trend (by month)
  const monthlyRatings = new Map<string, { sum: number; count: number }>();
  
  feedbackItems.forEach(item => {
    const month = item.date.substring(0, 7); // YYYY-MM
    const current = monthlyRatings.get(month) || { sum: 0, count: 0 };
    monthlyRatings.set(month, { sum: current.sum + item.rating, count: current.count + 1 });
  });
  
  const ratingTrend = Array.from(monthlyRatings.entries())
    .map(([month, data]) => ({
      month,
      avgRating: data.sum / data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  return {
    avgRating,
    totalReviews,
    ratingsDistribution,
    categoryDistribution,
    sentimentDistribution,
    ratingTrend
  };
};

// Colors for charts
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF9'];
// const SENTIMENT_COLORS = {
//   Positive: '#00C49F',
//   Neutral: '#FFBB28',
//   Negative: '#FF4842'
// };

const CustomerFeedback: React.FC = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  // Filter states
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Load initial data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const data = generateMockFeedback();
      setFeedbackData(data);
      setFilteredFeedback(data);
      setStats(generateMockStats(data));
      setLoading(false);
    }, 1000);
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    if (feedbackData.length === 0) return;
    
    let filtered = [...feedbackData];
    
    // Apply rating filter
    if (ratingFilter !== '') {
      filtered = filtered.filter(item => item.rating === ratingFilter);
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply sentiment filter
    if (sentimentFilter) {
      filtered = filtered.filter(item => item.sentiment === sentimentFilter.toLowerCase() as 'positive' | 'neutral' | 'negative');
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.userName.toLowerCase().includes(term) || 
          item.comment.toLowerCase().includes(term) ||
          item.orderId.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'helpful':
          comparison = a.helpful - b.helpful;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredFeedback(filtered);
    setPage(1); // Reset to first page when filters change
  }, [feedbackData, ratingFilter, categoryFilter, sentimentFilter, searchTerm, sortBy, sortDirection]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle reply dialog
  const handleOpenReplyDialog = (feedback: FeedbackItem) => {
    setCurrentFeedback(feedback);
    setReplyText(feedback.vendorReply || '');
    setReplyDialogOpen(true);
  };
  
  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setCurrentFeedback(null);
    setReplyText('');
  };
  
  const handleSubmitReply = () => {
    if (!currentFeedback) return;
    
    // In a real application, this would be an API call
    const updatedFeedback = feedbackData.map(item => 
      item.id === currentFeedback.id 
        ? { ...item, vendorReply: replyText, replied: true } 
        : item
    );
    
    setFeedbackData(updatedFeedback);
    setSnackbarMessage('Reply submitted successfully');
    setSnackbarOpen(true);
    handleCloseReplyDialog();
  };
  
  // Helper for pagination
  const getCurrentPageData = () => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredFeedback.slice(startIndex, startIndex + rowsPerPage);
  };
  
  // Handle feedback actions (helpful/not helpful)
  const handleFeedbackAction = (id: string, action: 'helpful' | 'notHelpful') => {
    const updatedFeedback = feedbackData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [action]: item[action] + 1
        };
      }
      return item;
    });
    
    setFeedbackData(updatedFeedback);
    setSnackbarMessage('Feedback updated');
    setSnackbarOpen(true);
  };
  
  // Get unique categories for filter
  const getUniqueCategories = () => {
    const categories = new Set(feedbackData.map(item => item.category));
    return Array.from(categories);
  };
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl">
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Feedback & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Monitor and respond to customer feedback to improve your store's performance.
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Dashboard" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Feedback List" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Detailed Analytics" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
        
        {/* Dashboard Tab */}
        <div
          role="tabpanel"
          hidden={tabValue !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
        >
          {tabValue === 0 && stats && (
            <Box>
              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Average Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h4" component="div">
                          {stats.avgRating.toFixed(1)}
                        </Typography>
                        <Rating 
                          value={stats.avgRating} 
                          precision={0.1} 
                          readOnly 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Reviews
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.totalReviews}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Response Rate
                      </Typography>
                      <Typography variant="h4" component="div">
                        {Math.round((feedbackData.filter(item => item.replied).length / feedbackData.length) * 100)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Unaddressed Feedback
                      </Typography>
                      <Typography variant="h4" component="div">
                        {feedbackData.filter(item => !item.replied).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Charts */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Rating Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={stats.ratingsDistribution}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
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
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Sentiment Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.sentimentDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="sentiment"
                        >
                          {stats.sentimentDistribution.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={SENTIMENT_COLORS[entry.sentiment as keyof typeof SENTIMENT_COLORS]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Rating Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={stats.ratingTrend}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                          }}
                        />
                        <YAxis domain={[0, 5]} />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)} stars`, 'Average Rating']}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avgRating" 
                          name="Average Rating" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Feedback Categories
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        layout="vertical"
                        data={stats.categoryDistribution}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
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
              
              {/* Recent Feedback Preview */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Recent Feedback</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setTabValue(1)}
                  >
                    View All
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {feedbackData.slice(0, 3).map((feedback) => (
                    <Grid item xs={12} key={feedback.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Avatar 
                            src={feedback.userAvatar} 
                            alt={feedback.userName}
                            sx={{ mr: 2 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1">
                                {feedback.userName}
                              </Typography>
                              <Box>
                                <Chip 
                                  size="small" 
                                  label={feedback.category} 
                                  sx={{ mr: 1 }} 
                                />
                                <Rating 
                                  value={feedback.rating} 
                                  readOnly 
                                  size="small" 
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" paragraph>
                              {feedback.comment}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(feedback.date).toLocaleDateString()} • Order #{feedback.orderId}
                              </Typography>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<Reply />}
                                onClick={() => handleOpenReplyDialog(feedback)}
                              >
                                {feedback.replied ? 'Edit Reply' : 'Reply'}
                              </Button>
                            </Box>
                            {feedback.replied && feedback.vendorReply && (
                              <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  Your Reply:
                                </Typography>
                                <Typography variant="body2">
                                  {feedback.vendorReply}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </div>
        
        {/* Feedback List Tab */}
        <div
          role="tabpanel"
          hidden={tabValue !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
        >
          {tabValue === 1 && (
            <Box>
              {/* Filters and Search */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by customer name, comment or order ID"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="rating-filter-label">Rating</InputLabel>
                    <Select
                      labelId="rating-filter-label"
                      id="rating-filter"
                      value={ratingFilter}
                      label="Rating"
                      onChange={(e) => setRatingFilter(e.target.value as number | '')}
                    >
                      <MenuItem value="">All Ratings</MenuItem>
                      <MenuItem value={5}>5 Stars</MenuItem>
                      <MenuItem value={4}>4 Stars</MenuItem>
                      <MenuItem value={3}>3 Stars</MenuItem>
                      <MenuItem value={2}>2 Stars</MenuItem>
                      <MenuItem value={1}>1 Star</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      id="category-filter"
                      value={categoryFilter}
                      label="Category"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {getUniqueCategories().map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="sentiment-filter-label">Sentiment</InputLabel>
                    <Select
                      labelId="sentiment-filter-label"
                      id="sentiment-filter"
                      value={sentimentFilter}
                      label="Sentiment"
                      onChange={(e) => setSentimentFilter(e.target.value)}
                    >
                      <MenuItem value="">All Sentiments</MenuItem>
                      <MenuItem value="Positive">Positive</MenuItem>
                      <MenuItem value="Neutral">Neutral</MenuItem>
                      <MenuItem value="Negative">Negative</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                    <Select
                      labelId="sort-by-label"
                      id="sort-by"
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      endAdornment={
                        <IconButton 
                          size="small" 
                          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                          sx={{ mr: 2 }}
                        >
                          {sortDirection === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      }
                    >
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="helpful">Helpful Votes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {/* Feedback Count */}
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Showing {filteredFeedback.length} of {feedbackData.length} reviews
                </Typography>
                
                {/* Reset Filters Button */}
                {(ratingFilter !== '' || categoryFilter !== '' || sentimentFilter !== '' || searchTerm !== '') && (
                  <Button 
                    size="small" 
                    onClick={() => {
                      setRatingFilter('');
                      setCategoryFilter('');
                      setSentimentFilter('');
                      setSearchTerm('');
                      setSortBy('date');
                      setSortDirection('desc');
                    }}
                    variant="outlined"
                  >
                    Reset Filters
                  </Button>
                )}
              </Box>
              
              {/* Feedback List */}
              {filteredFeedback.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No feedback matches your filters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filter criteria
                  </Typography>
                </Paper>
              ) : (
                <>
                  {getCurrentPageData().map((feedback) => (
                    <Paper key={feedback.id} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar 
                          src={feedback.userAvatar} 
                          alt={feedback.userName}
                          sx={{ mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">
                              {feedback.userName}
                            </Typography>
                            <Box>
                              <Chip 
                                size="small" 
                                label={feedback.category} 
                                sx={{ mr: 1 }} 
                              />
                              <Chip 
                                size="small" 
                                label={feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                                color={
                                  feedback.sentiment === 'positive' 
                                    ? 'success' 
                                    : feedback.sentiment === 'negative' 
                                      ? 'error' 
                                      : 'default'
                                }
                                sx={{ mr: 1 }}
                              />
                              <Rating 
                                value={feedback.rating} 
                                readOnly 
                                size="small" 
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" paragraph>
                            {feedback.comment}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(feedback.date).toLocaleDateString()} • Order #{feedback.orderId}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleFeedbackAction(feedback.id, 'helpful')}
                                >
                                  <ThumbUp fontSize="small" />
                                </IconButton>
                                <Typography variant="caption" sx={{ mr: 2 }}>
                                  {feedback.helpful}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleFeedbackAction(feedback.id, 'notHelpful')}
                                >
                                  <ThumbDown fontSize="small" />
                                </IconButton>
                                <Typography variant="caption">
                                  {feedback.notHelpful}
                                </Typography>
                              </Box>
                            </Box>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              startIcon={<Reply />}
                              onClick={() => handleOpenReplyDialog(feedback)}
                            >
                              {feedback.replied ? 'Edit Reply' : 'Reply'}
                            </Button>
                          </Box>
                          {feedback.replied && feedback.vendorReply && (
                            <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                Your Reply:
                              </Typography>
                              <Typography variant="body2">
                                {feedback.vendorReply}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                  
                  {/* Pagination */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                      count={Math.ceil(filteredFeedback.length / rowsPerPage)} 
                      page={page}
                      onChange={(value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                </>
              )}
            </Box>
          )}
        </div>
        
        {/* Detailed Analytics Tab */}
        <div
          role="tabpanel"
          hidden={tabValue !== 2}
          id="tabpanel-2"
          aria-labelledby="tab-2"
        >
          {tabValue === 2 && stats && (
            <Box>
              <Grid container spacing={3}>
                {/* Rating Distribution */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Detailed Rating Distribution
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={stats.ratingsDistribution}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="rating" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Number of Reviews" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box>
                          {stats.ratingsDistribution.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 90 }}>
                                <Typography>{item.rating} Star</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  ({item.count})
                                </Typography>
                              </Box>
                              <Box 
                                sx={{ 
                                  flexGrow: 1, 
                                  height: 8, 
                                  bgcolor: 'grey.300', 
                                  borderRadius: 1, 
                                  ml: 2,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    width: `${(item.count / stats.totalReviews) * 100}%`, 
                                    height: '100%', 
                                    bgcolor: index === 0 ? '#4caf50' : index === 1 ? '#8bc34a' : index === 2 ? '#ffeb3b' : index === 3 ? '#ff9800' : '#f44336' 
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ ml: 2, minWidth: 50 }}>
                                {((item.count / stats.totalReviews) * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Sentiment Trends */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Sentiment Trends Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={feedbackData
                          .reduce((acc, feedback) => {
                            const month = feedback.date.substring(0, 7);
                            const existingMonth = acc.find(item => item.month === month);
                            
                            if (existingMonth) {
                              existingMonth[feedback.sentiment] += 1;
                              existingMonth.total += 1;
                            } else {
                              acc.push({
                                month,
                                positive: feedback.sentiment === 'positive' ? 1 : 0,
                                neutral: feedback.sentiment === 'neutral' ? 1 : 0,
                                negative: feedback.sentiment === 'negative' ? 1 : 0,
                                total: 1
                              });
                            }
                            
                            return acc;
                          }, [] as Array<{month: string; positive: number; neutral: number; negative: number; total: number}>)
                          .map(item => ({
                            ...item,
                            positivePercentage: (item.positive / item.total) * 100,
                            neutralPercentage: (item.neutral / item.total) * 100,
                            negativePercentage: (item.negative / item.total) * 100,
                          }))
                          .sort((a, b) => a.month.localeCompare(b.month))
                        }
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="positivePercentage" 
                          name="Positive" 
                          stroke="#4caf50" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="neutralPercentage" 
                          name="Neutral" 
                          stroke="#ffeb3b" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="negativePercentage" 
                          name="Negative" 
                          stroke="#f44336" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                
                {/* Feedback by Category */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Rating by Category
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={
                          Array.from(
                            feedbackData.reduce((acc, feedback) => {
                              if (!acc.has(feedback.category)) {
                                acc.set(feedback.category, {
                                  category: feedback.category,
                                  totalRating: feedback.rating,
                                  count: 1,
                                });
                              } else {
                                const current = acc.get(feedback.category)!;
                                acc.set(feedback.category, {
                                  ...current,
                                  totalRating: current.totalRating + feedback.rating,
                                  count: current.count + 1,
                                });
                              }
                              return acc;
                            }, new Map<string, { category: string; totalRating: number; count: number }>())
                          ).map(([_, value]) => ({
                            ...value,
                            avgRating: value.totalRating / value.count,
                          }))
                        }
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 150,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="category" type="category" />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)} stars`, 'Average Rating']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="avgRating" 
                          name="Average Rating" 
                          fill="#8884d8"
                          label={{ 
                            position: 'right',
                            formatter: (value: number) => `${value.toFixed(1)}` 
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                
                {/* Word Cloud and Common Phrases would go here - requires additional libraries */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Common Feedback Themes
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      This section would typically include a word cloud and analysis of common phrases in customer feedback.
                      For production, you would integrate a natural language processing library to extract and visualize key themes.
                    </Alert>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Most Common Topics in Feedback:
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {['delivery speed', 'product quality', 'customer service', 'app usability', 'prices', 'freshness', 'packaging'].map((topic) => (
                        <Grid item key={topic}>
                          <Chip label={topic} />
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Positive Feedback Highlights:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Customers frequently praise the speed of delivery, freshness of produce, and friendly delivery staff.
                      The mobile app's ease of use is also commonly highlighted as a positive aspect.
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Areas for Improvement:
                    </Typography>
                    <Typography variant="body2">
                      Common suggestions include expanding product range, improving packaging for fragile items,
                      and providing more precise delivery time estimates.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </div>
      </Paper>
      
      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Reply to Customer Feedback
        </DialogTitle>
        <DialogContent>
          {currentFeedback && (
            <>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">
                    {currentFeedback.userName}
                  </Typography>
                  <Rating value={currentFeedback.rating} readOnly size="small" />
                </Box>
                <Typography variant="body2" paragraph>
                  {currentFeedback.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(currentFeedback.date).toLocaleDateString()} • Order #{currentFeedback.orderId}
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the customer feedback..."
                variant="outlined"
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Response Tips:
                </Typography>
                <Typography variant="body2">
                  • Thank the customer for their feedback<br />
                  • Address their specific concerns<br />
                  • Explain any actions you'll take based on their comments<br />
                  • Keep your tone professional and positive
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitReply} 
            variant="contained" 
            color="primary"
            disabled={!replyText.trim()}
          >
            {currentFeedback?.replied ? 'Update Reply' : 'Submit Reply'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CustomerFeedback;