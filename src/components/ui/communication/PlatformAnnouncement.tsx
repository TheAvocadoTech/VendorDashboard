import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types
interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  status: 'active' | 'scheduled' | 'expired';
  audience: 'all' | 'customers' | 'stores' | 'drivers';
  createdAt: string;
  scheduledFor?: string;
  expiresAt?: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

interface CreateAnnouncementForm {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  audience: 'all' | 'customers' | 'stores' | 'drivers';
  status: 'active' | 'scheduled';
  scheduledFor?: string;
  expiresAt?: string;
}

const PlatformAnnouncement: React.FC = () => {
  // States
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Form state
  const initialFormState: CreateAnnouncementForm = {
    title: '',
    message: '',
    type: 'info',
    audience: 'all',
    status: 'active',
    scheduledFor: '',
    expiresAt: ''
  };
  
  const [formData, setFormData] = useState<CreateAnnouncementForm>(initialFormState);
  
  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call
      // const response = await axios.get('/api/announcements');
      // setAnnouncements(response.data);
      
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Create new announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing && currentAnnouncement) {
        // Update existing announcement
        // In production, replace with actual API call
        // await axios.put(`/api/announcements/${currentAnnouncement._id}`, formData);
        
        // Update local state for demonstration
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
        // In production, replace with actual API call
        // const response = await axios.post('/api/announcements', formData);
        
        // Add to local state for demonstration
        const newAnnouncement: Announcement = {
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
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    setIsLoading(true);
    try {
      // In production, replace with actual API call
      // await axios.delete(`/api/announcements/${id}`);
      
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
  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      audience: announcement.audience,
      status: announcement.status,
      scheduledFor: announcement.scheduledFor,
      expiresAt: announcement.expiresAt
    });
    
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
    setShowCreateForm(true);
  };
  
  // View announcement details
  const handleViewDetails = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentAnnouncement(null);
    setIsEditing(false);
    setShowCreateForm(false);
  };
  
  // Filter announcements based on view mode and search query
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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Get badge color based on announcement type
  const getTypeBadgeColor = (type: string) => {
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
  const getStatusBadgeColor = (status: string) => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Platform Announcements</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create Announcement'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="info">Informational</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience <span className="text-red-500">*</span>
                </label>
                <select
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="all">All Users</option>
                  <option value="customers">Customers Only</option>
                  <option value="stores">Store Owners Only</option>
                  <option value="drivers">Delivery Drivers Only</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="active">Active (Publish Now)</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              
              {formData.status === 'scheduled' && (
                <div>
                  <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledFor"
                    name="scheduledFor"
                    value={formData.scheduledFor}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update Announcement' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode('active')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setViewMode('scheduled')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'scheduled' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setViewMode('expired')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'expired' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Expired
          </button>
        </div>
        
        <div className="w-full md:w-64">
          <input
            type="search"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {isLoading && !showCreateForm ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnouncements.map((announcement) => (
                <tr key={announcement._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{announcement.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(announcement.type)}`}>
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(announcement.status)}`}>
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {announcement.audience === 'all' ? 'All Users' : 
                       announcement.audience === 'customers' ? 'Customers Only' :
                       announcement.audience === 'stores' ? 'Store Owners Only' : 'Delivery Drivers Only'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(announcement)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-2">No announcements found</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Announcement
          </button>
        </div>
      )}
      
      {/* Announcement Details Modal */}
      {currentAnnouncement && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{currentAnnouncement.title}</h2>
              <button
                onClick={() => setCurrentAnnouncement(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(currentAnnouncement.type)}`}>
                {currentAnnouncement.type.charAt(0).toUpperCase() + currentAnnouncement.type.slice(1)}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(currentAnnouncement.status)}`}>
                {currentAnnouncement.status.charAt(0).toUpperCase() + currentAnnouncement.status.slice(1)}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                {currentAnnouncement.audience === 'all' ? 'All Users' : 
                 currentAnnouncement.audience === 'customers' ? 'Customers Only' :
                 currentAnnouncement.audience === 'stores' ? 'Store Owners Only' : 'Delivery Drivers Only'}
              </span>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {currentAnnouncement.message}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div>
                <p><span className="font-semibold">Created By:</span> {currentAnnouncement.createdBy.name}</p>
                <p><span className="font-semibold">Created At:</span> {formatDate(currentAnnouncement.createdAt)}</p>
              </div>
              <div>
                {currentAnnouncement.scheduledFor && (
                  <p><span className="font-semibold">Scheduled For:</span> {formatDate(currentAnnouncement.scheduledFor)}</p>
                )}
                {currentAnnouncement.expiresAt && (
                  <p><span className="font-semibold">Expires At:</span> {formatDate(currentAnnouncement.expiresAt)}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(currentAnnouncement)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(currentAnnouncement._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setCurrentAnnouncement(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dummy data for demo purposes
const dummyAnnouncements: Announcement[] = [
  {
    _id: '1',
    title: 'Platform Maintenance',
    message: 'We will be performing scheduled maintenance on our platform on May 5th from 2:00 AM to 4:00 AM EST. During this time, the service may be intermittently unavailable. We apologize for any inconvenience caused.',
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
    message: 'We\'re excited to announce our new real-time order tracking feature! Now your customers can track their orders in real-time, giving them up-to-the-minute updates on their delivery status. This feature is available now for all store owners.',
    type: 'info',
    status: 'active',
    audience: 'stores',
    createdAt: '2025-04-25T14:15:00Z',
    createdBy: {
      _id: 'admin2',
      name: 'Product Manager'
    }
  },
  {
    _id: '3',
    title: 'Urgent: App Performance Issues',
    message: 'We are currently experiencing some performance issues with our mobile application. Our technical team is working to resolve this as quickly as possible. We appreciate your patience during this time.',
    type: 'urgent',
    status: 'active',
    audience: 'all',
    createdAt: '2025-04-30T08:45:00Z',
    createdBy: {
      _id: 'admin1',
      name: 'System Administrator'
    }
  },
  {
    _id: '4',
    title: 'Holiday Schedule Changes',
    message: 'Please note that during the upcoming holiday on May 10th, delivery times may be extended due to increased order volume. We recommend placing orders earlier than usual to ensure timely delivery.',
    type: 'warning',
    status: 'scheduled',
    audience: 'customers',
    createdAt: '2025-04-29T11:20:00Z',
    scheduledFor: '2025-05-08T00:00:00Z',
    expiresAt: '2025-05-11T23:59:59Z',
    createdBy: {
      _id: 'admin3',
      name: 'Operations Manager'
    }
  },
  {
    _id: '5',
    title: 'Driver App Update Required',
    message: 'All delivery drivers must update their mobile application to the latest version (v2.5.0) by May 3rd. This update includes important security patches and performance improvements. Failure to update may prevent you from accepting new deliveries.',
    type: 'warning',
    status: 'active',
    audience: 'drivers',
    createdAt: '2025-04-27T16:30:00Z',
    expiresAt: '2025-05-04T00:00:00Z',
    createdBy: {
      _id: 'admin2',
      name: 'Product Manager'
    }
  },
  {
    _id: '6',
    title: 'Previous Promotion Ended',
    message: 'The "Spring Sale" promotion has now ended. All discounts and special offers associated with this promotion are no longer valid. Thank you to all participating stores and customers!',
    type: 'info',
    status: 'expired',
    audience: 'all',
    createdAt: '2025-04-15T09:00:00Z',
    expiresAt: '2025-04-22T23:59:59Z',
    createdBy: {
      _id: 'admin4',
      name: 'Marketing Manager'
    }
  }
];

export default PlatformAnnouncement;