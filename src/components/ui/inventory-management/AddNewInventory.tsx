import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddNewInventory.css'; // We'll create a separate CSS file

// Types
interface Category {
  _id: string;
  name: string;
}

interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}

interface InventoryFormData {
  name: string;
  description: string;
  sku: string;
  barcode: string | null;
  category: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  unit: string;
  minStockLevel: number;
  isPerishable: boolean;
  expiryDate: string | null;
  images: File[];
  imageUrls: string[];
  isActive: boolean;
  tags: string[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  location: string;
}

// Add new inventory component
const AddNewInventory: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    description: '',
    sku: '',
    barcode: null,
    category: '',
    supplier: '',
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    unit: 'pieces',
    minStockLevel: 5,
    isPerishable: false,
    expiryDate: null,
    images: [],
    imageUrls: [],
    isActive: true,
    tags: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    location: 'main-warehouse'
  });

  // Form validation
  const [errors, setErrors] = useState<Partial<Record<keyof InventoryFormData, string>>>({});
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Options for dropdowns
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations] = useState<string[]>([
    'main-warehouse',
    'store-front',
    'back-storage',
    'refrigerated-section',
    'special-storage'
  ]);
  const [units] = useState<string[]>([
    'pieces', 
    'kg', 
    'g', 
    'liters', 
    'ml',
    'packets',
    'boxes',
    'bundles',
    'dozen'
  ]);
  
  // For tag input
  const [tagInput, setTagInput] = useState<string>('');
  
  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
  
  // Load dummy data for now
  useEffect(() => {
    // Simulate API calls with setTimeout
    setIsLoading(true);
    
    // Fetch dummy categories
    setTimeout(() => {
      const dummyCategories: Category[] = [
        { _id: '1', name: 'Fruits & Vegetables' },
        { _id: '2', name: 'Dairy & Eggs' },
        { _id: '3', name: 'Meat & Seafood' },
        { _id: '4', name: 'Bakery' },
        { _id: '5', name: 'Beverages' },
        { _id: '6', name: 'Snacks & Candy' },
        { _id: '7', name: 'Frozen Foods' },
      ];
      setCategories(dummyCategories);
      
      // Fetch dummy suppliers
      const dummySuppliers: Supplier[] = [
        { 
          _id: '1', 
          name: 'FreshFarms Inc.', 
          contactPerson: 'John Smith', 
          email: 'john@freshfarms.com', 
          phone: '555-123-4567' 
        },
        { 
          _id: '2', 
          name: 'Daily Dairy Ltd.', 
          contactPerson: 'Sarah Johnson', 
          email: 'sarah@dailydairy.com', 
          phone: '555-987-6543' 
        },
        { 
          _id: '3', 
          name: 'Bakery Delights', 
          contactPerson: 'Mike Wilson', 
          email: 'mike@bakerydelights.com', 
          phone: '555-456-7890' 
        },
        { 
          _id: '4', 
          name: 'MeatMaster Supply', 
          contactPerson: 'Lisa Brown', 
          email: 'lisa@meatmaster.com', 
          phone: '555-789-0123' 
        },
      ];
      setSuppliers(dummySuppliers);
      
      // Generate a random SKU
      const randomSku = `SKU-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setFormData(prev => ({
        ...prev,
        sku: randomSku
      }));
      
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({
      show: true,
      message,
      type
    });
  };
  
  // Handle text and number inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if any
    if (errors[name as keyof InventoryFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle number inputs
  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    // Clear error for this field if any
    if (errors[name as keyof InventoryFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle dimension changes
  const handleDimensionChange = (dimension: 'length' | 'width' | 'height', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: numValue
      }
    }));
  };
  
  // Handle switch/checkbox inputs
  const handleSwitchChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof InventoryFormData]
    }));
    
    // If turning off perishable, clear expiry date
    if (name === 'isPerishable' && formData.isPerishable) {
      setFormData(prev => ({
        ...prev,
        expiryDate: null
      }));
    }
  };
  
  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 5 images
      if (formData.images.length + newFiles.length > 5) {
        showToast('You can upload a maximum of 5 images', 'warning');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
      
      // Create preview URLs
      newFiles.forEach(file => {
        const url = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, url]
        }));
      });
    }
  };
  
  // Remove an uploaded image
  const removeImage = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(formData.imageUrls[index]);
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };
  
  // Handle tags
  const addTag = () => {
    if (tagInput.trim() === '') return;
    
    // Check if tag already exists
    if (formData.tags.includes(tagInput.trim())) {
      showToast('This tag already exists', 'warning');
      return;
    }
    
    // Add the tag
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    
    // Clear input
    setTagInput('');
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle tag input keypress (add on Enter)
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InventoryFormData, string>> = {};
    
    // Check required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    
    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than 0';
    }
    
    if (formData.purchasePrice < 0) {
      newErrors.purchasePrice = 'Purchase price cannot be negative';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    // Check if expiry date is provided for perishable items
    if (formData.isPerishable && !formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required for perishable items';
    }
    
    // Set the errors and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For now, just simulate an API call with a timeout
      setTimeout(() => {
        console.log('Inventory data to submit:', formData);
        
        // Success toast
        showToast(`${formData.name} has been added to your inventory`, 'success');
        
        // Reset form or redirect
        // navigate('/inventory'); // Uncomment to redirect after submission
        
        setIsSubmitting(false);
      }, 1500);
      
      // In a real implementation, you would use axios like this:
      /*
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'imageUrls' && key !== 'dimensions') {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Append dimension fields
      formDataToSend.append('dimensions', JSON.stringify(formData.dimensions));
      
      // Append image files
      formData.images.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      // Send request to backend
      const response = await axios.post('/api/inventory', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      showToast(`${formData.name} has been added to your inventory`, 'success');
      
      navigate('/inventory');
      */
      
    } catch (error) {
      console.error('Error adding inventory item:', error);
      showToast('Failed to add inventory item. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };
  
  // Go back to inventory page
  const handleGoBack = () => {
    navigate('/inventory');
  };
  
  // Reset form fields
  const handleReset = () => {
    // Confirm with user
    if (window.confirm('Are you sure you want to reset all fields?')) {
      // Generate a new random SKU
      const randomSku = `SKU-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Release all object URLs to prevent memory leaks
      formData.imageUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form data
      setFormData({
        name: '',
        description: '',
        sku: randomSku,
        barcode: null,
        category: '',
        supplier: '',
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: 0,
        unit: 'pieces',
        minStockLevel: 5,
        isPerishable: false,
        expiryDate: null,
        images: [],
        imageUrls: [],
        isActive: true,
        tags: [],
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
        location: 'main-warehouse'
      });
      
      // Clear errors
      setErrors({});
      
      // Clear tag input
      setTagInput('');
    }
  };

  return (
    <div className="inventory-container">
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <button 
            className="back-button"
            onClick={handleGoBack}
          >
            ← Back to Inventory
          </button>
          
          <h1 className="page-title">Add New Inventory Item</h1>
          
          {/* Toast notification */}
          {toast.show && (
            <div className={`toast toast-${toast.type}`}>
              <span>{toast.message}</span>
              <button 
                className="toast-close"
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
              >
                ×
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-layout">
              {/* Left column - Main form fields */}
              <div className="main-column">
                {/* Basic Info Section */}
                <div className="form-section">
                  <h2 className="section-title">Basic Information</h2>
                  
                  {/* Product Name */}
                  <div className="form-field">
                    <label htmlFor="name" className="required-field">Product Name</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>
                  
                  {/* Description */}
                  <div className="form-field">
                    <label htmlFor="description">Product Description</label>
                    <textarea 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>
                  
                  {/* Category & Supplier */}
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="category" className="required-field">Category</label>
                      <select 
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={errors.category ? 'input-error' : ''}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <div className="error-message">{errors.category}</div>}
                    </div>
                    
                    <div className="form-field">
                      <label htmlFor="supplier" className="required-field">Supplier</label>
                      <select 
                        id="supplier"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        className={errors.supplier ? 'input-error' : ''}
                      >
                        <option value="">Select supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier._id} value={supplier._id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      {errors.supplier && <div className="error-message">{errors.supplier}</div>}
                    </div>
                  </div>
                </div>
                
                {/* Pricing & Inventory Section */}
                <div className="form-section">
                  <h2 className="section-title">Pricing & Inventory</h2>
                  
                  {/* Pricing */}
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="purchasePrice">Purchase Price ($)</label>
                      <input 
                        type="number"
                        id="purchasePrice"
                        name="purchasePrice"
                        min="0"
                        step="0.01"
                        value={formData.purchasePrice}
                        onChange={(e) => handleNumberChange('purchasePrice', e.target.value)}
                        className={errors.purchasePrice ? 'input-error' : ''}
                      />
                      {errors.purchasePrice && <div className="error-message">{errors.purchasePrice}</div>}
                    </div>
                    
                    <div className="form-field">
                      <label htmlFor="sellingPrice" className="required-field">Selling Price ($)</label>
                      <input 
                        type="number"
                        id="sellingPrice"
                        name="sellingPrice"
                        min="0"
                        step="0.01"
                        value={formData.sellingPrice}
                        onChange={(e) => handleNumberChange('sellingPrice', e.target.value)}
                        className={errors.sellingPrice ? 'input-error' : ''}
                      />
                      {errors.sellingPrice && <div className="error-message">{errors.sellingPrice}</div>}
                    </div>
                  </div>
                  
                  {/* Inventory Quantity */}
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="quantity">Quantity</label>
                      <input 
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => handleNumberChange('quantity', e.target.value)}
                        className={errors.quantity ? 'input-error' : ''}
                      />
                      {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                    </div>
                    
                    <div className="form-field">
                      <label htmlFor="unit">Unit</label>
                      <select 
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Min Stock Level & Storage Location */}
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="minStockLevel">Minimum Stock Level</label>
                      <input 
                        type="number"
                        id="minStockLevel"
                        name="minStockLevel"
                        min="0"
                        value={formData.minStockLevel}
                        onChange={(e) => handleNumberChange('minStockLevel', e.target.value)}
                      />
                      <div className="field-hint">
                        You'll be notified when stock falls below this level
                      </div>
                    </div>
                    
                    <div className="form-field">
                      <label htmlFor="location">Storage Location</label>
                      <select 
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>
                            {location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Product Details Section */}
                <div className="form-section">
                  <h2 className="section-title">Product Details</h2>
                  
                  {/* Product Identifiers */}
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="sku">SKU</label>
                      <input 
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        readOnly
                        className="input-readonly"
                      />
                      <div className="field-hint">
                        Stock Keeping Unit (Auto-generated)
                      </div>
                    </div>
                    
                    <div className="form-field">
                      <label htmlFor="barcode">Barcode (Optional)</label>
                      <input 
                        type="text"
                        id="barcode"
                        name="barcode"
                        value={formData.barcode || ''}
                        onChange={handleInputChange}
                        placeholder="Enter barcode if available"
                      />
                    </div>
                  </div>
                  
                  {/* Weight & Dimensions */}
                  <div className="form-field">
                    <label>Weight & Dimensions</label>
                    
                    <div className="dimensions-container">
                      <div className="dimension-field">
                        <input 
                          type="number"
                          placeholder="Weight"
                          min="0"
                          value={formData.weight || ''}
                          onChange={(e) => handleNumberChange('weight', e.target.value)}
                        />
                        <span className="dimension-label">Weight (kg)</span>
                      </div>
                      
                      <div className="dimension-field">
                        <input 
                          type="number"
                          placeholder="Length"
                          min="0"
                          value={formData.dimensions.length || ''}
                          onChange={(e) => handleDimensionChange('length', e.target.value)}
                        />
                        <span className="dimension-label">Length (cm)</span>
                      </div>
                      
                      <div className="dimension-field">
                        <input 
                          type="number"
                          placeholder="Width"
                          min="0"
                          value={formData.dimensions.width || ''}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                        />
                        <span className="dimension-label">Width (cm)</span>
                      </div>
                      
                      <div className="dimension-field">
                        <input 
                          type="number"
                          placeholder="Height"
                          min="0"
                          value={formData.dimensions.height || ''}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                        />
                        <span className="dimension-label">Height (cm)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Perishable & Expiry Date */}
                  <div className="form-row">
                    <div className="form-field checkbox-field">
                      <div className="checkbox-container">
                        <input 
                          type="checkbox"
                          id="isPerishable"
                          checked={formData.isPerishable}
                          onChange={() => handleSwitchChange('isPerishable')}
                        />
                        <label htmlFor="isPerishable">Perishable Item</label>
                      </div>
                    </div>
                    
                    {formData.isPerishable && (
                      <div className="form-field">
                        <label htmlFor="expiryDate" className="required-field">Expiry Date</label>
                        <input 
                          type="date"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate || ''}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={errors.expiryDate ? 'input-error' : ''}
                        />
                        {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right column - Media, Tags, Status */}
              <div className="side-column">
                {/* Product Images */}
                <div className="form-section">
                  <h2 className="section-title">Product Images</h2>
                  
                  {/* Image upload area */}
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      id="image-upload"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="image-upload" className="upload-button">
                      Upload Images
                    </label>
                    <p className="upload-hint">
                      Up to 5 images, max 2MB each
                    </p>
                  </div>
                  
                  {/* Image previews */}
                  {formData.imageUrls.length > 0 && (
                    <div className="image-preview-grid">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="image-preview-container">
                          <img 
                            src={url} 
                            alt={`Product image ${index + 1}`} 
                            className="image-preview"
                          />
                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.imageUrls.length === 0 && (
                    <p className="no-images-message">
                      No images uploaded yet
                    </p>
                  )}
                </div>
                
                {/* Tags Section */}
                <div className="form-section">
                  <h2 className="section-title">Product Tags</h2>
                  
                  <div className="tag-input-container">
                    <input
                      type="text"
                      placeholder="Add tags (e.g., organic, vegan, gluten-free)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="tag-input"
                    />
                    <button
                      type="button"
                      className="add-tag-button"
                      onClick={addTag}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="tags-container">
                    {formData.tags.length > 0 ? (
                      <div className="tags-list">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="tag">
                            <span>{tag}</span>
                            <button
                              type="button"
                              className="remove-tag-button"
                              onClick={() => removeTag(tag)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-tags-message">
                        No tags added yet. Tags help customers find your products.
                      </p>
                    )}
                  </div>
                </div>
                
                                {/* Status Section */}
                                <div className="form-section">
                  <h2 className="section-title">Product Status</h2>
                  
                  <div className="status-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={() => handleSwitchChange('isActive')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="status-label">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <p className="status-hint">
                      {formData.isActive 
                        ? 'This product will be visible to customers' 
                        : 'This product will be hidden from customers'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Adding...
                  </>
                ) : 'Add Inventory Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNewInventory;