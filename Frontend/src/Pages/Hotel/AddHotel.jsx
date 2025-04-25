import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid, Divider, IconButton, Card, CardContent, Chip
} from '@material-ui/core';
import { Add, Delete, AddPhotoAlternate, Star, StarBorder } from '@material-ui/icons';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/navbar'; 
import axios from 'axios';
import swal from 'sweetalert';

const AddHotel = () => {
  // Main hotel details
  const [hotelId, setHotelId] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [starRating, setStarRating] = useState('');
  const [description, setDescription] = useState('');
  const [hotelImage, setHotelImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [websiteTouched, setWebsiteTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);
  const [imageUrlTouched, setImageUrlTouched] = useState(false);

  // Package details
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState({
    package_name: '',
    package_description: '',
    price: '',
    no_of_rooms: 1, // Default to 1 room
    inclusions: [],
    validity_period: new Date(new Date().setMonth(new Date().getMonth()))
  });
  const [inclusion, setInclusion] = useState('');
  const [packageErrors, setPackageErrors] = useState({});

  // Generate hotel ID
  const generateHotelId = () => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `HTL${randomNum}`;
  };

  useEffect(() => {
    const newHotelId = generateHotelId();
    setHotelId(newHotelId);
  }, []);

  // Validate form whenever relevant fields change
  useEffect(() => {
    const validateForm = () => {
      const requiredFields = {
        hotelId,
        hotelName,
        address,
        city,
        contact,
        email,
        starRating,
        description,
      };
      
      // Check basic required fields
      const basicFieldsValid = Object.values(requiredFields).every(field => field !== '');
      
      // Validate image
      let imageValid = false;
      if (useImageUrl) {
        imageValid = hotelImage;
      } else {
        imageValid = uploadedImage !== null;
      }
      
      // Validate email format if email is not empty
      const emailValid = !email || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      
      // Validate contact if not empty
      const contactValid = !contact || /^\d{10}$/.test(contact);
      
      // Website is optional but must be valid if provided
      const websiteValid = !website || /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(website);
      
      setIsFormValid(
        basicFieldsValid && 
        imageValid && 
        emailValid && 
        contactValid && 
        websiteValid
      );
    };

    validateForm();
  }, [
    hotelId, hotelName, address, city, contact, email, website, 
    starRating, description, hotelImage, uploadedImage, useImageUrl
  ]);

  // Image URL handling
  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setHotelImage(value);
    
    if (imageUrlTouched) {
      validateImageUrl(value);
    }
  };

  const handleImageUrlBlur = () => {
    setImageUrlTouched(true);
    validateImageUrl(hotelImage);
  };

  const validateImageUrl = (value) => {
    if (!value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        hotelImage: "Hotel image URL is required"
      }));
      return false;
    }
       else {
      setErrors(prevErrors => ({ ...prevErrors, hotelImage: '' }));
      return true;
    }
  };

  // Contact handling
  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setContact(value);
  
    if (contactTouched) {
      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          contact: "Contact number must be exactly 10 digits"
        }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, contact: '' }));
      }
    }
  };

  const handleContactBlur = () => {
    setContactTouched(true);
    const contactRegex = /^\d{10}$/;
    if (!contact) {
      setErrors(prevErrors => ({
        ...prevErrors,
        contact: "Contact number is required"
      }));
    } else if (!contactRegex.test(contact)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        contact: "Contact number must be exactly 10 digits"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, contact: '' }));
    }
  };

  // Email handling
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

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Enter a valid email address"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  // Website handling
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
      setErrors(prevErrors => ({ ...prevErrors, website: '' }));
      return;
    }
    
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    if (!urlPattern.test(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        website: "Enter a valid website URL (e.g., https://example.com)"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, website: '' }));
    }
  };

  // Star rating handling
  const handleStarRatingChange = (eventOrValue) => {
    if (eventOrValue && eventOrValue.target && eventOrValue.target.value !== undefined) {
      setStarRating(eventOrValue.target.value);
    } else {
      setStarRating(eventOrValue);
    }
    
    setErrors(prevErrors => ({ ...prevErrors, starRating: '' }));
  };

  // Image upload handling
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:3001/hotel/upload', formData, {
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

  const toggleImageSource = () => {
    setUseImageUrl(!useImageUrl);
    if (useImageUrl) {
      setHotelImage('');
    } else {
      setUploadedImage(null);
    }
  };

  // Package handling
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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
  
    // Basic field validations
    if (!hotelId) {
      newErrors.hotelId = "Hotel ID is required";
      isValid = false;
    }
    if (!hotelName) {
      newErrors.hotelName = "Hotel Name is required";
      isValid = false;
    }
    if (!address) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!city) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!contact) {
      newErrors.contact = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact must be 10 digits";
      isValid = false;
    }
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!starRating) {
      newErrors.starRating = "Star rating is required";
      isValid = false;
    }
    if (!description) {
      newErrors.description = "Description is required";
      isValid = false;
    }
  
    // Image validation
    if (useImageUrl) {
      if (!hotelImage) {
        newErrors.hotelImage = "Image URL is required";
        isValid = false;
      }
    } else {
      if (!uploadedImage) {
        newErrors.hotelImage = "Please upload an image";
        isValid = false;
      }
    }
  
    // Website validation (optional but must be valid if provided)
    if (website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(website)) {
      newErrors.website = "Invalid website URL";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
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
      no_of_rooms: 1, // Reset to 1
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      let imageUrl = hotelImage;
      
      if (!useImageUrl && uploadedImage) {
        const formData = new FormData();
        formData.append('image', uploadedImage);
        
        const uploadResponse = await axios.post('http://localhost:3001/hotel/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      const formattedPackages = packages.map(pkg => ({
        ...pkg,
        validity_period: new Date(pkg.validity_period).toISOString()
      }));
  
      const newHotel = {
        hotel_id: hotelId,
        hotel_name: hotelName,
        address,
        city,
        phone_number: contact,
        email,
        website,
        star_rating: Number(starRating),
        description,
        hotel_image: imageUrl,
        hotel_packages: formattedPackages,
      };
  
      const response = await axios.post('http://localhost:3001/hotel/add-hotel', newHotel);
      
      swal("Success", "New hotel added successfully!", "success");
      // Reset form fields
      const newHotelId = generateHotelId();
      setHotelId(newHotelId);
      setHotelName('');
      setAddress('');
      setCity('');
      setPhoneNumber('');
      setEmail('');
      setWebsite('');
      setStarRating('');
      setDescription('');
      setHotelImage('');
      setUploadedImage(null);
      setPackages([]);
      setErrors({});
    } catch (error) {
      console.error('Error creating hotel:', error);
      
      if (error.response && error.response.status === 400) {
        swal("Error", error.response.data.message, "error");
        setErrors(prevErrors => ({ 
          ...prevErrors, 
          hotelId: "A hotel with this ID already exists" 
        }));
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

  const popularCities = [
    "Colombo", "Kandy", "Galle", "Negombo", "Bentota", 
    "Nuwara Eliya", "Ella", "Mirissa", "Hikkaduwa", "Trincomalee", 
    "Anuradhapura", "Sigiriya", "Dambulla", "Jaffna", "Arugam Bay",
    "Batticaloa", "Tangalle", "Unawatuna", "Matara", "Habarana"
  ];

  return (
    <Box>
      <Box display="flex" style={{ backgroundColor: '#f5f5f5'}}>
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          <Box
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'30px', marginBottom:'50px' }}>
              Add New Hotel
            </Typography>
          </Box>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Hotel Details
                </Typography>
                
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
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Contact Number"
                        variant="outlined"
                        value={contact}
                        onChange={handleContactChange}
                        onBlur={handleContactBlur}
                        helperText={errors.contact || ""}
                        error={!!errors.contact}
                        required
                        inputProps={{ maxLength: 10, pattern: "[0-9]{10}" }}
                        placeholder="10-digit number"
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
                        helperText={errors.website || ""}
                        error={!!errors.website}
                        placeholder="https://example.com"
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
                        helperText={errors.email || ""}
                        error={!!errors.email}
                        required
                      />
                      </Grid>
                    </Grid>
                  </Grid>
                  
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
                    <strong>Note:</strong> After adding the hotel, you can:
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: 'left', color: '#666' }}>
                    • Add more packages to this hotel from the hotel details page<br />
                    • Edit hotel information<br />
                    • Manage packages and promotions<br />
                    • View hotel performance metrics
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Hotel Image
                </Typography>
                
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
                      src={hotelImage}
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
                      value={hotelImage}
                      onChange={handleImageUrlChange}
                      onBlur={handleImageUrlBlur}
                      helperText={errors.hotelImage}
                      error={!!errors.hotelImage}
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
                          Upload Image
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

                <Typography variant="h6" gutterBottom style={{ color: '#555', marginTop: '20px' }}>
                  Add Package Details
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
                    type="number"
                    value={currentPackage.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[+-]/g, '');
                      if (value === '' || (Number(value) > 0 && Number(value) <= 10000000)) {
                        setCurrentPackage({ ...currentPackage, price: value });
                        if (packageErrors.price) {
                          setPackageErrors(prev => ({ ...prev, price: '' }));
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['+', '-', 'e', 'E'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onBlur={() => {
                      if (!currentPackage.price || Number(currentPackage.price) <= 0) {
                        setPackageErrors(prev => ({ ...prev, price: "Price must be greater than 0" }));
                      } else if (Number(currentPackage.price) > 10000000) {
                        setPackageErrors(prev => ({ ...prev, price: "Price cannot exceed 10,000,000" }));
                      }
                    }}
                    error={!!packageErrors.price}
                    helperText={packageErrors.price || "Maximum: Rs 1000000"}
                    required
                    inputProps={{
                      min: 0.01,
                      max: 10000000,
                      step: "0.01",
                      pattern: "[0-9]*",
                      inputMode: "numeric"
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
                      
                      // Only validate numbers when actually entered
                      const numericValue = parseInt(inputValue);
                      if (!isNaN(numericValue)) {
                        const clampedValue = Math.min(1000, Math.max(1, numericValue));
                        setCurrentPackage({ ...currentPackage, no_of_rooms: clampedValue });
                      }
                      
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
                    id="validity-period"
                    label="Validity Period"
                    type="date"
                    variant="outlined"
                    value={
                      currentPackage.validity_period
                        ? new Date(currentPackage.validity_period).toISOString().split('T')[0]
                        : new Date(new Date().setMonth(new Date().getMonth())).toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const selectedDate = e.target.value ? new Date(e.target.value) : null;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      if (!selectedDate || selectedDate < today) {
                        setCurrentPackage({
                          ...currentPackage,
                          validity_period: currentPackage.validity_period || 
                            new Date(new Date().setMonth(new Date().getMonth()))
                        });
                        setPackageErrors(prev => ({
                          ...prev,
                          validity_period: "Please select today or a future date"
                        }));
                      } else {
                        setCurrentPackage({
                          ...currentPackage,
                          validity_period: selectedDate
                        });
                        setPackageErrors(prev => ({ ...prev, validity_period: '' }));
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    error={!!packageErrors.validity_period}
                    helperText={packageErrors.validity_period || "Select a date from today onwards"}
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
                      <IconButton color="primary" onClick={handleAddInclusion}>
                        <Add />
                      </IconButton>
                    </Box>
                    {packageErrors.inclusions && (
                      <FormHelperText error>{packageErrors.inclusions}</FormHelperText>
                    )}
                    <Box display="flex" flexWrap="wrap" mt={2}>
                      {currentPackage.inclusions.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemoveInclusion(index)}
                          style={{ margin: '4px' }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddPackage}
                      startIcon={<Add />}
                      fullWidth
                    >
                      Add Package
                    </Button>
                  </Grid>
                </Grid>
                
                <Divider style={{ margin: '20px 0' }} />
                
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Added Packages
                </Typography>
                
                {packages.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No packages added yet.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {packages.map((pkg, index) => (
                      <Card variant="outlined" key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{pkg.package_name}</Typography>
                            <IconButton size="small" onClick={() => handleRemovePackage(index)}>
                              <Delete />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Price: ${pkg.price}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Rooms: {pkg.no_of_rooms}
                          </Typography>
                          <Typography variant="body2">
                            {pkg.package_description}
                          </Typography>
                          <Typography variant="body2" style={{ marginTop: '8px' }}>
                            Inclusions:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" mt={1}>
                            {pkg.inclusions.map((item, i) => (
                              <Chip
                                key={i}
                                label={item}
                                size="small"
                                style={{ margin: '2px' }}
                              />
                            ))}
                          </Box>
                          <Typography variant="body2" style={{ marginTop: '8px' }}>
                            Valid until: {new Date(pkg.validity_period).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 24 }}
              disabled={!isFormValid}
            >
              Add Hotel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddHotel;