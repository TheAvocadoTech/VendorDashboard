import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import axios from 'axios';

// Interface for vendor data
interface VendorDetails {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  storeCategory: string;
  description: string;
  openingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  deliveryOptions: {
    selfPickup: boolean;
    delivery: boolean;
    maxDeliveryDistance: number;
    deliveryFee: number;
  };
  profilePicture: string;
  bannerImage: string;
}

// Dummy data for the vendor
const dummyVendorData: VendorDetails = {
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

// Main component
const UpdateVendorDetails: React.FC = () => {


  const [vendorData, setVendorData] = useState<VendorDetails>(dummyVendorData);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(dummyVendorData.profilePicture);
  const [bannerImagePreview, setBannerImagePreview] = useState<string>(dummyVendorData.bannerImage);

  // Fetch vendor data on component mount
  useEffect(() => {
    // This would fetch data from your API in a real implementation
    // For now we're using the dummy data set in the initial state
    // Example:
    // const fetchVendorData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get('/api/vendor/profile');
    //     setVendorData(response.data);
    //   } catch (error) {
    //     toast.error('Failed to load vendor data');
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchVendorData();
  }, []);

  // Handle input changes
  // dleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
    
    // Handle nested properties
    // if (name.includes('.')) {
    //   const [parent, child] = name.split('.');
    
    //   // Ensure the parent exists and is an object before spreading
    //   setVendorData(prev => ({
    //     ...prev,
    //     [parent]: {
    //       ...(typeof prev[parent as keyof VendorDetails] === 'object' && prev[parent as keyof VendorDetails] !== null ? prev[parent as keyof VendorDetails] : {}), // Ensure it's an object before spreading
    //       [child]: value
    //     }
    //   }));
    // } else {
    //   setVendorData(prev => ({
    //     ...prev,
    //     [name]: value
    //   }));
    // }
    

  // Handle checkbox changes
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
    
  //   // Handle nested properties
  //   if (name.includes('.')) {
  //     const [parent, child] = name.split('.');
    
  //     // Ensure the parent exists and is an object before spreading
  //     setVendorData(prev => ({
  //       ...prev,
  //       [parent]: {
  //         ...(typeof prev[parent as keyof VendorDetails] === 'object' && prev[parent as keyof VendorDetails] !== null ? prev[parent as keyof VendorDetails] : {}), // Ensure it's an object before spreading
  //         [child]: value
  //       }
  //     }));
  //   } else {
  //     setVendorData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }
  // }; 
  // Handle opening hours changes
  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setVendorData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day as keyof typeof prev.openingHours],
          [field]: value
        }
      }
    }));
  };

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  // Handle banner image upload
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBannerImagePreview(previewUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, you would use FormData to handle file uploads
      const formData = new FormData();
      formData.append('vendorData', JSON.stringify(vendorData));
      
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      
      if (bannerImageFile) {
        formData.append('bannerImage', bannerImageFile);
      }
      
      // This would be your actual API call in a real implementation
      // For the demo, we'll just simulate a successful update
      // await axios.put('/api/vendor/update', formData);
      console.log('Submitted vendor data:', vendorData);
      console.log('Profile image:', profileImageFile);
      console.log('Banner image:', bannerImageFile);
      
      // Simulate API delay
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

  // Render tabs content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="basic-info tab-content">
            <div className="form-group">
              <label htmlFor="storeName">Store Name *</label>
              <input 
                type="text" 
                id="storeName"
                name="storeName" 
                value={vendorData.storeName} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ownerName">Owner Name *</label>
              <input 
                type="text" 
                id="ownerName"
                name="ownerName" 
                value={vendorData.ownerName} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                value={vendorData.email} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input 
                type="tel" 
                id="phone"
                name="phone" 
                value={vendorData.phone} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="storeCategory">Store Category *</label>
              <select 
                id="storeCategory"
                name="storeCategory" 
                value={vendorData.storeCategory} 
                // onChange={handleInputChange}
                className="form-control" 
                required
              >
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
              <label htmlFor="description">Store Description</label>
              <textarea 
                id="description"
                name="description" 
                value={vendorData.description} 
                // onChange={handleInputChange}
                className="form-control" 
                rows={4}
              />
            </div>
          </div>
        );
        
      case 'address':
        return (
          <div className="address-info tab-content">
            <div className="form-group">
              <label htmlFor="address.street">Street Address *</label>
              <input 
                type="text" 
                id="address.street"
                name="address.street" 
                value={vendorData.address.street} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address.city">City *</label>
              <input 
                type="text" 
                id="address.city"
                name="address.city" 
                value={vendorData.address.city} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address.state">State/Province *</label>
              <input 
                type="text" 
                id="address.state"
                name="address.state" 
                value={vendorData.address.state} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address.postalCode">Postal Code *</label>
              <input 
                type="text" 
                id="address.postalCode"
                name="address.postalCode" 
                value={vendorData.address.postalCode} 
                // onChange={handleInputChange}
                className="form-control" 
                required 
              />
            </div>
            
            {/* Here you could add a map component to allow precise location setting */}
            <div className="map-placeholder">
              <p className="text-muted">Map component would be integrated here for precise location setting</p>
            </div>
          </div>
        );
        
      case 'hours':
        return (
          <div className="hours-info tab-content">
            <p className="text-muted mb-4">Set your store's opening hours so customers know when they can order from you</p>
            
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="day-row">
                <div className="day-name">
                  <span className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                </div>
                
                <div className="day-toggle">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={vendorData.openingHours[day as keyof typeof vendorData.openingHours].isOpen} 
                      onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="toggle-label">
                    {vendorData.openingHours[day as keyof typeof vendorData.openingHours].isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                
                {vendorData.openingHours[day as keyof typeof vendorData.openingHours].isOpen && (
                  <div className="hours-inputs">
                    <div className="time-input">
                      <label>Open</label>
                      <input 
                        type="time" 
                        value={vendorData.openingHours[day as keyof typeof vendorData.openingHours].open} 
                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                        className="form-control" 
                      />
                    </div>
                    
                    <div className="time-input">
                      <label>Close</label>
                      <input 
                        type="time" 
                        value={vendorData.openingHours[day as keyof typeof vendorData.openingHours].close} 
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
                <input 
                  type="checkbox" 
                  name="deliveryOptions.selfPickup" 
                  checked={vendorData.deliveryOptions.selfPickup} 
                  // onChange={handleCheckboxChange}
                />
                <span className="checkbox-label">Allow Self Pickup</span>
              </label>
              <small className="text-muted">Customers can place orders online and pick them up at your store</small>
            </div>
            
            <div className="form-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  name="deliveryOptions.delivery" 
                  checked={vendorData.deliveryOptions.delivery} 
                  // onChange={handleCheckboxChange}
                />
                <span className="checkbox-label">Offer Delivery</span>
              </label>
              <small className="text-muted">Your store can deliver orders to customers</small>
            </div>
            
            {vendorData.deliveryOptions.delivery && (
              <>
                <div className="form-group">
                  <label htmlFor="deliveryOptions.maxDeliveryDistance">Maximum Delivery Distance (km)</label>
                  <input 
                    type="number" 
                    id="deliveryOptions.maxDeliveryDistance"
                    name="deliveryOptions.maxDeliveryDistance" 
                    value={vendorData.deliveryOptions.maxDeliveryDistance} 
                    // onChange={handleInputChange}
                    className="form-control" 
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="deliveryOptions.deliveryFee">Delivery Fee ($)</label>
                  <input 
                    type="number" 
                    id="deliveryOptions.deliveryFee"
                    name="deliveryOptions.deliveryFee" 
                    value={vendorData.deliveryOptions.deliveryFee} 
                    // onChange={handleInputChange}
                    className="form-control" 
                    min="0"
                    step="0.01"
                  />
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
                  <input 
                    type="file" 
                    id="profilePicture"
                    accept="image/*" 
                    onChange={handleProfileImageChange}
                    className="file-input" 
                  />
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
                  <input 
                    type="file" 
                    id="bannerImage"
                    accept="image/*" 
                    onChange={handleBannerImageChange}
                    className="file-input" 
                  />
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
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              Address
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'hours' ? 'active' : ''}`}
              onClick={() => setActiveTab('hours')}
            >
              Opening Hours
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery')}
            >
              Delivery Options
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
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
      
      <style>{`
        .update-vendor-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 30px;
        }
        
        .page-header h1 {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .vendor-form-container {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          padding: 24px;
        }
        
        .tabs-navigation {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        
        .tab-btn {
          background: none;
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          position: relative;
          white-space: nowrap;
        }
        
        .tab-btn.active {
          color: #3f51b5;
        }
        
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #3f51b5;
        }
        
        .tab-content-container {
          margin-bottom: 30px;
        }
        
        .tab-content {
          animation: fadeIn 0.3s ease;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 14px;
        }
        
        .form-control {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #ddd;
          border-radius: 4px;
          transition: border 0.2s;
        }
        
        .form-control:focus {
          border-color: #3f51b5;
          outline: none;
        }
        
        .day-row {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .day-name {
          width: 100px;
        }
        
        .day-toggle {
          display: flex;
          align-items: center;
          margin: 0 20px;
        }
        
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
          margin-right: 10px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: -18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #3f51b5;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
        
        .hours-inputs {
          display: flex;
          align-items: center;
        }
        
        .time-input {
          margin-right: 15px;
        }
        
        .time-input label {
          font-size: 12px;
          margin-bottom: 3px;
        }
        
        .checkbox-container {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          cursor: pointer;
        }
        
        .checkbox-label {
          margin-left: 8px;
          font-weight: 500;
        }
        
        .image-upload-container {
          display: flex;
          margin-top: 10px;
        }
        
        .preview-container {
          width: 150px;
          height: 150px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 20px;
        }
        
        .banner-preview {
          width: 300px;
          height: 100px;
        }
        
        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .upload-controls {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .file-input {
          display: none;
        }
        
        .upload-btn {
          display: inline-block;
          padding: 8px 16px;
          background-color: #eee;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .upload-btn:hover {
          background-color: #ddd;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .btn {
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .btn-primary {
          background-color: #3f51b5;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background-color: #303f9f;
        }
        
        .btn-primary:disabled {
          background-color: #9fa8da;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
          background-color: #f5f5f5;
        }
        
        .text-muted {
          color: #777;
          font-size: 13px;
        }
        
        .map-placeholder {
          background-color: #f5f5f5;
          border: 1px dashed #ddd;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          margin-top: 15px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .tabs-navigation {
            flex-wrap: nowrap;
            overflow-x: auto;
          }
          
          .preview-container {
            width: 100px;
            height: 100px;
          }
          
          .banner-preview {
            width: 200px;
            height: 70px;
          }
          
          .day-row {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .day-toggle {
            margin: 10px 0;
          }
          
          .hours-inputs {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UpdateVendorDetails;