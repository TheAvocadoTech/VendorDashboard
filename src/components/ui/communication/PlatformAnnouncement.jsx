import React, { useState, useEffect } from 'react';

const PlatformAnnouncement = () => {
  // States
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // all | active | scheduled | expired
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const initialFormState = {
    title: '',
    message: '',
    type: 'info',
    audience: 'all',
    status: 'active',
    scheduledFor: '',
    expiresAt: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      // Using dummy data for now
      setAnnouncements(dummyAnnouncements);
      setError(null);
    } catch (err) {
      setError('Failed to fetch announcements. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Create new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing && currentAnnouncement) {
        // Update existing announcement
        const updatedAnnouncements = announcements.map(announcement => 
          announcement._id === currentAnnouncement._id 
            ? { 
                ...announcement, 
                title: formData.title,
                message: formData.message,
                type: formData.type,
                audience: formData.audience,
                status: formData.status,
                scheduledFor: formData.scheduledFor,
                expiresAt: formData.expiresAt
              } 
            : announcement
        );
        setAnnouncements(updatedAnnouncements);
      } else {
        // Create new announcement
        const newAnnouncement = {
          _id: `dummy-${Date.now()}`,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          status: formData.status,
          audience: formData.audience,
          createdAt: new Date().toISOString(),
          scheduledFor: formData.scheduledFor,
          expiresAt: formData.expiresAt,
          createdBy: {
            _id: 'admin-user',
            name: 'Admin User'
          }
        };
        
        setAnnouncements([newAnnouncement, ...announcements]);
      }
      
      // Reset form
      resetForm();
    } catch (err) {
      setError('Failed to save announcement. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    setIsLoading(true);
    try {
      // Update local state
      setAnnouncements(announcements.filter(announcement => announcement._id !== id));
    } catch (err) {
      setError('Failed to delete announcement. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit announcement
  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      audience: announcement.audience,
      status: announcement.status === 'scheduled' ? 'scheduled' : 'active',
      scheduledFor: announcement.scheduledFor,
      expiresAt: announcement.expiresAt
    });
    
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
    setShowCreateForm(true);
  };
  
  // View announcement details
  const handleViewDetails = (announcement) => {
    setCurrentAnnouncement(announcement);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentAnnouncement(null);
    setIsEditing(false);
    setShowCreateForm(false);
  };
  
  // Filter announcements
  const filteredAnnouncements = announcements
    .filter(announcement => {
      if (viewMode === 'all') return true;
      return announcement.status === viewMode;
    })
    .filter(announcement => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        announcement.title.toLowerCase().includes(query) ||
        announcement.message.toLowerCase().includes(query)
      );
    });
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Get badge color based on announcement type
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Platform Announcements</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ Create Announcement'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audience
                </label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="vendors">Vendors Only</option>
                  <option value="customers">Customers Only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled For (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  value={formData.scheduledFor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update Announcement' : 'Create Announcement'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-full text-sm ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode('active')}
              className={`px-3 py-1 rounded-full text-sm ${viewMode === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Active
            </button>
            <button
              onClick={() => setViewMode('scheduled')}
              className={`px-3 py-1 rounded-full text-sm ${viewMode === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setViewMode('expired')}
              className={`px-3 py-1 rounded-full text-sm ${viewMode === 'expired' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Expired
            </button>
          </div>
          
          <div className="flex-1 md:max-w-xs">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Announcements List */}
      {!isLoading && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredAnnouncements.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No announcements found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {announcement.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(announcement.status)}`}>
                          {announcement.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {announcement.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By: {announcement.createdBy.name}</span>
                        <span>Created: {formatDate(announcement.createdAt)}</span>
                        {announcement.expiresAt && (
                          <span>Expires: {formatDate(announcement.expiresAt)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Dummy data
const dummyAnnouncements = [
  {
    _id: '1',
    title: 'Platform Maintenance',
    message: 'We will be performing scheduled maintenance on our platform from 2 AM to 4 AM EST on May 6th. During this time, some features may be temporarily unavailable.',
    type: 'info',
    status: 'active',
    audience: 'all',
    createdAt: '2025-04-28T10:30:00Z',
    expiresAt: '2025-05-06T04:00:00Z',
    createdBy: {
      _id: 'admin1',
      name: 'System Administrator'
    }
  },
  {
    _id: '2',
    title: 'New Feature: Real-time Order Tracking',
    message: 'We are excited to announce our new real-time order tracking feature that allows customers to track their orders in real-time.',
    type: 'info',
    status: 'active',
    audience: 'all',
    createdAt: '2025-04-25T14:15:00Z',
    createdBy: {
      _id: 'admin2',
      name: 'Product Manager'
    }
  },
  {
    _id: '3',
    title: 'Payment System Updates',
    message: 'Important updates to our payment processing system will be rolled out next week. Please review the new payment guidelines.',
    type: 'warning',
    status: 'scheduled',
    audience: 'vendors',
    createdAt: '2025-04-20T09:00:00Z',
    scheduledFor: '2025-05-01T08:00:00Z',
    createdBy: {
      _id: 'admin3',
      name: 'Finance Team'
    }
  }
];

export default PlatformAnnouncement