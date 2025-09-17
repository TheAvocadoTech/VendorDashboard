import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddNewInventory.css"; // We'll create a separate CSS file

// Add new inventory component
const AddNewInventory = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    barcode: null,
    category: "",
    supplier: "",
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    unit: "pieces",
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
    location: "main-warehouse",
  });

  // Form validation
  const [errors, setErrors] = useState({});

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Options for dropdowns
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [locations] = useState([
    "main-warehouse",
    "store-front",
    "back-storage",
    "refrigerated-section",
    "special-storage",
  ]);
  const [units] = useState([
    "pieces",
    "kg",
    "g",
    "liters",
    "ml",
    "packets",
    "boxes",
    "bundles",
    "dozen",
  ]);

  // For tag input
  const [tagInput, setTagInput] = useState("");

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Load dummy data for now
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      const dummyCategories = [
        { _id: "1", name: "Fruits & Vegetables" },
        { _id: "2", name: "Dairy & Eggs" },
        { _id: "3", name: "Meat & Seafood" },
        { _id: "4", name: "Bakery" },
        { _id: "5", name: "Beverages" },
        { _id: "6", name: "Snacks & Candy" },
        { _id: "7", name: "Frozen Foods" },
      ];
      setCategories(dummyCategories);

      const dummySuppliers = [
        {
          _id: "1",
          name: "FreshFarms Inc.",
          contactPerson: "John Smith",
          email: "john@freshfarms.com",
          phone: "555-123-4567",
        },
        {
          _id: "2",
          name: "Daily Dairy Ltd.",
          contactPerson: "Sarah Johnson",
          email: "sarah@dailydairy.com",
          phone: "555-987-6543",
        },
        {
          _id: "3",
          name: "Bakery Delights",
          contactPerson: "Mike Wilson",
          email: "mike@bakerydelights.com",
          phone: "555-456-7890",
        },
        {
          _id: "4",
          name: "MeatMaster Supply",
          contactPerson: "Lisa Brown",
          email: "lisa@meatmaster.com",
          phone: "555-789-0123",
        },
      ];
      setSuppliers(dummySuppliers);

      const randomSku = `SKU-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
      setFormData((prev) => ({
        ...prev,
        sku: randomSku,
      }));

      setIsLoading(false);
    }, 800);
  }, []);

  // Toast
  const showToast = (message, type) => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleNumberChange = (name, value) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: numValue,
      },
    }));
  };

  const handleSwitchChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));

    if (name === "isPerishable" && formData.isPerishable) {
      setFormData((prev) => ({
        ...prev,
        expiryDate: null,
      }));
    }
  };

  // Images
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      if (formData.images.length + newFiles.length > 5) {
        showToast("You can upload a maximum of 5 images", "warning");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));

      newFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, url],
        }));
      });
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(formData.imageUrls[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Tags
  const addTag = () => {
    if (tagInput.trim() === "") return;

    if (formData.tags.includes(tagInput.trim())) {
      showToast("This tag already exists", "warning");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }));

    setTagInput("");
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.supplier) {
      newErrors.supplier = "Supplier is required";
    }

    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "Selling price must be greater than 0";
    }

    if (formData.purchasePrice < 0) {
      newErrors.purchasePrice = "Purchase price cannot be negative";
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (formData.isPerishable && !formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required for perishable items";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      setTimeout(() => {
        console.log("Inventory data to submit:", formData);

        showToast(`${formData.name} has been added to your inventory`, "success");

        // navigate('/inventory');

        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Error adding inventory item:", error);
      showToast("Failed to add inventory item. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/inventory");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      const randomSku = `SKU-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;

      formData.imageUrls.forEach((url) => URL.revokeObjectURL(url));

      setFormData({
        name: "",
        description: "",
        sku: randomSku,
        barcode: null,
        category: "",
        supplier: "",
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: 0,
        unit: "pieces",
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
        location: "main-warehouse",
      });

      setErrors({});
      setTagInput("");
    }
  };

  return (
    <div className="inventory-container">
      {/* same JSX UI code continues... */}
    </div>
  );
};

export default AddNewInventory;
