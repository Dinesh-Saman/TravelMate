import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, CardHeader, 
  Divider, List, ListItem, ListItemText, ListItemIcon, Tabs, Tab,
  Avatar, Chip, CircularProgress, Alert, Button, Hidden, Fade, Slide, 
} from '@material-ui/core';
import { 
  Star as StarIcon, 
  LocationOn as LocationIcon, 
  CalendarToday as CalendarIcon,
  BeachAccess as BeachIcon,
  Hotel as HotelIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Directions as DirectionsIcon,
  LocalActivity as ActivityIcon,
  WbSunny as ClimateIcon,
  Public as PublicIcon,
  Restaurant as RestaurantIcon,
  PhotoCamera as PhotoIcon,
  LocalOffer as OfferIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Swal from 'sweetalert2';
import { Parallax } from 'react-parallax';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heroContainer: {
    position: 'relative',
    height: '75vh',
    minHeight: '500px',
    [theme.breakpoints.down('sm')]: {
      height: '60vh',
      minHeight: '400px',
    },
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.7)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    color: 'white',
    padding: theme.spacing(6),
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    fontWeight: 400,
    textShadow: '0 1px 5px rgba(0,0,0,0.5)',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
  },
  contentContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  tabContainer: {
    marginBottom: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    textTransform: 'none',
    minWidth: '120px',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '1rem',
    padding: theme.spacing(1, 3),
  },
  infoCard: {
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
    },
  },
  infoCardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(3),
  },
  infoCardContent: {
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },
  infoCardIcon: {
    width: 60,
    height: 60,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  mainContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    overflow: 'hidden',
  },
  attractionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      transform: 'translateX(5px)',
    },
  },
  attractionNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    marginRight: theme.spacing(3),
    flexShrink: 0,
    fontWeight: 'bold',
    boxShadow: theme.shadows[1],
  },
  activityCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: 'white',
    borderRadius: '12px',
    height: '100%',
    border: `1px solid ${theme.palette.grey[200]}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
  },
  activityIcon: {
    width: 50,
    height: 50,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  tipsContainer: {
    backgroundColor: theme.palette.warning.light,
    borderLeft: `5px solid ${theme.palette.warning.main}`,
    borderRadius: '12px',
    padding: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: theme.spacing(4),
  },
  errorCard: {
    padding: theme.spacing(6),
    textAlign: 'center',
    borderRadius: '16px',
    boxShadow: theme.shadows[4],
    maxWidth: '500px',
  },
  descriptionText: {
    whiteSpace: 'pre-line',
    fontSize: '1.1rem',
    lineHeight: 1.8,
    color: theme.palette.text.secondary,
  },
  sectionTitle: {
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -3,
      left: 0,
      width: '100px',
      height: '3px',
      backgroundColor: theme.palette.secondary.main,
    },
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  galleryItem: {
    borderRadius: '12px',
    overflow: 'hidden',
    height: '200px',
    position: 'relative',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    '&:hover img': {
      transform: 'scale(1.1)',
    },
  },
  floatingActionButton: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    zIndex: 1000,
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    boxShadow: theme.shadows[6],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  ratingBadge: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 2,
  },
  tagChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor:'#ADD8E6',
    color: theme.palette.secondary.dark,
    fontWeight: 'bold',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`destination-tabpanel-${index}`}
      aria-labelledby={`destination-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `destination-tab-${index}`,
    'aria-controls': `destination-tabpanel-${index}`,
  };
}

const DestinationDetails = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/destination/destinations/${id}`);
        setDestination(response.data.destination);
        setLoading(false);
      } catch (err) {
        setError('Failed to load destination details. Please try again later.');
        setLoading(false);
        console.error('Error fetching destination:', err);
      }
    };

    fetchDestination();

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <Fade in={true} timeout={500}>
          <Box textAlign="center">
            <CircularProgress size={80} thickness={4} />
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Loading destination details...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.errorContainer}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Card className={classes.errorCard}>
            <Typography variant="h4" color="error" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" gutterBottom style={{ marginBottom: '30px' }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => window.location.reload()}
              endIcon={<PublicIcon />}
            >
              Try Again
            </Button>
          </Card>
        </Slide>
      </Box>
    );
  }

  if (!destination) {
    return null;
  }

  // Sample gallery images (in a real app, these would come from your API)
  const galleryImages = [
    'https://source.unsplash.com/random/800x600/?destination,travel',
    'https://source.unsplash.com/random/800x600/?vacation,beach',
    'https://source.unsplash.com/random/800x600/?hotel,resort',
    'https://source.unsplash.com/random/800x600/?landscape,view',
    'https://source.unsplash.com/random/800x600/?adventure,tour',
  ];

  return (
    <Box className={classes.root}>
      {/* Hero Section with Parallax Effect */}
      <Box className={classes.heroContainer}>
        <Parallax 
          bgImage={destination.destination_image} 
          strength={300}
          style={{ height: '100%' }}
        >
          <Box className={classes.heroContent}>
            <Box className={classes.ratingBadge}>
              <StarIcon style={{ color: '#FFD700', marginRight: '5px' }} />
              <Typography variant="subtitle1">
                {destination.destination_rating}/5
              </Typography>
            </Box>
            
            <Typography variant="h1" className={classes.heroTitle}>
              {destination.destination_name}
            </Typography>
            <Typography variant="h4" className={classes.heroSubtitle}>
              <LocationIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              {destination.location}
            </Typography>
            
            <Box mt={2}>
              {['Beach', 'Luxury', 'Family', 'Adventure'].map((tag, index) => (
                <Chip 
                  key={index}
                  label={tag}
                  className={classes.tagChip}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Parallax>
      </Box>

      {/* Main Content */}
      <Box className={classes.contentContainer}>
        {/* Quick Info Cards */}
        <Grid container spacing={4} style={{ marginBottom: '40px' }}>
          <Grid item xs={12} md={4}>
            <Slide in={!loading} direction="up" timeout={500}>
              <Card className={classes.infoCard}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.infoCardIcon}>
                      <CalendarIcon fontSize="large" />
                    </Avatar>
                  }
                  title="Best Time to Visit"
                  titleTypographyProps={{ variant: 'h6' }}
                  className={classes.infoCardHeader}
                />
                <CardContent className={classes.infoCardContent}>
                  <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                    {destination.best_time_to_visit}
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Slide in={!loading} direction="up" timeout={700}>
              <Card className={classes.infoCard}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.infoCardIcon}>
                      <ClimateIcon fontSize="large" />
                    </Avatar>
                  }
                  title="Climate"
                  titleTypographyProps={{ variant: 'h6' }}
                  className={classes.infoCardHeader}
                />
                <CardContent className={classes.infoCardContent}>
                  <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                    {destination.climate}
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Slide in={!loading} direction="up" timeout={900}>
              <Card className={classes.infoCard}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.infoCardIcon}>
                      <PhoneIcon fontSize="large" />
                    </Avatar>
                  }
                  title="Contact"
                  titleTypographyProps={{ variant: 'h6' }}
                  className={classes.infoCardHeader}
                />
                <CardContent className={classes.infoCardContent}>
                  <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                    {destination.destination_contact}
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box className={classes.tabContainer}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Destination details tabs"
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              label="Overview" 
              icon={<InfoIcon style={{ marginBottom: '0' }} />}
              {...a11yProps(0)} 
              className={classes.tab} 
            />
            <Tab 
              label="Attractions" 
              icon={<DirectionsIcon style={{ marginBottom: '0' }} />}
              {...a11yProps(1)} 
              className={classes.tab} 
            />
            <Tab 
              label="Stay" 
              icon={<HotelIcon style={{ marginBottom: '0' }} />}
              {...a11yProps(2)} 
              className={classes.tab} 
            />
            <Tab 
              label="Activities" 
              icon={<ActivityIcon style={{ marginBottom: '0' }} />}
              {...a11yProps(3)} 
              className={classes.tab} 
            />
            <Tab 
              label="Tips" 
              icon={<OfferIcon style={{ marginBottom: '0' }} />}
              {...a11yProps(5)} 
              className={classes.tab} 
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Paper className={classes.mainContent}>
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h3" className={classes.sectionTitle}>
              About {destination.destination_name}
            </Typography>
            <Typography variant="body1" className={classes.descriptionText}>
              {destination.destination_description}
            </Typography>
            
            <Grid container spacing={4} style={{ marginTop: '30px' }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  <RestaurantIcon color="primary" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                  Local Cuisine
                </Typography>
                <Typography variant="body1" className={classes.descriptionText}>
                  Enjoy the authentic flavors of the region with dishes like Seafood Paella, 
                  Traditional Tapas, and the famous Crema Catalana for dessert. The local 
                  cuisine blends Mediterranean ingredients with unique regional spices.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  <PublicIcon color="primary" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                  Culture & Heritage
                </Typography>
                <Typography variant="body1" className={classes.descriptionText}>
                  This destination boasts a rich history dating back to Roman times, 
                  with well-preserved architecture, vibrant festivals throughout the year, 
                  and a thriving arts scene. Don't miss the weekly artisan markets and 
                  traditional folk performances.
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h3" className={classes.sectionTitle}>
              Must-See Attractions
            </Typography>
            <List>
              {destination.popular_attractions.map((attraction, index) => (
                <ListItem key={index} className={classes.attractionItem}>
                  <Box className={classes.attractionNumber}>
                    {index + 1}
                  </Box>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {attraction}
                      </Typography>
                    } 
                    secondary={
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h3" className={classes.sectionTitle}>
              Where to Stay
            </Typography>
            <Grid container spacing={3}>
              {destination.accommodation_options.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <Card className={classes.activityCard}>
                    <Box display="flex" alignItems="center">
                      <HotelIcon color="primary" style={{ fontSize: '2rem', marginRight: '16px' }} />
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                        {option}
                      </Typography>
                    </Box>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      {`Experience luxury and comfort at ${option}, featuring world-class amenities, 
                      breathtaking views, and exceptional service. Perfect for ${index % 2 === 0 ? 'families' : 'couples'}.`}
                    </Typography>
                    <Box mt={2}>
                      <Chip label="Free WiFi" size="small" style={{ marginRight: '8px' }} />
                      <Chip label="Pool" size="small" style={{ marginRight: '8px' }} />
                      <Chip label="Spa" size="small" style={{ marginRight: '8px' }} />
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography variant="h3" className={classes.sectionTitle}>
              Exciting Activities
            </Typography>
            <Grid container spacing={3}>
              {destination.activities.map((activity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className={classes.activityCard}>
                    <Box className={classes.activityIcon}>
                      {index % 3 === 0 ? <BeachIcon fontSize="large" /> : 
                       index % 3 === 1 ? <DirectionsIcon fontSize="large" /> : 
                       <ActivityIcon fontSize="large" />}
                    </Box>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      {activity}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                      {`Enjoy this ${activity.toLowerCase()} activity with our professional guides. Suitable for ${index % 2 === 0 ? 'all ages' : 'adults'}.`}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Typography variant="h3" className={classes.sectionTitle}>
              Traveler's Tips
            </Typography>
            <Box className={classes.tipsContainer}>
              <Box display="flex">
                <Box flexShrink={0}>
                  <InfoIcon style={{ fontSize: '2.5rem', color: theme.palette.warning.dark }} />
                </Box>
                <Box ml={3}>
                  <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                    Smart Travel Advice
                  </Typography>
                  <Typography variant="body1" className={classes.descriptionText}>
                    {destination.travel_tips || "No specific tips available for this destination."}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Grid container spacing={3} style={{ marginTop: '30px' }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Best Deals
                </Typography>
                <Typography variant="body1" className={classes.descriptionText}>
                  • Book flights and hotels together for up to 30% savings
                  <br />
                  • Travel during shoulder season (April-May or September-October) for lower prices
                  <br />
                  • Check for student, senior, or family discounts
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Local Customs
                </Typography>
                <Typography variant="body1" className={classes.descriptionText}>
                  • Dress modestly when visiting religious sites
                  <br />
                  • Learn a few basic phrases in the local language
                  <br />
                  • Tipping is appreciated but not always expected
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Box>

      {/* Floating Action Button */}
      {isScrolled && (
        <Fade in={isScrolled}>
          <Box 
            className={classes.floatingActionButton} 
            bgcolor="primary.main"
            color="white"
            onClick={scrollToTop}
          >
            <ArrowUpwardIcon fontSize="large" />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default DestinationDetails;