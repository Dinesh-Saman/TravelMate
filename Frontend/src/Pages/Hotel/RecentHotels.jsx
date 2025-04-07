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
  Container
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Hotel, Star } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(8, 0),
    backgroundColor: theme.palette.background.default,
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
  },
  hotelCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  },
  cardMedia: {
    height: 250,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  starIcon: {
    color: '#FFD700',
    marginRight: '4px',
  },
  reserveButton: {
    marginTop: 'auto',
    width: '100%',
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

const RecentHotels = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchRecentHotels = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hotel/get-hotels');
        // Sort hotels by creation date and take the first 4
        const sortedHotels = response.data.hotels
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setHotels(sortedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchRecentHotels();
  }, []);

  const handleReserveHotel = (hotelId) => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Navigate to hotel reservation page
      navigate(`/reserve-hotel/${hotelId}`);
    } else {
      // Navigate to login page
      navigate('/login', { 
        state: { 
          redirectTo: `/reserve-hotel/${hotelId}` 
        } 
      });
    }
  };

  const handleViewMoreHotels = () => {
    navigate('/hotels');
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
          Reserve Hotels
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="textSecondary" 
          paragraph
          style={{ maxWidth: '800px', margin: '0 auto 40px' }}
        >
          Discover our latest hotel additions and find your perfect stay
        </Typography>
        
        <Grid container spacing={4}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={3} key={hotel._id}>
              <Card className={classes.hotelCard} elevation={3}>
                <CardMedia
                  className={classes.cardMedia}
                  image={hotel.hotel_image.startsWith('http') 
                    ? hotel.hotel_image 
                    : `http://localhost:3001${hotel.hotel_image}`
                  }
                  title={hotel.hotel_name}
                />
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Hotel style={{ marginRight: '8px', color: '#1976d2' }} />
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      {hotel.hotel_name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={classes.starIcon}
                        style={{ 
                          color: i < hotel.star_rating ? '#FFD700' : '#E0E0E0',
                          fontSize: '1.2rem'
                        }} 
                      />
                    ))}
                    <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
                      {hotel.star_rating} Stars
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {hotel.city}, {hotel.address.substring(0, 50)}...
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.reserveButton}
                    onClick={() => handleReserveHotel(hotel._id)}
                  >
                    Reserve Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleViewMoreHotels}
            className={classes.viewMoreButton}
          >
            View More Hotels
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RecentHotels;