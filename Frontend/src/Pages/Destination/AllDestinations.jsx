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
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Collapse,
  Badge,
  Tooltip
} from '@material-ui/core';
import { 
  Explore, 
  Star, 
  Search, 
  LocationOn, 
  FilterList,
  Close,
  StarBorder,
  StarHalf,
  WbSunny,
  Hotel,
  DirectionsWalk,
  ContactPhone,
  AcUnit
} from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    paddingBottom: theme.spacing(6),
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
    height:'auto',
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
  destinationCard: {
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
  exploreButton: {
    marginTop: 'auto',
    width: '100%',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  ratingChip: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 'bold',
  },
  climateChip: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
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
  categoryCheckbox: {
    marginRight: theme.spacing(1),
  },
  destinationName: {
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
  featureIcons: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    '& > *': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  },
  bestTimeChip: {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    fontWeight: 'medium',
    marginRight: theme.spacing(1),
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  sortContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    }
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

// Star Rating Filter Component
const StarRatingFilter = ({ onChange }) => {
    const [selectedRatings, setSelectedRatings] = useState([]);
    
    const handleRatingToggle = (rating) => {
      const currentIndex = selectedRatings.indexOf(rating);
      const newSelectedRatings = [...selectedRatings];
  
      if (currentIndex === -1) {
        newSelectedRatings.push(rating);
      } else {
        newSelectedRatings.splice(currentIndex, 1);
      }
  
      setSelectedRatings(newSelectedRatings);
      if (onChange) {
        onChange(newSelectedRatings);
      }
    };
  
    const renderStars = (count) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push(
          <Star 
            key={i} 
            style={{ 
              color: '#FFD700',
              fontSize: '1.2rem',
              marginRight: '2px'
            }} 
          />
        );
      }
      return stars;
    };
  
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Star Rating
        </Typography>
        
        <Box display="flex" flexDirection="column" width="100%">
          {[5, 4, 3, 2, 1].map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  checked={selectedRatings.indexOf(rating) !== -1}
                  onChange={() => handleRatingToggle(rating)}
                  color="primary"
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" style={{ marginRight: '8px', minWidth: '45px' }}>
                    {rating} {rating === 1 ? 'Star' : 'Stars'}
                  </Typography>
                  {renderStars(rating)}
                </Box>
              }
              style={{ marginBottom: '8px', width: '100%' }}
            />
          ))}
        </Box>
      </Box>
    );
  };

const ViewAllDestinationsPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedClimates, setSelectedClimates] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);  // New state for filtering by best time to visit
  
  // Available options derived from destinations data
  const [locations, setLocations] = useState([]);
  const [climates, setClimates] = useState([]);
  const [seasons, setSeasons] = useState([]);  // All available seasons for filtering

  // Sorting and pagination
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const climateIcons = {
    'Tropical': <WbSunny style={{ color: '#ffa726' }} />,
    'Temperate': <WbSunny style={{ color: '#66bb6a' }} />,
    'Arid (Desert)': <WbSunny style={{ color: '#ffb300' }} />,
    'Mediterranean': <WbSunny style={{ color: '#26c6da' }} />,
    'Continental': <WbSunny style={{ color: '#78909c' }} />,
    'Polar': <AcUnit style={{ color: '#90caf9' }} />,
    'Mountain': <LocationOn style={{ color: '#a1887f' }} />,
  };

  const seasonIcons = {
    'Spring': <WbSunny style={{ color: '#66bb6a' }} />,
    'Summer': <WbSunny style={{ color: '#f57c00' }} />,
    'Fall': <WbSunny style={{ color: '#8d6e63' }} />,
    'Winter': <AcUnit style={{ color: '#90caf9' }} />,
    'Year-round': <WbSunny style={{ color: '#ffd54f' }} />,
  };

  useEffect(() => {
    const fetchAllDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/destination/get-destinations');
        setDestinations(response.data.destinations);
        setFilteredDestinations(response.data.destinations);
        
        // Extract unique locations
        const uniqueLocations = [...new Set(response.data.destinations.map(dest => dest.location))];
        setLocations(uniqueLocations);
        
        // Extract unique climates
        const uniqueClimates = [...new Set(response.data.destinations.map(dest => dest.climate))];
        setClimates(uniqueClimates);
        
        // Extract unique best times to visit
        const uniqueSeasons = [...new Set(response.data.destinations.map(dest => dest.best_time_to_visit))];
        setSeasons(uniqueSeasons);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchAllDestinations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, ratingRange, selectedLocations, selectedClimates, selectedSeasons, destinations, sortBy, sortOrder]);

  const applyFilters = () => {
    let results = [...destinations];

    // Search term filter (name, location, or description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(dest => 
        dest.destination_name.toLowerCase().includes(term) ||
        (dest.location && dest.location.toLowerCase().includes(term)) ||
        (dest.destination_description && dest.destination_description.toLowerCase().includes(term))
      );
    }

    // Location filter
    if (selectedLocations.length > 0) {
      results = results.filter(dest => selectedLocations.includes(dest.location));
    }

    // Climate filter
    if (selectedClimates.length > 0) {
      results = results.filter(dest => selectedClimates.includes(dest.climate));
    }
    
    // Best time to visit filter
    if (selectedSeasons.length > 0) {
      results = results.filter(dest => selectedSeasons.includes(dest.best_time_to_visit));
    }

    // Rating range filter
    results = results.filter(
      dest => dest.destination_rating >= ratingRange[0] && dest.destination_rating <= ratingRange[1]
    );

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'rating') {
        comparison = a.destination_rating - b.destination_rating;
      } else if (sortBy === 'name') {
        comparison = a.destination_name.localeCompare(b.destination_name);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredDestinations(results);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  const handleExploreDestination = (destinationId) => {
    navigate(`/destination-details/${destinationId}`);
  };

  const handleRatingFilterChange = (selectedRatings) => {
    if (selectedRatings.length === 0) {
      setRatingRange([0, 5]); // Show all if nothing selected
    } else {
      const min = Math.min(...selectedRatings);
      const max = Math.max(...selectedRatings);
      // For min rating, we want destinations with at least that rating
      // For max, we want destinations up to that rating + 0.9 (to include all of that star level)
      setRatingRange([min, max + 0.9]);
    }
  };

  const handleLocationToggle = (location) => {
    const currentIndex = selectedLocations.indexOf(location);
    const newSelectedLocations = [...selectedLocations];

    if (currentIndex === -1) {
      newSelectedLocations.push(location);
    } else {
      newSelectedLocations.splice(currentIndex, 1);
    }

    setSelectedLocations(newSelectedLocations);
  };

  const handleClimateToggle = (climate) => {
    const currentIndex = selectedClimates.indexOf(climate);
    const newSelectedClimates = [...selectedClimates];

    if (currentIndex === -1) {
      newSelectedClimates.push(climate);
    } else {
      newSelectedClimates.splice(currentIndex, 1);
    }

    setSelectedClimates(newSelectedClimates);
  };
  
  const handleSeasonToggle = (season) => {
    const currentIndex = selectedSeasons.indexOf(season);
    const newSelectedSeasons = [...selectedSeasons];

    if (currentIndex === -1) {
      newSelectedSeasons.push(season);
    } else {
      newSelectedSeasons.splice(currentIndex, 1);
    }

    setSelectedSeasons(newSelectedSeasons);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRatingRange([0, 5]);
    setSelectedLocations([]);
    setSelectedClimates([]);
    setSelectedSeasons([]);
    setSortBy('rating');
    setSortOrder('desc');
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  // Function to render star ratings
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
        placeholder="Search destinations..."
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
      
      {/* Star Rating Filter */}
      <StarRatingFilter onChange={handleRatingFilterChange} />
      
      <Divider style={{ margin: '20px 0' }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Locations
      </Typography>
      <Box display="flex" flexDirection="column">
        {locations.map((location) => (
          <FormControlLabel
            key={location}
            control={
              <Checkbox
                checked={selectedLocations.indexOf(location) !== -1}
                onChange={() => handleLocationToggle(location)}
                color="primary"
              />
            }
            label={location}
          />
        ))}
      </Box>
      
      <Divider style={{ margin: '20px 0' }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Climate Types
      </Typography>
      <Box display="flex" flexDirection="column">
        {climates.map((climate) => (
          <FormControlLabel
            key={climate}
            control={
              <Checkbox
                checked={selectedClimates.indexOf(climate) !== -1}
                onChange={() => handleClimateToggle(climate)}
                color="primary"
                className={classes.categoryCheckbox}
              />
            }
            label={(
              <Box display="flex" alignItems="center">
                {climateIcons[climate]}
                <Typography variant="body2" style={{ marginLeft: '8px' }}>{climate}</Typography>
              </Box>
            )}
          />
        ))}
      </Box>
      
      <Divider style={{ margin: '20px 0' }} />
      
      {/* Best Time to Visit Filter */}
      <Typography variant="subtitle1" gutterBottom>
        Best Time to Visit
      </Typography>
      <Box display="flex" flexDirection="column">
        {seasons.map((season) => (
          <FormControlLabel
            key={season}
            control={
              <Checkbox
                checked={selectedSeasons.indexOf(season) !== -1}
                onChange={() => handleSeasonToggle(season)}
                color="primary"
                className={classes.categoryCheckbox}
              />
            }
            label={(
              <Box display="flex" alignItems="center">
                {seasonIcons[season] || <WbSunny style={{ color: '#ffd54f' }} />}
                <Typography variant="body2" style={{ marginLeft: '8px' }}>{season}</Typography>
              </Box>
            )}
          />
        ))}
      </Box>
      
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
              <Typography variant="h4" className={classes.sectionTitle}>
                Discover Amazing Destinations
              </Typography>
              
              <Box className={classes.sortContainer}>
                <Typography variant="body2" style={{ marginRight: '12px' }}>
                  Sort by:
                </Typography>
                <TextField
                  select
                  variant="outlined"
                  size="small"
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{ width: '150px', marginRight: '12px' }}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </TextField>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={toggleSortOrder}
                >
                  {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                </Button>
              </Box>
              
              <Typography variant="subtitle1" className={classes.resultsCount}>
                {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
              </Typography>
              
              {filteredDestinations.length === 0 ? (
                <Paper className={classes.noResults}>
                  <Typography variant="h5" gutterBottom>
                    No destinations match your criteria
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
                <>
                  <Grid container spacing={4}>
                    {currentItems.map((destination) => (
                      <Grid item xs={12} sm={6} md={4} key={destination._id || destination.destination_id}>
                        <Card className={classes.destinationCard} elevation={3}>
                          <CardMedia
                            className={classes.cardMedia}
                            image={destination.destination_image}
                            title={destination.destination_name}
                          >
                            <div className={classes.overlay}></div>
                            <Chip 
                              label={`${destination.destination_rating.toFixed(1)} ★`} 
                              className={classes.ratingChip}
                            />
                            <Chip 
                              icon={climateIcons[destination.climate]}
                              label={destination.climate}
                              className={classes.climateChip}
                              size="small"
                            />
                          </CardMedia>
                          <CardContent>
                            <Typography variant="h6" className={classes.destinationName}>
                              {destination.destination_name}
                            </Typography>
                            
                            {/* Star Rating Display */}
                            <Box className={classes.ratingContainer}>
                              {renderStars(destination.destination_rating)}
                              <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
                                {destination.destination_rating.toFixed(1)} 
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" className={classes.locationText}>
                              <LocationOn fontSize="small" style={{ marginRight: '4px' }} />
                              {destination.location}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" className={classes.descriptionText}>
                              {destination.destination_description}
                            </Typography>
                            
                            <Box className={classes.featureIcons}>
                              {/* Best Time To Visit */}
                              <Tooltip title="Best time to visit">
                                <IconButton size="small">
                                  <Badge color="primary">
                                    <Typography variant="caption">{destination.best_time_to_visit}</Typography>
                                  </Badge>
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Contact">
                                <IconButton size="small">
                                  <ContactPhone color="primary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Accommodations">
                                <IconButton size="small">
                                  <Hotel color="primary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Activities">
                                <IconButton size="small">
                                  <DirectionsWalk color="primary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            <Button 
                              variant="contained" 
                              color="primary" 
                              className={classes.exploreButton}
                              onClick={() => handleExploreDestination(destination._id || destination.destination_id)}
                              startIcon={<Explore />}
                            >
                              Explore Details
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box className={classes.paginationContainer}>
                      <Button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(null, currentPage - 1)}
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'contained' : 'text'}
                          color={currentPage === page ? 'primary' : 'default'}
                          onClick={() => handlePageChange(null, page)}
                          style={{ margin: '0 4px' }}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button 
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(null, currentPage + 1)}
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default ViewAllDestinationsPage;