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
          {showCreateForm ? 'Cancel' : 'Create Announcement'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          {/* Form content here (same as TSX, unchanged since JSX works same) */}
          {/* ... */}
        </div>
      )}

      {/* Table/List rendering */}
      {/* ... rest of JSX same as before */}
    </div>
  );
};

// Dummy data
const dummyAnnouncements = [
  {
    _id: '1',
    title: 'Platform Maintenance',
    message: 'We will be performing scheduled maintenance on our platform...',
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
    message: 'We\'re excited to announce our new real-time order tracking feature...',
    type: 'info',
    status: 'active',
    audience: 'stores',
    createdAt: '2025-04-25T14:15:00Z',
    createdBy: {
      _id: 'admin2',
      name: 'Product Manager'
    }
  },
  // ... rest of dummy announcements
];

export default PlatformAnnouncement;
