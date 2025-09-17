import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import axios from 'axios';

// Dummy data for the vendor
const dummyVendorData = {
  storeName: "Fresh Grocery Market",
  ownerName: "John Smith",
  email: "john@freshgrocery.com",
  phone: "555-123-4567",
  address: {
    street: "123 Main Street",
    city: "Cityville",
    state: "State",
    postalCode: "12345"
  },
  storeCategory: "Grocery",
  description: "We offer fresh produce, dairy, and pantry essentials with competitive prices and excellent service.",
  openingHours: {
    monday: { open: "08:00", close: "20:00", isOpen: true },
    tuesday: { open: "08:00", close: "20:00", isOpen: true },
    wednesday: { open: "08:00", close: "20:00", isOpen: true },
    thursday: { open: "08:00", close: "20:00", isOpen: true },
    friday: { open: "08:00", close: "21:00", isOpen: true },
    saturday: { open: "09:00", close: "21:00", isOpen: true },
    sunday: { open: "10:00", close: "18:00", isOpen: true }
  },
  deliveryOptions: {
    selfPickup: true,
    delivery: true,
    maxDeliveryDistance: 5,
    deliveryFee: 2.99
  },
  profilePicture: "https://via.placeholder.com/150",
  bannerImage: "https://via.placeholder.com/1200x300"
};

const UpdateVendorDetails = () => {
  const [vendorData, setVendorData] = useState(dummyVendorData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(dummyVendorData.profilePicture);
  const [bannerImagePreview, setBannerImagePreview] = useState(dummyVendorData.bannerImage);

  useEffect(() => {
    // Fetch vendor data from API if needed
  }, []);

  const handleHoursChange = (day, field, value) => {
    setVendorData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('vendorData', JSON.stringify(vendorData));
      if (profileImageFile) formData.append('profileImage', profileImageFile);
      if (bannerImageFile) formData.append('bannerImage', bannerImageFile);

      console.log('Submitted vendor data:', vendorData);
      console.log('Profile image:', profileImageFile);
      console.log('Banner image:', bannerImageFile);

      setTimeout(() => {
        toast.success('Vendor details updated successfully!');
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error updating vendor details:', error);
      toast.error('Failed to update vendor details');
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="basic-info tab-content">
            <div className="form-group">
              <label>Store Name *</label>
              <input type="text" value={vendorData.storeName} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Owner Name *</label>
              <input type="text" value={vendorData.ownerName} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" value={vendorData.email} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" value={vendorData.phone} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Store Category *</label>
              <select value={vendorData.storeCategory} className="form-control" required>
                <option value="">Select Category</option>
                <option value="Grocery">Grocery</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Convenience Store">Convenience Store</option>
                <option value="Organic Foods">Organic Foods</option>
                <option value="Bakery">Bakery</option>
                <option value="Butcher">Butcher</option>
                <option value="Produce Market">Produce Market</option>
                <option value="Specialty Foods">Specialty Foods</option>
              </select>
            </div>
            <div className="form-group">
              <label>Store Description</label>
              <textarea value={vendorData.description} className="form-control" rows={4} />
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="address-info tab-content">
            <div className="form-group">
              <label>Street Address *</label>
              <input type="text" value={vendorData.address.street} className="form-control" required />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" value={vendorData.address.city} className="form-control" required />
            </div>
            <div className="form-group">
              <label>State/Province *</label>
              <input type="text" value={vendorData.address.state} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Postal Code *</label>
              <input type="text" value={vendorData.address.postalCode} className="form-control" required />
            </div>
            <div className="map-placeholder">
              <p className="text-muted">Map component would be integrated here for precise location setting</p>
            </div>
          </div>
        );

      case 'hours':
        return (
          <div className="hours-info tab-content">
            <p className="text-muted mb-4">Set your store's opening hours</p>
            {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(day => (
              <div key={day} className="day-row">
                <div className="day-name">
                  <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                </div>
                <div className="day-toggle">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={vendorData.openingHours[day].isOpen} 
                      onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)} 
                    />
                    <span className="slider round"></span>
                  </label>
                  <span>{vendorData.openingHours[day].isOpen ? 'Open' : 'Closed'}</span>
                </div>
                {vendorData.openingHours[day].isOpen && (
                  <div className="hours-inputs">
                    <div className="time-input">
                      <label>Open</label>
                      <input 
                        type="time" 
                        value={vendorData.openingHours[day].open} 
                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)} 
                        className="form-control" 
                      />
                    </div>
                    <div className="time-input">
                      <label>Close</label>
                      <input 
                        type="time" 
                        value={vendorData.openingHours[day].close} 
                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'delivery':
        return (
          <div className="delivery-info tab-content">
            <div className="form-group">
              <label className="checkbox-container">
                <input type="checkbox" checked={vendorData.deliveryOptions.selfPickup} />
                <span className="checkbox-label">Allow Self Pickup</span>
              </label>
              <small className="text-muted">Customers can place orders online and pick them up at your store</small>
            </div>
            <div className="form-group">
              <label className="checkbox-container">
                <input type="checkbox" checked={vendorData.deliveryOptions.delivery} />
                <span className="checkbox-label">Offer Delivery</span>
              </label>
              <small className="text-muted">Your store can deliver orders to customers</small>
            </div>
            {vendorData.deliveryOptions.delivery && (
              <>
                <div className="form-group">
                  <label>Maximum Delivery Distance (km)</label>
                  <input type="number" value={vendorData.deliveryOptions.maxDeliveryDistance} className="form-control" min="0" step="0.1" />
                </div>
                <div className="form-group">
                  <label>Delivery Fee ($)</label>
                  <input type="number" value={vendorData.deliveryOptions.deliveryFee} className="form-control" min="0" step="0.01" />
                </div>
              </>
            )}
          </div>
        );

      case 'media':
        return (
          <div className="media-info tab-content">
            <div className="form-group">
              <label>Store Profile Picture</label>
              <div className="image-upload-container">
                <div className="preview-container">
                  <img src={profileImagePreview} alt="Profile Preview" className="image-preview" />
                </div>
                <div className="upload-controls">
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} className="file-input" id="profilePicture" />
                  <label htmlFor="profilePicture" className="upload-btn">Choose File</label>
                  <small className="text-muted">Recommended size: 500x500px, max 2MB</small>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Store Banner Image</label>
              <div className="image-upload-container">
                <div className="preview-container banner-preview">
                  <img src={bannerImagePreview} alt="Banner Preview" className="image-preview banner" />
                </div>
                <div className="upload-controls">
                  <input type="file" accept="image/*" onChange={handleBannerImageChange} className="file-input" id="bannerImage" />
                  <label htmlFor="bannerImage" className="upload-btn">Choose File</label>
                  <small className="text-muted">Recommended size: 1200x300px, max 3MB</small>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="update-vendor-container">
      <div className="page-header">
        <h1>Account Settings</h1>
        <p>Update your store profile and settings on Minutos</p>
      </div>

      <div className="vendor-form-container">
        <form onSubmit={handleSubmit}>
          <div className="tabs-navigation">
            {['basic','address','hours','delivery','media'].map(tab => (
              <button key={tab} type="button" className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('media','Media').replace('hours','Opening Hours').replace('delivery','Delivery Options')}
              </button>
            ))}
          </div>

          <div className="tab-content-container">
            {renderTabContent()}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setVendorData(dummyVendorData)}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVendorDetails;
