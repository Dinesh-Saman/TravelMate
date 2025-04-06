import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormHelperText, Chip, IconButton, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import EcoIcon from '@material-ui/icons/Eco'; 
import Brightness2Icon from '@material-ui/icons/Brightness2'; 
import AcUnitIcon from '@material-ui/icons/AcUnit';
import WbCloudyIcon from '@material-ui/icons/WbCloudy';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import OpacityIcon from '@material-ui/icons/Opacity';
import TerrainIcon from '@material-ui/icons/Terrain';
import Sidebar from '../../Components/destination_sidebar';
import axios from 'axios';
import swal from 'sweetalert';

const AddDestination = () => {
  const [destinationId, setDestinationId] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [destinationImage, setDestinationImage] = useState('');
  const [destinationRating, setDestinationRating] = useState('');
  const [destinationDescription, setDestinationDescription] = useState('');
  const [location, setLocation] = useState('');
  const [popularAttractions, setPopularAttractions] = useState([]);
  const [currentAttraction, setCurrentAttraction] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [travelTips, setTravelTips] = useState('');
  const [accommodationOptions, setAccommodationOptions] = useState([]);
  const [currentAccommodation, setCurrentAccommodation] = useState('');
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState('');
  const [climate, setClimate] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [destinationContact, setDestinationContact] = useState('');
  const [contactTouched, setContactTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

// Climate options with icons
const climateOptions = [
  { value: 'Tropical', icon: <BeachAccessIcon />, color: '#FFA500' },
  { value: 'Temperate', icon: <WbCloudyIcon />, color: '#87CEEB' },
  { value: 'Arid (Desert)', icon: <WbSunnyOutlinedIcon />, color: '#FFD700' },
  { value: 'Mediterranean', icon: <OpacityIcon />, color: '#4682B4' },
  { value: 'Continental', icon: <WbSunnyIcon />, color: '#32CD32' },
  { value: 'Polar', icon: <AcUnitIcon />, color: '#ADD8E6' },
  { value: 'Mountain', icon: <TerrainIcon />, color: '#8B4513' },
  { value: 'Rainforest', icon: <EcoIcon />, color: '#228B22' },
];

// Best time to visit options with icons
const timeOptions = [
  { value: 'Early Morning', icon: <Brightness5Icon />, color: '#FFB74D' },
  { value: 'Morning', icon: <WbSunnyIcon />, color: '#FFC107' },
  { value: 'Afternoon', icon: <Brightness7Icon />, color: '#FF9800' },
  { value: 'Evening', icon: <Brightness6Icon />, color: '#FB8C00' },
  { value: 'Sunset', icon: <Brightness2Icon />, color: '#E64A19' },
  { value: 'Night', icon: <Brightness4Icon />, color: '#455A64' },
];

  // Generate destination ID on component mount
  useEffect(() => {
    generateDestinationId();
  }, []);

  // Function to generate a unique destination ID
  const generateDestinationId = () => {
    const prefix = 'DEST';
    const timestamp = new Date().getTime().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newId = `${prefix}-${timestamp}-${randomNum}`;
    setDestinationId(newId);
  };

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      destinationId,
      destinationName,
      destinationImage,
      destinationRating,
      destinationDescription,
      location,
      bestTimeToVisit,
      travelTips,
      climate,
      destinationContact
    };
    
    // Check if all required fields have values and required arrays are not empty
    const valid = Object.values(requiredFields).every(field => field !== '') && 
                 popularAttractions.length > 0 && 
                 accommodationOptions.length > 0 && 
                 activities.length > 0 &&
                 destinationContact.length === 10 &&
                 /^\d+$/.test(destinationContact);
    
    setIsFormValid(valid);
  }, [destinationId, destinationName, destinationImage, destinationRating, destinationDescription, 
      location, popularAttractions, bestTimeToVisit, travelTips, accommodationOptions, 
      activities, climate, destinationContact]);

  // Handle contact field change
  const handleContactChange = (event) => {
    const value = event.target.value;
    // Only allow digits
    if (value === '' || /^\d+$/.test(value)) {
      // Limit to 10 digits
      if (value.length <= 10) {
        setDestinationContact(value);
      }
    }
    setContactTouched(true);
  };

  // Handle contact field blur
  const handleContactBlur = () => {
    setContactTouched(true);
    validateContactField();
  };

  // Validate contact field
  const validateContactField = () => {
    if (destinationContact === '') {
      setErrors(prevErrors => ({ ...prevErrors, destinationContact: 'Contact number is required' }));
      return false;
    } else if (destinationContact.length !== 10) {
      setErrors(prevErrors => ({ ...prevErrors, destinationContact: 'Contact number must be exactly 10 digits' }));
      return false;
    } else if (!/^\d+$/.test(destinationContact)) {
      setErrors(prevErrors => ({ ...prevErrors, destinationContact: 'Contact number must contain only digits' }));
      return false;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, destinationContact: '' }));
      return true;
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (event) => {
    const url = event.target.value;
    setDestinationImage(url);
    setPreviewImage(url);
    setErrors(prevErrors => ({ ...prevErrors, destinationImage: '' }));
  };

  // Handle adding a new attraction
  const handleAddAttraction = () => {
    if (currentAttraction.trim() !== '') {
      setPopularAttractions([...popularAttractions, currentAttraction.trim()]);
      setCurrentAttraction('');
    }
  };

  // Handle removing an attraction
  const handleRemoveAttraction = (index) => {
    const newAttractions = [...popularAttractions];
    newAttractions.splice(index, 1);
    setPopularAttractions(newAttractions);
  };

  // Handle adding a new accommodation option
  const handleAddAccommodation = () => {
    if (currentAccommodation.trim() !== '') {
      setAccommodationOptions([...accommodationOptions, currentAccommodation.trim()]);
      setCurrentAccommodation('');
    }
  };

  // Handle removing an accommodation option
  const handleRemoveAccommodation = (index) => {
    const newOptions = [...accommodationOptions];
    newOptions.splice(index, 1);
    setAccommodationOptions(newOptions);
  };

  // Handle adding a new activity
  const handleAddActivity = () => {
    if (currentActivity.trim() !== '') {
      setActivities([...activities, currentActivity.trim()]);
      setCurrentActivity('');
    }
  };

  // Handle removing an activity
  const handleRemoveActivity = (index) => {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  };

  // Handle climate selection
  const handleClimateSelect = (selectedClimate) => {
    setClimate(selectedClimate);
    setErrors(prevErrors => ({ ...prevErrors, climate: '' }));
  };

  // Handle best time to visit selection
  const handleTimeSelect = (selectedTime) => {
    setBestTimeToVisit(selectedTime);
    setErrors(prevErrors => ({ ...prevErrors, bestTimeToVisit: '' }));
  };

  // Handle star rating change
  const handleStarRating = (rating) => {
    setDestinationRating(rating);
    setErrors(prevErrors => ({ ...prevErrors, destinationRating: '' }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!destinationId) newErrors.destinationId = "Destination ID is required.";
    if (!destinationName) newErrors.destinationName = "Destination Name is required.";
    if (!destinationImage) newErrors.destinationImage = "Destination Image URL is required.";
    if (!destinationRating) newErrors.destinationRating = "Destination Rating is required.";
    if (!destinationDescription) newErrors.destinationDescription = "Destination Description is required.";
    if (!location) newErrors.location = "Location is required.";
    if (popularAttractions.length === 0) newErrors.popularAttractions = "At least one popular attraction is required.";
    if (!bestTimeToVisit) newErrors.bestTimeToVisit = "Best Time to Visit is required.";
    if (!travelTips) newErrors.travelTips = "Travel Tips are required.";
    if (accommodationOptions.length === 0) newErrors.accommodationOptions = "At least one accommodation option is required.";
    if (activities.length === 0) newErrors.activities = "At least one activity is required.";
    if (!climate) newErrors.climate = "Climate is required.";
    
    // Validate contact field
    if (!destinationContact) {
      newErrors.destinationContact = "Contact number is required.";
    } else if (destinationContact.length !== 10) {
      newErrors.destinationContact = "Contact number must be exactly 10 digits.";
    } else if (!/^\d+$/.test(destinationContact)) {
      newErrors.destinationContact = "Contact number must contain only digits.";
    }
    
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      // For URL-based images, use regular JSON
      const destinationData = {
        destination_id: destinationId,
        destination_name: destinationName,
        destination_image_url: destinationImage,
        destination_rating: destinationRating,
        destination_description: destinationDescription,
        location: location,
        popular_attractions: popularAttractions,
        best_time_to_visit: bestTimeToVisit,
        travel_tips: travelTips,
        accommodation_options: accommodationOptions,
        activities: activities,
        climate: climate,
        destination_contact: destinationContact
      };
      
      const response = await axios.post('http://localhost:3001/destination/add-destination', destinationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Log response for debugging
      console.log('Server response:', response.data);
  
      swal("Success", "New destination added successfully!", "success");
      
      // Reset form fields but generate a new ID
      generateDestinationId();
      setDestinationName('');
      setDestinationImage('');
      setDestinationRating('');
      setDestinationDescription('');
      setLocation('');
      setPopularAttractions([]);
      setCurrentAttraction('');
      setBestTimeToVisit('');
      setTravelTips('');
      setAccommodationOptions([]);
      setCurrentAccommodation('');
      setActivities([]);
      setCurrentActivity('');
      setClimate('');
      setPreviewImage('');
      setDestinationContact('');
      setContactTouched(false);
      setErrors({});
    } catch (error) {
      console.error(error);
      
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        swal("Error", error.response.data.message, "error");
        // Generate a new ID if there's a collision
        generateDestinationId();
      } else {
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

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
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'30px' }}>
              Add New Destination
            </Typography>
          </Box>

          {/* Main form - Moved to top level and wraps all inputs */}
          <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box display="flex" width="100%" flexDirection={{ xs: 'column', md: 'row' }}>
              {/* Left Form Section */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ flex: 1, padding: '20px', margin: '15px' }}
              >
                <TextField
                  fullWidth
                  label="Destination ID (Auto-generated)"
                  variant="outlined"
                  value={destinationId}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                  style={{marginTop:'20px'}}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Destination Name"
                  variant="outlined"
                  value={destinationName}
                  onChange={(e) => {
                    setDestinationName(e.target.value);
                    if (errors.destinationName) {
                      setErrors(prevErrors => ({ ...prevErrors, destinationName: '' }));
                    }
                  }}
                  helperText={errors.destinationName}
                  error={!!errors.destinationName}
                  required
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  variant="outlined"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) {
                      setErrors(prevErrors => ({ ...prevErrors, location: '' }));
                    }
                  }}
                  helperText={errors.location}
                  error={!!errors.location}
                  required
                />

                {/* New Contact Field */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Destination Contact"
                  variant="outlined"
                  value={destinationContact}
                  onChange={handleContactChange}
                  onBlur={handleContactBlur}
                  helperText={contactTouched && errors.destinationContact ? errors.destinationContact : ''}
                  error={contactTouched && !!errors.destinationContact}
                  required
                  inputProps={{
                    maxLength: 10,
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={destinationDescription}
                  onChange={(e) => {
                    setDestinationDescription(e.target.value);
                    if (errors.destinationDescription) {
                      setErrors(prevErrors => ({ ...prevErrors, destinationDescription: '' }));
                    }
                  }}
                  helperText={errors.destinationDescription}
                  error={!!errors.destinationDescription}
                  required
                />

                <Box mt={2} width="100%" alignItems="flex-start" justifyContent="flex-start">
                  <Typography variant="subtitle1" align="left">Popular Attractions *</Typography>
                  <Box display="flex" alignItems="center" width="100%">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={currentAttraction}
                      onChange={(e) => setCurrentAttraction(e.target.value)}
                      placeholder="Add attraction"
                    />
                    <IconButton color="primary" onClick={handleAddAttraction} type="button">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" flexWrap="wrap" mt={1} justifyContent="flex-start">
                    {popularAttractions.map((attraction, index) => (
                      <Chip
                        key={index}
                        label={attraction}
                        onDelete={() => handleRemoveAttraction(index)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '4px' }}
                      />
                    ))}
                  </Box>
                  {errors.popularAttractions && (
                    <FormHelperText error>{errors.popularAttractions}</FormHelperText>
                  )}
                </Box>
                
                {/* Best Time to Visit - Icon Selection */}
                <Box mt={3} width="100%">
                  <Typography variant="subtitle1" align="left">Best Time to Visit *</Typography>
                  <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={1}>
                    {timeOptions.map((option) => (
                      <Paper
                        key={option.value}
                        onClick={() => handleTimeSelect(option.value)}
                        elevation={bestTimeToVisit === option.value ? 6 : 1}
                        style={{
                          padding: '10px',
                          margin: '6px',
                          width: '25%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          backgroundColor: bestTimeToVisit === option.value ? option.color + '33' : 'white',
                          border: bestTimeToVisit === option.value ? `2px solid ${option.color}` : '1px solid #e0e0e0',
                          borderRadius: '8px',
                          transition: 'all 0.3s'
                        }}
                      >
                        <Box
                          style={{
                            backgroundColor: option.color,
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            marginBottom: '5px'
                          }}
                        >
                          {React.cloneElement(option.icon, { style: { fontSize: 24 } })}
                        </Box>
                        <Typography variant="caption" align="center" style={{ fontSize: '10px' }}>
                          {option.value}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                  {errors.bestTimeToVisit && (
                    <FormHelperText error>{errors.bestTimeToVisit}</FormHelperText>
                  )}
                </Box>

                {/* Travel Tips */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Travel Tips"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={travelTips}
                  onChange={(e) => {
                    setTravelTips(e.target.value);
                    if (errors.travelTips) {
                      setErrors(prevErrors => ({ ...prevErrors, travelTips: '' }));
                    }
                  }}
                  helperText={errors.travelTips}
                  error={!!errors.travelTips}
                  required
                />
 
                <Box mt={2} width="100%" alignItems="flex-start" justifyContent="flex-start">
                  <Typography variant="subtitle1" align="left">Rating *</Typography>
                  <Box display="flex" alignItems="center" justifyContent="flex-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IconButton 
                        key={star}
                        onClick={() => handleStarRating(star)}
                        style={{ padding: '8px' }}
                        type="button"
                      >
                        {star <= destinationRating ? (
                          <StarIcon style={{ color: '#FFD700', fontSize: '32px' }} />
                        ) : (
                          <StarBorderIcon style={{ fontSize: '32px' }} />
                        )}
                      </IconButton>
                    ))}
                  </Box>
                  {errors.destinationRating && (
                    <FormHelperText error>{errors.destinationRating}</FormHelperText>
                  )}
                </Box>
              </Box>

              {/* Right Side Section */}
              <Box
                style={{
                  flex: 1,
                  padding: '20px',
                  margin: '25px',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                {/* Climate - Icon Selection */}
                <Box mt={2} width="100%">
                  <Typography variant="subtitle1" align="left">Climate *</Typography>
                  <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={1}>
                    {climateOptions.map((option) => (
                      <Paper
                        key={option.value}
                        onClick={() => handleClimateSelect(option.value)}
                        elevation={climate === option.value ? 6 : 1}
                        style={{
                          padding: '10px',
                          margin: '9px',
                          width: '40%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          backgroundColor: climate === option.value ? option.color + '33' : 'white',
                          border: climate === option.value ? `2px solid ${option.color}` : '1px solid #e0e0e0',
                          borderRadius: '8px',
                          transition: 'all 0.3s'
                        }}
                      >
                        <Box
                          style={{
                            backgroundColor: option.color,
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            marginBottom: '5px'
                          }}
                        >
                          {React.cloneElement(option.icon, { style: { fontSize: 24 } })}
                        </Box>
                        <Typography variant="caption" align="center">
                          {option.value}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                  {errors.climate && (
                    <FormHelperText error>{errors.climate}</FormHelperText>
                  )}
                </Box>

                {/* Accommodation Options */}
                <Box mt={3}>
                  <Typography variant="subtitle1">Accommodation Options *</Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={currentAccommodation}
                      onChange={(e) => setCurrentAccommodation(e.target.value)}
                      placeholder="Add accommodation option"
                      size="small"
                      style={{ marginRight: '8px' }}
                    />
                    <IconButton color="primary" onClick={handleAddAccommodation} type="button">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" flexWrap="wrap" mt={1}>
                    {accommodationOptions.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        onDelete={() => handleRemoveAccommodation(index)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '4px' }}
                      />
                    ))}
                  </Box>
                  {errors.accommodationOptions && (
                    <FormHelperText error>{errors.accommodationOptions}</FormHelperText>
                  )}
                </Box>

                {/* Activities */}
                <Box mt={2}>
                  <Typography variant="subtitle1">Activities *</Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={currentActivity}
                      onChange={(e) => setCurrentActivity(e.target.value)}
                      placeholder="Add activity"
                      size="small"
                      style={{ marginRight: '8px' }}
                    />
                    <IconButton color="primary" onClick={handleAddActivity} type="button">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" flexWrap="wrap" mt={1}>
                    {activities.map((activity, index) => (
                      <Chip
                        key={index}
                        label={activity}
                        onDelete={() => handleRemoveActivity(index)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '4px' }}
                      />
                    ))}
                  </Box>
                  {errors.activities && (
                    <FormHelperText error>{errors.activities}</FormHelperText>
                  )}
                </Box>

                {/* Image URL input */}
                <Box mt={2}>
                  <Typography variant="subtitle1">Destination Image URL *</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Image URL"
                    variant="outlined"
                    placeholder="Enter image URL"
                    value={destinationImage}
                    onChange={handleImageUrlChange}
                    error={!!errors.destinationImage}
                    helperText={errors.destinationImage}
                    required
                  />

                  {previewImage && (
                    <Box mt={2} mb={2} style={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2" gutterBottom>Image Preview:</Typography>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          setErrors(prevErrors => ({ ...prevErrors, destinationImage: 'Invalid image URL' }));
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            
            {/* Submit Button - moved inside the form */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 16 }}
              disabled={!isFormValid}
            >
              Add Destination
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDestination;