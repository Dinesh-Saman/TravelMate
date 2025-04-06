import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Link, 
  IconButton, 
  Card, 
  CardContent, 
  Grid,
  Container,
  Avatar,
  TextField
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBackIos, 
  ArrowForwardIos, 
  LocationOn,
  Hotel,
  Restaurant,
  Flight,
  Star,
  Email,
  Phone,
  Place
} from '@material-ui/icons';
import Header from '../../Components/navbar';
import { makeStyles } from '@material-ui/core/styles';
import RecentHotels from '../Hotel/RecentHotels'; 
import RecentPackages from '../Tourpackage/customer/RecentPackages';
import TrendingDestinations from '../Destination/TrendingDestinations';

const useStyles = makeStyles((theme) => ({
  heroSection: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: theme.spacing(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.shape.borderRadius,
  },
  slideIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&.active': {
      backgroundColor: 'white',
    }
  },
  featureCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
    },
    paddingBottom:'20px',
    paddingLeft:'15px',
    paddingRight:'15px'
  },
  testimonialCard: {
    padding: theme.spacing(3),
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  contactForm: {
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  iconLarge: {
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  section: {
    padding: theme.spacing(8, 0),
  },
  sectionTitle: {
    position: 'relative',
    marginBottom: theme.spacing(6),
    '&::after': {
      content: '""',
      display: 'block',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      margin: theme.spacing(2, 'auto', 0),
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero section slides
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Discover Hidden Gems',
      subtitle: 'Find unique destinations off the beaten path'
    },
    {
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Plan Your Perfect Trip',
      subtitle: 'Custom itineraries tailored to your preferences'
    },
    {
      image: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Travel With Confidence',
      subtitle: 'Expert recommendations and verified reviews'
    }
  ];

  // Features data with SVG icons
  const features = [
    {
      image: "https://img.freepik.com/premium-vector/summer-time-travel-concept-man-with-map-hands-tourism-trip-holiday-vacation-hiking_118813-25205.jpg?semt=ais_hybrid&w=740",
      title: "Explore Destinations",
      description: "Discover thousands of destinations with detailed guides and local insights."
    },
    {
      image: "https://img.freepik.com/premium-vector/young-woman-reading-book-studying-home-book-lovers-hobby_273625-1765.jpg?semt=ais_hybrid&w=740",
      title: "Book Accommodations",
      description: "Find and book the perfect hotels, resorts, or homestays for your trip."
    },
    {
      image: "https://img.freepik.com/free-photo/woman-enjoying-coffee-by-window_23-2151963090.jpg?semt=ais_hybrid&w=740",
      title: "Local Cuisine",
      description: "Experience authentic local food with our restaurant recommendations."
    },
    {
      image: "https://img.freepik.com/free-vector/traveling-people-with-luggage-boarding-passes-isometric-composition-with-plane-violet_1284-26826.jpg?semt=ais_hybrid&w=740",
      title: "Flight Deals",
      description: "Get the best flight deals and travel packages for your budget."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "New York, USA",
      rating: 5,
      comment: "TravelMate helped me plan the most amazing European tour. The itinerary suggestions were spot on!"
    },
    {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Toronto, Canada",
      rating: 4,
      comment: "I've never felt more confident traveling alone. The local guides recommended through this platform were excellent."
    },
    {
      name: "Priya Patel",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      location: "Mumbai, India",
      rating: 5,
      comment: "The hotel booking feature saved me so much time and money. Will definitely use this for all my future trips."
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box>
      {/* Hero Section with Slideshow */}
      <Box 
        className={classes.heroSection}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <Container>
          <Box className={classes.heroContent}>
            <Typography 
              variant="h2" 
              gutterBottom 
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 'bold',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            <Typography 
              variant="h5" 
              style={{
                fontFamily: '"Open Sans", sans-serif',
                marginBottom: '40px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {slides[currentSlide].subtitle}
            </Typography>
            
            <Box display="flex" justifyContent="center" gap={2} mt={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/login')}
                style={{
                  padding: '12px 30px',
                  fontWeight: 'bold',
                  borderRadius: '50px',
                  marginRight:'25px'
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                style={{
                  padding: '12px 30px',
                  fontWeight: 'bold',
                  borderRadius: '50px',
                  borderWidth: '2px',
                  color: 'white',
                  borderColor: 'white',
                }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Navigation Arrows */}
        <IconButton 
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ArrowBackIos />
        </IconButton>
        
        <IconButton 
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ArrowForwardIos />
        </IconButton>
        
        {/* Slide Indicators */}
        <Box
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            gap: '10px'
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`${classes.slideIndicator} ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Box className={classes.section} bgcolor="background.default">
        <Container>
          <Typography 
            variant="h3" 
            align="center" 
            className={classes.sectionTitle}
            style={{ fontWeight: 'bold' }}
          >
            Why Choose TravelMate?
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            style={{ maxWidth: '800px', margin: '0 auto 40px' }}
          >
            We provide everything you need to make your travel experience seamless and memorable
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className={classes.featureCard} elevation={3}>
                <img 
        src={feature.image} 
        alt={feature.title}
        style={{ 
          width: '380px', 
          height: '415px', 
          marginBottom: '16px',
          objectFit: 'contain' 
        }} 
      />
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" align="center">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <RecentHotels />
      <TrendingDestinations />
      <RecentPackages />

      {/* About Section */}
      <Box className={classes.section} style={{ backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container>
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={6}>
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Travel Planning" 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                }} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                gutterBottom 
                className={classes.sectionTitle}
                style={{ textAlign: 'left', '&::after': { margin: '16px 0' } }}
              >
                About Our Platform
              </Typography>
              <Typography variant="body1" paragraph style={{ fontSize: '1.1rem' }}>
                TravelMate is a comprehensive travel planning platform designed to make your travel experiences 
                effortless and enjoyable. Our mission is to connect travelers with the best destinations, 
                accommodations, and experiences around the world.
              </Typography>
              <Typography variant="body1" paragraph style={{ fontSize: '1.1rem' }}>
                With our advanced algorithms and local expert insights, we provide personalized recommendations 
                that match your travel style and preferences. Whether you're a solo backpacker or planning a 
                family vacation, we've got you covered.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                style={{ marginTop: '20px' }}
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box className={classes.section}>
        <Container>
          <Typography 
            variant="h3" 
            align="center" 
            className={classes.sectionTitle}
            style={{ fontWeight: 'bold' }}
          >
            What Our Users Say
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            style={{ maxWidth: '800px', margin: '0 auto 40px' }}
          >
            Don't just take our word for it - hear from our community of travelers
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={classes.testimonialCard} elevation={3}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      style={{ width: '60px', height: '60px', marginRight: '16px' }} 
                    />
                    <Box>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" mb={2}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        style={{ 
                          color: i < testimonial.rating ? '#FFD700' : '#E0E0E0',
                          fontSize: '1.2rem'
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box className={classes.section} style={{ backgroundColor: '#1976d2', color: 'white' }}>
        <Container>
          <Grid container spacing={4} justify="center">
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>50K+</Typography>
              <Typography variant="h6">Happy Travelers</Typography>
            </Grid>
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>120+</Typography>
              <Typography variant="h6">Countries</Typography>
            </Grid>
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>10K+</Typography>
              <Typography variant="h6">Hotels</Typography>
            </Grid>
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>24/7</Typography>
              <Typography variant="h6">Support</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box className={classes.section} id="contact">
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            align="center" 
            className={classes.sectionTitle}
            style={{ fontWeight: 'bold' }}
          >
            Contact Us
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            style={{ margin: '0 auto 40px' }}
          >
            Have questions? We'd love to hear from you
          </Typography>
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Card className={classes.contactForm} elevation={3}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        multiline
                        rows={4}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        fullWidth
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={4}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Get in Touch
                </Typography>
                <Typography variant="body1" paragraph>
                  Our team is always ready to help you with any questions about our services or your travel plans.
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={3}>
                <Place style={{ marginRight: '16px', color: '#1976d2', fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Address
                  </Typography>
                  <Typography variant="body1">
                    123 Travel Street, Adventure City, 10001
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={3}>
                <Email style={{ marginRight: '16px', color: '#1976d2', fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Email
                  </Typography>
                  <Typography variant="body1">
                    info@travelmate.com
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center">
                <Phone style={{ marginRight: '16px', color: '#1976d2', fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;