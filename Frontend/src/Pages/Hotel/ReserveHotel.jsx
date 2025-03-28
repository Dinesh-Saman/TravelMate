import React, { useState, useEffect } from 'react';
import { 
  Star as StarIcon,
  LocationOn,
  Phone,
  Email,
  Language,
  Event,
  AttachMoney,
  CheckCircle,
  Send,
  Hotel,
  Spa,
  Restaurant,
  KingBed,
  Pool,
  Wifi,
  LocalParking,
  FitnessCenter,
  RoomService,
  ExpandMore
} from '@material-ui/icons';
import { 
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { useParams } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  rating: {
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  },
  amenityChip: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
  },
  cardMedia: {
    objectFit: 'cover',
    height: 600,
    width: 620
  },
  packageTableHead: {
    backgroundColor: theme.palette.primary.light,
    fontWeight: 'bold'
  },
  submitButton: {
    borderRadius: theme.shape.borderRadius * 2
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh'
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const HotelReservationPage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [review, setReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState('panel1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

// Fetch hotel data from API
useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/hotel/hotels/${id}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch hotel data');
        }
        const data = await response.json();
        
        // Directly use the returned hotel data
        setHotel(data.hotel || data); // Depending on whether your API returns { hotel } or just the hotel object
        
        // In a real app, you might fetch reviews separately
        setReviews((data.hotel || data).reviews || []);

      // Get username from localStorage
      const user = localStorage.getItem('username');

      if (user) {
        setReview(prev => ({ ...prev, name: user }));
      }

      } catch (err) {
        setError(err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHotelData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        ...review,
        date: new Date(),
        avatar: review.name.split(' ').map(n => n[0]).join('')
      };
      
      // In a real app, you would POST this to your API
      // const response = await fetch(`http://localhost:3001/hotel/hotels/${id}/reviews`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newReview),
      // });
      // const data = await response.json();
      
      // For now, we'll just update the local state
      setReviews([...reviews, newReview]);
      setReview({ name: '', rating: 5, comment: '' });
    } catch (err) {
      setError('Failed to submit review');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className={classes.loadingContainer}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!hotel) {
    return (
      <Container maxWidth="lg" style={{ padding: '32px 0', textAlign: 'center' }}>
        <Typography variant="h5">Hotel not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ padding: '32px 0' }}>
      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Hotel Header Section */}
      <Card style={{ marginBottom: 32, overflow: 'hidden', height:'100vh' }}>
        <Grid container>
          {/* Hotel Image */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              className={classes.cardMedia}
              image={hotel.hotel_image.startsWith('http') ? hotel.hotel_image : `http://localhost:3001${hotel.hotel_image}`}
              alt={hotel.hotel_name}
            />
          </Grid>

          {/* Hotel Details */}
          <Grid item xs={12} md={6}>
            <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" style={{ fontWeight: 'bold', marginBottom:'20px', textAlign:'justify' }}>
                  {hotel.hotel_name}
                </Typography>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Hotel color="primary" style={{ marginRight: 8 }} />
                  <Rating 
                    value={hotel.star_rating} 
                    precision={0.5} 
                    readOnly 
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" color="textSecondary" paragraph>
                {hotel.description}
              </Typography>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Box style={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#1976d2', marginBottom:'5px' }}>
                        <LocationOn />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={hotel.address} 
                      secondary={hotel.city}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#4caf50', marginBottom:'5px'  }}>
                        <Phone />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={hotel.phone_number} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#f44336', marginBottom:'5px'  }}>
                        <Email />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={hotel.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#2196f3', marginBottom:'5px'  }}>
                        <Language />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <a 
                          href={`https://${hotel.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {hotel.website}
                        </a>
                      } 
                    />
                  </ListItem>
                </List>
              </Box>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Box>
                <Typography variant="h6" gutterBottom>Facilities & Amenities</Typography>
                <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {/* Since amenities aren't in your API response, we'll use some defaults */}
                  <Chip
                    icon={<Wifi />}
                    label="Free WiFi"
                    variant="outlined"
                    className={classes.amenityChip}
                  />
                  <Chip
                    icon={<Pool />}
                    label="Swimming Pool"
                    variant="outlined"
                    className={classes.amenityChip}
                  />
                  <Chip
                    icon={<Restaurant />}
                    label="Restaurant"
                    variant="outlined"
                    className={classes.amenityChip}
                  />
                  <Chip
                    icon={<LocalParking />}
                    label="Free Parking"
                    variant="outlined"
                    className={classes.amenityChip}
                  />
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Packages Section */}
      <Box style={{ marginBottom: 32 }}>
        <Typography variant="h4" component="h2" style={{ marginBottom: 24, fontWeight: 'bold' }}>
          Our Exclusive Packages
        </Typography>
        
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" style={{ fontWeight: 500 }}>View Available Packages</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hotel.hotel_packages && hotel.hotel_packages.length > 0 ? (
              <TableContainer component={Paper}>
                <Table style={{ minWidth: 650 }} aria-label="hotel packages table">
                  <TableHead className={classes.packageTableHead}>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Package</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Inclusions</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Validity</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hotel.hotel_packages.map((pkg, index) => (
                      <TableRow
                        key={index}
                        hover
                        style={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" style={{ fontWeight: 500 }}>
                          {pkg.package_name}
                        </TableCell>
                        <TableCell style={{ color: 'textSecondary' }}>{pkg.package_description}</TableCell>
                        <TableCell align="center">
                          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h4 style={{marginRight:'4px'}}>Rs</h4>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                              {pkg.price.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" style={{ marginLeft: 4 }}>/night</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <List dense>
                            {pkg.inclusions.map((inc, i) => (
                              <ListItem key={i} disableGutters>
                                <ListItemAvatar style={{ minWidth: 32 }}>
                                  <CheckCircle color="primary" fontSize="small" />
                                </ListItemAvatar>
                                <ListItemText primary={inc} />
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                        <TableCell align="center">
                          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Event color="action" style={{ marginRight: 8 }} />
                            <Typography variant="body2">
                              {new Date(pkg.validity_period).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                            className={classes.submitButton}
                          >
                            Book Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No packages available at this time.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Reviews Section */}
      <Box>
        <Typography variant="h4" component="h2" style={{ marginBottom: 24, fontWeight: 'bold' }}>
          Guest Experiences
        </Typography>
        
        {/* Review Form */}
        <Paper elevation={3} style={{ padding: 24, marginBottom: 32 }}>
          <Typography variant="h6" component="h3" gutterBottom style={{ fontWeight: 500 }}>
            Share Your Experience
          </Typography>
          <form onSubmit={handleReviewSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={review.name}
                  onChange={(e) => setReview({...review, name: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Rating
                  name="review-rating"
                  value={review.rating}
                  onChange={(e, newValue) => setReview({...review, rating: newValue})}
                  precision={1}
                  icon={<StarIcon fontSize="large" />}
                  emptyIcon={<StarIcon fontSize="large" />}
                  className={classes.rating}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Review"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={review.comment}
                  onChange={(e) => setReview({...review, comment: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Send />}
                  className={classes.submitButton}
                >
                  Submit Review
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Existing Reviews */}
        <Typography variant="h6" component="h3" gutterBottom style={{ fontWeight: 500 }}>
          What Our Guests Say
        </Typography>
        {reviews.length > 0 ? (
          <List style={{ width: '100%', backgroundColor: 'background.paper' }}>
            {reviews.map((rev, index) => (
              <Paper key={index} elevation={2} style={{ marginBottom: 16, padding: 16 }}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: '#1976d2' }}>
                      {rev.avatar || rev.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography component="span" variant="subtitle1" color="textPrimary">
                            {rev.name}
                          </Typography>
                          <Rating 
                            value={rev.rating} 
                            readOnly 
                            size="small"
                            icon={<StarIcon fontSize="inherit" />}
                            emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                          />
                        </Box>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                          style={{ display: 'block', marginBottom: 8 }}
                        >
                          {rev.comment}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                        >
                          {new Date(rev.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No reviews yet. Be the first to review!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HotelReservationPage;