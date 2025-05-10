import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Slider,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Collapse,
  Rating
} from '@material-ui/core';
import { 
  Hotel, 
  Star, 
  Search, 
  LocationOn, 
  FilterList,
  Close,
  StarBorder,
  StarHalf
} from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  sidebar: {
    width: 300,
    flexShrink: 0,
    padding: theme.spacing(3),
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      marginTop: theme.spacing(3),
    },
  },
  sectionTitle: {
    position: 'relative',
    marginBottom: theme.spacing(4),
    '&::after': {
      content: '""',
      display: 'block',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      margin: theme.spacing(2, 0, 0),
    }
  },
  hotelCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    }
  },
  cardMedia: {
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
    }
  },
  starIcon: {
    color: '#FFD700',
    marginRight: '4px',
  },
  reserveButton: {
    marginTop: 'auto',
    width: '100%',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  priceChip: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 'bold',
  },
  filterButton: {
    marginBottom: theme.spacing(2),
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    }
  },
  searchField: {
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      borderRadius: 50,
    }
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  sliderContainer: {
    padding: theme.spacing(0, 2),
  },
  amenitiesCheckbox: {
    marginRight: theme.spacing(1),
  },
  hotelName: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  locationText: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  descriptionText: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: theme.spacing(2),
  },
  resultsCount: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  mobileFilterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  ratingFilter: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    flexDirection: 'column',
  },
  ratingCheckbox: {
    marginRight: theme.spacing(1),
  },
  ratingLabel: {
    display: 'flex',
    alignItems: 'center',
  }
}));

const AllHotelsPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  
  // Available options derived from hotels data
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const ratingOptions = [5, 4, 3, 2, 1];

  useEffect(() => {
    const fetchAllHotels = async () => {
      try {
        const response = await axios.get('https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/hotel/get-hotels');
        setHotels(response.data.hotels);
        setFilteredHotels(response.data.hotels);
        
        // Extract unique cities
        const uniqueCities = [...new Set(response.data.hotels.map(hotel => hotel.city))];
        setCities(uniqueCities);
        
        // Extract unique amenities (from all packages' inclusions)
        const allInclusions = response.data.hotels.flatMap(hotel => 
          hotel.hotel_packages.flatMap(pkg => pkg.inclusions)
        );
        const uniqueAmenities = [...new Set(allInclusions)];
        setAmenities(uniqueAmenities);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchAllHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, priceRange, selectedCities, selectedAmenities, selectedRatings, hotels]);

  useEffect(() => {
    if (hotels.length > 0) {
      const [min, max] = getMinMaxPrices();
      setPriceRange([min, max]);
    }
  }, [hotels]);

  const applyFilters = () => {
    let results = [...hotels];

    // Search term filter (name, city, or description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(hotel => 
        hotel.hotel_name.toLowerCase().includes(term) ||
        hotel.city.toLowerCase().includes(term) ||
        hotel.description.toLowerCase().includes(term)
      );
    }

    // City filter
    if (selectedCities.length > 0) {
      results = results.filter(hotel => selectedCities.includes(hotel.city));
    }
    
    // Star rating filter
    if (selectedRatings.length > 0) {
      results = results.filter(hotel => {
        // Round to nearest 0.5 to handle partial star ratings
        const roundedRating = Math.round(hotel.star_rating * 2) / 2;
        // Check if any matching floor rating exists in selected ratings
        const floorRating = Math.floor(roundedRating);
        return selectedRatings.includes(floorRating);
      });
    }

    // Price range filter
    results = results.map(hotel => {
      const filteredPackages = hotel.hotel_packages.filter(pkg => 
        pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
      );
      
      // Also filter packages by amenities if any are selected
      const amenityFilteredPackages = selectedAmenities.length > 0
        ? filteredPackages.filter(pkg => 
            selectedAmenities.every(amenity => pkg.inclusions.includes(amenity))
          )
        : filteredPackages;
    
      return {
        ...hotel,
        hotel_packages: amenityFilteredPackages
      };
    }).filter(hotel => hotel.hotel_packages.length > 0); // Only keep hotels with matching packages

    setFilteredHotels(results);
  };

  const handleReserveHotel = (hotelId) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate(`/reserve-hotel/${hotelId}`);
    } else {
      navigate('/login', { 
        state: { 
          redirectTo: `/reserve-hotel/${hotelId}` 
        } 
      });
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCityToggle = (city) => {
    const currentIndex = selectedCities.indexOf(city);
    const newSelectedCities = [...selectedCities];

    if (currentIndex === -1) {
      newSelectedCities.push(city);
    } else {
      newSelectedCities.splice(currentIndex, 1);
    }

    setSelectedCities(newSelectedCities);
  };

  const handleAmenityToggle = (amenity) => {
    const currentIndex = selectedAmenities.indexOf(amenity);
    const newSelectedAmenities = [...selectedAmenities];

    if (currentIndex === -1) {
      newSelectedAmenities.push(amenity);
    } else {
      newSelectedAmenities.splice(currentIndex, 1);
    }

    setSelectedAmenities(newSelectedAmenities);
  };
  
  const handleRatingToggle = (rating) => {
    const currentIndex = selectedRatings.indexOf(rating);
    const newSelectedRatings = [...selectedRatings];

    if (currentIndex === -1) {
      newSelectedRatings.push(rating);
    } else {
      newSelectedRatings.splice(currentIndex, 1);
    }

    setSelectedRatings(newSelectedRatings);
  };

  const getMinMaxPrices = () => {
    if (hotels.length === 0) return [0, 1000];
    
    const allPrices = hotels.flatMap(hotel => 
      hotel.hotel_packages.map(pkg => pkg.price)
    );
    
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    return [min, max];
  };

  const [minPrice, maxPrice] = getMinMaxPrices();

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([minPrice, maxPrice]);
    setSelectedCities([]);
    setSelectedAmenities([]);
    setSelectedRatings([]);
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className={classes.starIcon} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className={classes.starIcon} />);
      } else {
        stars.push(<StarBorder key={i} className={classes.starIcon} style={{ opacity: 0.3 }} />);
      }
    }

    return stars;
  };

  const customTheme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
  });

  // Render the sidebar content
  const renderSidebar = () => (
    <div className={classes.sidebar}>
      {isMobile && (
        <div className={classes.mobileFilterHeader}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={toggleFilterDrawer}>
            <Close />
          </IconButton>
        </div>
      )}
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      
      <Typography variant="subtitle1" gutterBottom>
        Price Range
      </Typography>
            <div className={classes.sliderContainer}>
            {minPrice !== undefined && maxPrice !== undefined && (
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={minPrice}
                max={maxPrice}
                valueLabelFormat={(value) => `$${value}`}
              />
            )}
              <Box display="flex" justifyContent="space-between">
          <Typography variant="caption">${priceRange[0]}</Typography>
          <Typography variant="caption">${priceRange[1]}</Typography>
        </Box>
      </div>
      
      <Divider style={{ margin: '20px 0' }} />
      
      {/* Star Rating Filter */}
      <Typography variant="subtitle1" gutterBottom>
        Star Rating
      </Typography>
      <div className={classes.ratingFilter}>
        {ratingOptions.map((rating) => (
          <FormControlLabel
            key={rating}
            control={
              <Checkbox
                checked={selectedRatings.indexOf(rating) !== -1}
                onChange={() => handleRatingToggle(rating)}
                color="primary"
                className={classes.ratingCheckbox}
              />
            }
            label={
              <div className={classes.ratingLabel}>
                {rating} {rating === 1 ? 'Star' : 'Stars'}
                <div style={{ marginLeft: '5px', display: 'flex' }}>
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className={classes.starIcon} fontSize="small" />
                  ))}
                </div>
              </div>
            }
          />
        ))}
      </div>
      
      <Divider style={{ margin: '20px 0' }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Cities
      </Typography>
      <Box display="flex" flexDirection="column">
        {cities.map((city) => (
          <FormControlLabel
            key={city}
            control={
              <Checkbox
                checked={selectedCities.indexOf(city) !== -1}
                onChange={() => handleCityToggle(city)}
                color="primary"
              />
            }
            label={city}
          />
        ))}
      </Box>
      
      <Divider style={{ margin: '20px 0' }} />
      
      {amenities.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Amenities
          </Typography>
          <Box display="flex" flexDirection="column">
            {amenities.slice(0, 10).map((amenity) => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox
                    checked={selectedAmenities.indexOf(amenity) !== -1}
                    onChange={() => handleAmenityToggle(amenity)}
                    color="primary"
                    className={classes.amenitiesCheckbox}
                  />
                }
                label={amenity}
              />
            ))}
          </Box>
        </>
      )}
      
      <Button 
        variant="outlined" 
        color="primary" 
        fullWidth 
        onClick={resetFilters}
        style={{ marginTop: '20px' }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <div className={classes.root}>
        <Container maxWidth="xl">
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={isFilterOpen ? <Close /> : <FilterList />}
            onClick={toggleFilterDrawer}
            className={classes.filterButton}
          >
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          
          {isMobile && (
            <Collapse in={isFilterOpen}>
              {renderSidebar()}
            </Collapse>
          )}
          
          <div className={classes.mainContainer}>
            {/* Sidebar for desktop */}
            {!isMobile && renderSidebar()}
            
            {/* Main content */}
            <div className={classes.content}>
              <Typography variant="h4" className={classes.sectionTitle} gutterBottom>
                All Hotels
              </Typography>
              
              <Typography variant="subtitle1" className={classes.resultsCount}>
                {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
              </Typography>
              
              {filteredHotels.length === 0 ? (
                <Paper className={classes.noResults}>
                  <Typography variant="h5" gutterBottom>
                    No hotels match your criteria
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    Try adjusting your filters or search term
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={4}>
                  {filteredHotels.map((hotel) => {
                    const lowestPrice = Math.min(...hotel.hotel_packages.map(pkg => pkg.price));
                    return (
                      <Grid item xs={12} sm={6} md={4} key={hotel._id}>
                        <Card className={classes.hotelCard} elevation={3}>
                          <CardMedia
                            className={classes.cardMedia}
                            image={hotel.hotel_image.startsWith('http') 
                              ? hotel.hotel_image 
                              : `http://localhost:3001${hotel.hotel_image}`
                            }
                            title={hotel.hotel_name}
                          >
                            <Chip 
                              label={`From $${lowestPrice}`} 
                              className={classes.priceChip}
                            />
                          </CardMedia>
                          <CardContent>
                            <Typography variant="h6" className={classes.hotelName}>
                              {hotel.hotel_name}
                            </Typography>
                            
                            <Box className={classes.ratingContainer}>
                              {renderStars(hotel.star_rating)}
                              <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
                                {hotel.star_rating.toFixed(1)} Stars
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" className={classes.locationText}>
                              <LocationOn fontSize="small" style={{ marginRight: '4px' }} />
                              {hotel.city}, {hotel.address.substring(0, 30)}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" className={classes.descriptionText}>
                              {hotel.description}
                            </Typography>
                            
                            <Button 
                              variant="contained" 
                              color="primary" 
                              className={classes.reserveButton}
                              onClick={() => handleReserveHotel(hotel._id)}
                            >
                              View Packages
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </div>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default AllHotelsPage;