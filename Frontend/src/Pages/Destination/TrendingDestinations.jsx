import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button,
  Grid,
  Container,
  Card,
  CardMedia,
  CircularProgress,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(4, 0),
    backgroundColor: theme.palette.background.default,
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  destinationCard: {
    height: '100%',
    position: 'relative',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    boxShadow: theme.shadows[3],
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[6],
    }
  },
  cardMedia: {
    height: 0,
    paddingTop: '66.25%', // 3:2 aspect ratio
    position: 'relative',
  },
  destinationName: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
    fontSize: '1.5rem',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(5),
  },
  viewMoreButton: {
    marginTop: theme.spacing(3),
    // Base styles
    borderWidth: 2,
    transition: 'all 0.3s ease',
    // Hover styles
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      borderWidth: 2,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
    // Focus styles
    '&:focus': {
      boxShadow: `0 0 0 0.2rem ${theme.palette.primary.light}`,
    },
    // Active styles
    '&:active': {
      transform: 'translateY(0)',
    }
  }
}));

const TrendingDestinations = () => {
  const classes = useStyles();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingDestinations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/destination/get-destinations');
        // Take the first 5 destinations sorted by rating (descending)
        const topDestinations = response.data.destinations
          .sort((a, b) => b.destination_rating - a.destination_rating)
          .slice(0, 5);
        setDestinations(topDestinations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Failed to load destinations. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrendingDestinations();
  }, []);

  if (loading) {
    return (
      <Box className={classes.section}>
        <Container>
          <Typography variant="h4" className={classes.sectionTitle}>
            Trending destinations
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            Most popular choices for travelers from Sri Lanka
          </Typography>
          <Box className={classes.loaderContainer}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  const handleViewMoreDestinations = () => {
    navigate('/view-more-destinations');
  };

  return (
    <Box className={classes.section}>
      <Container>
        <Typography 
          variant="h3" 
          align="center" 
          className={classes.sectionTitle}
          style={{ fontWeight: 'bold' }}
        >
          Trending Destinations
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          color="textSecondary" 
          paragraph
          style={{ maxWidth: '800px', margin: '0 auto 40px' }}
        >
            Most popular choices for travelers from Sri Lanka
        </Typography>

        
        <Grid container spacing={3}>
          {/* First two destinations - larger cards */}
          {destinations.slice(0, 2).map((destination, index) => (
            <Grid item xs={12} sm={6} key={destination.destination_id || `destination-${index}`}>
              <Card className={classes.destinationCard} elevation={0}>
                <Box position="relative">
                  <CardMedia
                    className={classes.cardMedia}
                    image={destination.destination_image}
                    title={destination.destination_name}
                  />
                  <div className={classes.overlay}></div>
                  <Typography variant="h5" className={classes.destinationName}>
                    {destination.destination_name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
          
          {/* Next three destinations - smaller cards */}
          {destinations.slice(2, 5).map((destination, index) => (
            <Grid item xs={12} sm={4} key={destination.destination_id || `destination-${index+2}`}>
              <Card className={classes.destinationCard} elevation={0}>
                <Box position="relative">
                  <CardMedia
                    className={classes.cardMedia}
                    image={destination.destination_image}
                    title={destination.destination_name}
                  />
                  <div className={classes.overlay}></div>
                  <Typography variant="h5" className={classes.destinationName}>
                    {destination.destination_name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
            <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            className={classes.viewMoreButton}
            onClick={handleViewMoreDestinations}
            >
            View More Attractions
            </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TrendingDestinations;