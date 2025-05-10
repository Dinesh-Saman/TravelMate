import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid, Divider, IconButton, Card, CardContent, Chip, CircularProgress
} from '@material-ui/core';
import { Add, Delete, AddPhotoAlternate, Star, StarBorder } from '@material-ui/icons';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import swal from 'sweetalert';
import { useParams, useNavigate } from 'react-router-dom';
import { InputAdornment } from '@material-ui/core';
import { CalendarToday } from '@material-ui/icons';

const UpdateHotel = () => {
  const { id } = useParams(); // Get hotel ID from URL parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Main hotel details
  const [hotelId, setHotelId] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [starRating, setStarRating] = useState('');
  const [description, setDescription] = useState('');
  const [hotelImage, setHotelImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [websiteTouched, setWebsiteTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlTouched, setImageUrlTouched] = useState(false);

  // Package details
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState({
    package_name: '',
    package_description: '',
    price: '',
    no_of_rooms: 1, // Add this line with default value 1
    inclusions: [],
    validity_period: new Date(new Date().setMonth(new Date().getMonth()))
  });
  const [inclusion, setInclusion] = useState('');
  const [packageErrors, setPackageErrors] = useState({});

  // Fetch hotel data when component mounts
  useEffect(() => {
    fetchHotelData();
  }, [id]);

  // Fetch the hotel data based on ID
  const fetchHotelData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/hotel/hotels/${id}`);
      const hotel = response.data.hotel;
      
      // Populate form fields with hotel data
      setHotelId(hotel.hotel_id);
      setHotelName(hotel.hotel_name);
      setAddress(hotel.address);
      setCity(hotel.city);
      setPhoneNumber(hotel.phone_number);
      setEmail(hotel.email);
      setWebsite(hotel.website);
      setStarRating(hotel.star_rating);
      setDescription(hotel.description);
      setHotelImage(hotel.hotel_image);
      setImageUrl(hotel.hotel_image);
      setUseImageUrl(true); // Default to URL for existing image
      
      // Set packages if they exist
      if (hotel.hotel_packages && hotel.hotel_packages.length > 0) {
        // Format packages to ensure dates are handled correctly
        const formattedPackages = hotel.hotel_packages.map(pkg => ({
          ...pkg,
          validity_period: new Date(pkg.validity_period),
          no_of_rooms: pkg.no_of_rooms 
        }));
        setPackages(formattedPackages);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      swal("Error", "Failed to load hotel data. Please try again.", "error");
      setIsLoading(false);
    }
  };

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      hotelId,
      hotelName,
      address,
      city,
      phoneNumber,
      email,
      website,
      starRating,
      description,
    };
    
    // Check if all required fields have values and at least one of the image options is valid
    const imageValid = useImageUrl ? validateImageUrl(imageUrl) : uploadedImage !== null || hotelImage !== '';
    const valid = Object.values(requiredFields).every(field => field !== '') && imageValid;
    setIsFormValid(valid);
  }, [hotelId, hotelName, address, city, phoneNumber, email, website, starRating, description, hotelImage, uploadedImage, useImageUrl, imageUrl]);

  // Image URL validation
  const validateImageUrl = (value) => {
    if (!value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        imageUrl: "Hotel image URL is required"
      }));
      return false;
    } else if (!value.startsWith('')) {
      setErrors(prevErrors => ({
        ...prevErrors,
      }));
      return false;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, imageUrl: '' }));
      return true;
    }
  };

  // Contact number validation
  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  
    if (contactTouched) {
      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          phoneNumber: "Contact number must be exactly 10 digits"
        }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, phoneNumber: '' }));
      }
    }
  };

  const handleContactBlur = () => {
    setContactTouched(true);
    const contactRegex = /^\d{10}$/;
    if (!phoneNumber) {
      setErrors(prevErrors => ({
        ...prevErrors,
        phoneNumber: "Contact number is required"
      }));
    } else if (!contactRegex.test(phoneNumber)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        phoneNumber: "Contact number must be exactly 10 digits"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, phoneNumber: '' }));
    }
  };

  // Email validation
  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (emailTouched) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(inputValue)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: "Enter a valid email address"
        }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, email: '' }));
      }
    }
  };

  const handleCancel = () => {
    navigate('/view-hotels');
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Email is required"
      }));
    } else if (!emailPattern.test(email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Enter a valid email address"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  // Website validation
  const handleWebsiteChange = (e) => {
    const inputValue = e.target.value;
    setWebsite(inputValue);
    
    if (websiteTouched) {
      validateWebsite(inputValue);
    }
  };

  const handleWebsiteBlur = () => {
    setWebsiteTouched(true);
    validateWebsite(website);
  };

  const validateWebsite = (value) => {
    if (!value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        website: "Website is required"
      }));
      return false;
    }
    
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    if (!urlPattern.test(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        website: "Enter a valid website URL (e.g., https://example.com)"
      }));
      return false;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, website: '' }));
      return true;
    }
  };

  // Star rating handler
  const handleStarRatingChange = (eventOrValue) => {
    if (eventOrValue && eventOrValue.target && eventOrValue.target.value !== undefined) {
      setStarRating(eventOrValue.target.value);
    } else {
      setStarRating(eventOrValue);
    }
    
    setErrors(prevErrors => ({ ...prevErrors, starRating: '' }));
  };

  // Image handling
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/hotel/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setUploadedImage(file);
        setHotelImage(response.data.imageUrl);
        setUseImageUrl(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        swal("Error", "Failed to upload image. Please try again.", "error");
      }
    }
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setImageUrl(value);
    setHotelImage(value);
    
    if (imageUrlTouched) {
      validateImageUrl(value);
    }
  };

  const handleImageUrlBlur = () => {
    setImageUrlTouched(true);
    validateImageUrl(imageUrl);
  };

  const toggleImageSource = () => {
    setUseImageUrl(!useImageUrl);
    if (!useImageUrl) {
      setUploadedImage(null);
    }
  };

  // Package validations
  const validatePackage = () => {
    const newErrors = {};
    if (!currentPackage.package_name) newErrors.package_name = "Package name is required.";
    if (!currentPackage.package_description) newErrors.package_description = "Package description is required.";
    if (!currentPackage.price) newErrors.price = "Price is required.";
    if (!currentPackage.no_of_rooms || currentPackage.no_of_rooms < 1) {
      newErrors.no_of_rooms = "Number of rooms must be at least 1";
    }
    if (isNaN(currentPackage.price)) newErrors.price = "Price must be a number.";
    if (currentPackage.inclusions.length === 0) newErrors.inclusions = "At least one inclusion is required.";
    
    if (!currentPackage.validity_period) {
      newErrors.validity_period = "Valid date is required.";
    } else {
      try {
        const date = new Date(currentPackage.validity_period);
        if (isNaN(date.getTime())) {
          newErrors.validity_period = "Invalid date format.";
        }
      } catch (error) {
        newErrors.validity_period = "Invalid date format.";
      }
    }
    
    return newErrors;
  };

  const handleAddInclusion = () => {
    if (inclusion.trim()) {
      setCurrentPackage({
        ...currentPackage,
        inclusions: [...currentPackage.inclusions, inclusion.trim()]
      });
      setInclusion('');
      if (packageErrors.inclusions) {
        setPackageErrors(prev => ({ ...prev, inclusions: '' }));
      }
    }
  };

  const handleRemoveInclusion = (index) => {
    const updatedInclusions = [...currentPackage.inclusions];
    updatedInclusions.splice(index, 1);
    setCurrentPackage({
      ...currentPackage,
      inclusions: updatedInclusions
    });
  };

  const handleAddPackage = () => {
    let updatedPackage = { ...currentPackage };
    
    if (!updatedPackage.validity_period) {
      updatedPackage.validity_period = new Date(new Date().setMonth(new Date().getMonth()));
    }
    
    setCurrentPackage(updatedPackage);
    
    const validationErrors = validatePackage();
    if (Object.keys(validationErrors).length > 0) {
      setPackageErrors(validationErrors);
      return;
    }
    
    setPackages([...packages, { ...updatedPackage }]);
    
    setCurrentPackage({
      package_name: '',
      package_description: '',
      price: '',
      no_of_rooms: '', 
      inclusions: [],
      validity_period: new Date(new Date().setMonth(new Date().getMonth()))
    });
    setPackageErrors({});
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = [...packages];
    updatedPackages.splice(index, 1);
    setPackages(updatedPackages);
  };

  // Form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate all fields
    const validationErrors = {
      ...errors,
      ...validateForm()
    };
    
    if (Object.keys(validationErrors).filter(k => validationErrors[k]).length > 0) {
      setErrors(validationErrors);
      swal("Validation Error", "Please fix all errors before submitting", "error");
      return;
    }
  
    try {
      let imageUrl = hotelImage;
      
      // If image is uploaded, send it to the server first
      if (!useImageUrl && uploadedImage) {
        const formData = new FormData();
        formData.append('image', uploadedImage);
        
        const uploadResponse = await axios.post('https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/hotel/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      // Prepare each package by formatting the date properly
      const formattedPackages = packages.map(pkg => ({
        ...pkg,
        validity_period: new Date(pkg.validity_period).toISOString()
      }));
  
      const updatedHotel = {
        hotel_id: hotelId,
        hotel_name: hotelName,
        address,
        city,
        phone_number: phoneNumber,
        email,
        website,
        star_rating: Number(starRating),
        description,
        hotel_image: imageUrl,
        hotel_packages: formattedPackages,
      };
  
      // Send PUT request to update hotel
      const response = await axios.put(`https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/hotel/hotels/${id}`, updatedHotel);
      
      swal("Success", "Hotel updated successfully!", "success");
    } catch (error) {
      console.error('Error updating hotel:', error);
      
      if (error.response && error.response.status === 404) {
        swal("Error", "Hotel not found", "error");
      } else if (error.response && error.response.data.error && error.response.data.error.includes('duplicate key')) {
        if (error.response.data.error.includes('email')) {
          setErrors(prevErrors => ({ ...prevErrors, email: "This email is already registered" }));
          swal("Error", "This email is already registered", "error");
        } else if (error.response.data.error.includes('phone_number')) {
          setErrors(prevErrors => ({ ...prevErrors, phoneNumber: "This phone number is already registered" }));
          swal("Error", "This phone number is already registered", "error");
        } else {
          swal("Error", "A duplicate value was detected", "error");
        }
      } else {
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!hotelId) newErrors.hotelId = "Hotel ID is required.";
    if (!hotelName) newErrors.hotelName = "Hotel Name is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!website) newErrors.website = "Website is required.";
    if (!starRating) newErrors.starRating = "Star Rating is required.";
    if (!description) newErrors.description = "Description is required.";
    
    // Field format validation
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Contact number must be exactly 10 digits";
    }
    
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    if (website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(website)) {
      newErrors.website = "Enter a valid website URL";
    }
    
    // Image validation
    if (useImageUrl && !hotelImage) {
      newErrors.hotelImage = "Hotel Image URL is required.";
    }  else if (!useImageUrl && !uploadedImage && !hotelImage) {
      newErrors.hotelImage = "Please upload an image or provide a URL.";
    }
    
    return newErrors;
  };

  // Star Rating Component
  const StarRatingComponent = () => {
    const totalStars = 5;
    
    return (
      <Box mt={2}>
        <Typography variant="body1" gutterBottom>Star Rating <span style={{ color: 'red' }}>*</span></Typography>
        <Box display="flex" alignItems="center">
          {[...Array(totalStars)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <IconButton 
                key={index}
                onClick={() => handleStarRatingChange(ratingValue)}
                style={{ padding: '4px' }}
              >
                {ratingValue <= starRating ? 
                  <Star style={{ color: '#FFD700' }} fontSize="large" /> : 
                  <StarBorder fontSize="large" />
                }
              </IconButton>
            );
          })}
        </Box>
        {errors.starRating && (
          <FormHelperText error>{errors.starRating}</FormHelperText>
        )}
      </Box>
    );
  };

  // List of cities for the dropdown
  const popularCities = [
    "Colombo", "Kandy", "Galle", "Negombo", "Bentota", 
    "Nuwara Eliya", "Ella", "Mirissa", "Hikkaduwa", "Trincomalee", 
    "Anuradhapura", "Sigiriya", "Dambulla", "Jaffna", "Arugam Bay",
    "Batticaloa", "Tangalle", "Unawatuna", "Matara", "Habarana"
  ];

  // Show loading indicator while fetching data
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Loading hotel data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          {/* Title Section */}
          <Box
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'30px', marginBottom:'50px' }}>
              Update Hotel
            </Typography>
          </Box>
  
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Left side - Hotel Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Hotel Details
                </Typography>
                
                {/* Hotel Details Form Fields */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hotel ID"
                      variant="outlined"
                      value={hotelId}
                      InputProps={{
                        readOnly: true,
                        style: {
                          backgroundColor: '#f0f0f0',
                          color: '#757575',
                          cursor: 'not-allowed',
                        },
                      }}
                      helperText="System generated Hotel ID (cannot be modified)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hotel Name"
                      variant="outlined"
                      value={hotelName}
                      onChange={(e) => {
                        setHotelName(e.target.value);
                        if (errors.hotelName) {
                          setErrors(prevErrors => ({ ...prevErrors, hotelName: '' }));
                        }
                      }}
                      helperText={errors.hotelName}
                      error={!!errors.hotelName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Address"
                      variant="outlined"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) {
                          setErrors(prevErrors => ({ ...prevErrors, address: '' }));
                        }
                      }}
                      helperText={errors.address}
                      error={!!errors.address}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.city} required>
                      <InputLabel>City</InputLabel>
                      <Select
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city) {
                            setErrors(prevErrors => ({ ...prevErrors, city: '' }));
                          }
                        }}
                        label="City"
                      >
                        {popularCities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.city}</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Contact Number"
                      variant="outlined"
                      value={phoneNumber}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      helperText={errors.phoneNumber || "10-digit number"}
                      error={!!errors.phoneNumber}
                      required
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Website"
                      variant="outlined"
                      value={website}
                      onChange={handleWebsiteChange}
                      onBlur={handleWebsiteBlur}
                      helperText={errors.website || "e.g., https://example.com"}
                      error={!!errors.website}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      helperText={errors.email}
                      error={!!errors.email}
                      required
                    />
                  </Grid>
                  
                  {/* Star Rating with Icons */}
                  <Grid item xs={12}>
                    <StarRatingComponent />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors(prevErrors => ({ ...prevErrors, description: '' }));
                        }
                      }}
                      helperText={errors.description}
                      error={!!errors.description}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <Typography variant="body1" style={{ textAlign: 'left', marginBottom: '15px', color: '#666' }}>
                    <strong>Note:</strong> After updating the hotel, you can:
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: 'left', color: '#666' }}>
                    • Continue to add more packages to this hotel<br />
                    • Further edit hotel information as needed<br />
                    • View all available packages and promotions<br />
                    • Check hotel performance metrics
                  </Typography>
                </Box>
              </Grid>
  
              {/* Right side - Image Preview and Package Details */}
              <Grid item xs={12} md={6}>
                {/* Hotel Image Preview Section */}
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Hotel Image
                </Typography>
                
                {/* Hotel Image Preview */}
                <Box
                  style={{
                    width: '100%',
                    height: '250px',
                    border: '1px dashed #ccc',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}
                >
                  {hotelImage ? (
                    <img
                      src={hotelImage ? hotelImage : `http://localhost:3001${hotelImage}`}
                      alt="Hotel Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      {useImageUrl ? 'Enter a valid image URL to see preview' : 'Upload an image to see preview'}
                    </Typography>
                  )}
                </Box>
                
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.hotelImage}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={toggleImageSource}
                    style={{ marginBottom: '10px' }}
                  >
                    {useImageUrl ? 'Switch to Image Upload' : 'Switch to Image URL'}
                  </Button>
                  
                  {useImageUrl ? (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hotel Image URL"
                      variant="outlined"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      onBlur={handleImageUrlBlur}
                      helperText={errors.imageUrl}
                      error={!!errors.imageUrl}
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  ) : (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          startIcon={<AddPhotoAlternate />}
                          fullWidth
                        >
                          Upload New Image
                        </Button>
                      </label>
                      {uploadedImage && (
                        <Typography variant="body2" style={{ marginTop: '8px' }}>
                          File: {uploadedImage.name}
                        </Typography>
                      )}
                      {errors.hotelImage && (
                        <FormHelperText error>{errors.hotelImage}</FormHelperText>
                      )}
                    </Box>
                  )}
                </FormControl>
  
                <Divider style={{ margin: '20px 0' }} />
  
                {/* Package Details Section */}
                <Typography variant="h6" gutterBottom style={{ color: '#555', marginTop: '20px' }}>
                  Manage Packages
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package Name"
                      variant="outlined"
                      value={currentPackage.package_name}
                      onChange={(e) => {
                        setCurrentPackage({ ...currentPackage, package_name: e.target.value });
                        if (packageErrors.package_name) {
                          setPackageErrors(prev => ({ ...prev, package_name: '' }));
                        }
                      }}
                      error={!!packageErrors.package_name}
                      helperText={packageErrors.package_name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package Description"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={currentPackage.package_description}
                      onChange={(e) => {
                        setCurrentPackage({ ...currentPackage, package_description: e.target.value });
                        if (packageErrors.package_description) {
                          setPackageErrors(prev => ({ ...prev, package_description: '' }));
                        }
                      }}
                      error={!!packageErrors.package_description}
                      helperText={packageErrors.package_description}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Price"
                    variant="outlined"
                    type="text"  // Changed from "number" to "text"
                    value={currentPackage.price}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Allow only numbers and a single decimal point
                      value = value.replace(/[^0-9.]/g, '');
                      // Ensure only one decimal point
                      const parts = value.split('.');
                      if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join('');
                      }
                      // Update only if valid
                      if (value === '' || (Number(value) > 0 && Number(value) <= 1000000)) {
                        setCurrentPackage({ ...currentPackage, price: value });
                        if (packageErrors.price) {
                          setPackageErrors(prev => ({ ...prev, price: '' }));
                        }
                      }
                    }}
                    onBlur={() => {
                      if (currentPackage.price && Number(currentPackage.price) > 1000000) {
                        setPackageErrors(prev => ({ 
                          ...prev, 
                          price: "Price cannot exceed 1,000,000" 
                        }));
                      }
                    }}
                    error={!!packageErrors.price}
                    helperText={packageErrors.price || "Maximum: 1,000,000"}
                    required
                    inputProps={{
                      inputMode: "decimal",  // Shows numeric keyboard on mobile
                      pattern: "[0-9.]*",   // Helps with HTML5 validation (optional)
                    }}
                  />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Number of Rooms"
                    variant="outlined"
                    type="number"
                    value={currentPackage.no_of_rooms}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      
                      // Allow empty value during editing
                      if (inputValue === '') {
                        setCurrentPackage({ ...currentPackage, no_of_rooms: '' });
                        return;
                      }
                      
                      // Validate only when there's actual input
                      const numericValue = parseInt(inputValue, 10);
                      if (!isNaN(numericValue)) {
                        const clampedValue = Math.min(1000, Math.max(1, numericValue));
                        setCurrentPackage({ ...currentPackage, no_of_rooms: clampedValue });
                      }
                      
                      // Clear any existing errors
                      if (packageErrors.no_of_rooms) {
                        setPackageErrors(prev => ({ ...prev, no_of_rooms: '' }));
                      }
                    }}
                    onBlur={() => {
                      // Set default to 1 when empty
                      if (currentPackage.no_of_rooms === '') {
                        setCurrentPackage({ ...currentPackage, no_of_rooms: 1 });
                      }
                      // Validate max value
                      else if (currentPackage.no_of_rooms > 1000) {
                        setPackageErrors(prev => ({ 
                          ...prev, 
                          no_of_rooms: "Number of rooms cannot exceed 1000" 
                        }));
                      }
                    }}
                    error={!!packageErrors.no_of_rooms}
                    helperText={packageErrors.no_of_rooms || "Maximum 1000 Rooms Allowed."}
                    required
                    inputProps={{
                      min: 1,
                      max: 1000,
                      step: 1,
                    }}
                  />
                </Grid>
                  <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Validity Period"
                    type="date"
                    variant="outlined"
                    value={
                      currentPackage.validity_period
                        ? new Date(currentPackage.validity_period).toISOString().split("T")[0]
                        : new Date(new Date().setMonth(new Date().getMonth())).toISOString().split("T")[0]
                    }
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      if (selectedDate < today) {
                        // Revert to previous valid date if user tries to select a past date
                        setCurrentPackage({ 
                          ...currentPackage, 
                          validity_period: currentPackage.validity_period || new Date(new Date().setMonth(new Date().getMonth()))
                        });
                        setPackageErrors((prev) => ({ 
                          ...prev, 
                          validity_period: "Cannot select past dates" 
                        }));
                      } else {
                        setCurrentPackage({ 
                          ...currentPackage, 
                          validity_period: selectedDate 
                        });
                        if (packageErrors.validity_period) {
                          setPackageErrors((prev) => ({ ...prev, validity_period: "" }));
                        }
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                      style: {
                        // This will make the calendar popup show disabled dates
                        // Note: Browser support may vary
                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                          filter: 'none'
                        },
                        '& input[type="date"]::-webkit-datetime-edit-fields-wrapper': {
                          color: 'inherit'
                        }
                      }
                    }}

                    error={!!packageErrors.validity_period}
                    helperText={packageErrors.validity_period || "Select a date today or in the future"}
                    required
                  />

                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Inclusions</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Add inclusion (e.g., Free breakfast)"
                        value={inclusion}
                        onChange={(e) => setInclusion(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInclusion();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddInclusion}
                        style={{ marginLeft: '10px', height: '56px' }}
                        disabled={!inclusion.trim()}
                      >
                        <Add />
                      </Button>
                    </Box>
                    {packageErrors.inclusions && (
                      <FormHelperText error>{packageErrors.inclusions}</FormHelperText>
                    )}
                    
                    <Box mt={2} mb={2}>
                      {currentPackage.inclusions.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemoveInclusion(index)}
                          color="primary"
                          variant="outlined"
                          style={{ margin: '5px' }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddPackage}
                      fullWidth
                      style={{ marginTop: '10px' }}
                      disabled={!currentPackage.package_name || !currentPackage.package_description || !currentPackage.price || currentPackage.inclusions.length === 0}
                    >
                      Add Package
                    </Button>
                  </Grid>
                </Grid>
                
                {/* Display existing packages */}
                {packages.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                      Current Packages
                    </Typography>
                    <Grid container spacing={2}>
                      {packages.map((pkg, index) => (
                        <Grid item xs={12} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{pkg.package_name}</Typography>
                                <IconButton onClick={() => handleRemovePackage(index)}>
                                  <Delete color="error" />
                                </IconButton>
                              </Box>
                              <Typography variant="body2" color="textSecondary">
                                {pkg.package_description}
                              </Typography>
                              <Typography variant="body1" style={{ marginTop: '10px' }}>
                                Price: ${pkg.price}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Rooms: {pkg.no_of_rooms}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Valid until: {new Date(pkg.validity_period).toLocaleDateString()}
                              </Typography>
                              <Box mt={1}>
                                <Typography variant="subtitle2">Inclusions:</Typography>
                                <Box display="flex" flexWrap="wrap">
                                  {pkg.inclusions.map((item, i) => (
                                    <Chip
                                      key={i}
                                      label={item}
                                      size="small"
                                      style={{ margin: '2px' }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleCancel}
                style={{ width: '48%' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!isFormValid}
                style={{ width: '48%' }}
              >
                {'Update Hotel'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateHotel;