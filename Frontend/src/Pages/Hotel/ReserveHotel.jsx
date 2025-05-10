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
  ExpandMore,
  Edit,
  Delete
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
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { useParams } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import HotelReviews from '../Review/HotelReviews';
import { useNavigate } from 'react-router-dom';

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
  },
  reviewActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1)
  },
  reviewItem: {
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[3]
    }
  },
  hotelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  contactAvatar: {
    marginBottom: theme.spacing(0.5)
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
    comment: '',
    review_id: null
  });
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState('panel1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const navigate = useNavigate();

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    setSuccessMessage('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotel data
        const hotelResponse = await fetch(`https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/hotel/hotels/${id}`);
        if (!hotelResponse.ok) throw new Error('Failed to fetch hotel data');
        const hotelData = await hotelResponse.json();
        setHotel(hotelData.hotel || hotelData);
        
        // Get current user from localStorage
        const user = localStorage.getItem('username');
        if (user) {
          setCurrentUser(user);
        }
  
      } catch (err) {
        setError(err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare review data
      const reviewData = {
        hotel_id: id,
        user_name: review.name,
        rating: review.rating,
        review_text: review.comment
      };

      let response, endpoint, method;
      
      if (review.review_id) {
        // Update existing review
        endpoint = `https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/reviews/${review.review_id}`;
        method = 'PUT';
      } else {
        // Create new review
        endpoint = `https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/review/reviews`;
        method = 'POST';
      }

      response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      
      const data = await response.json();
      
      // Update local state
      if (review.review_id) {
        setReviews(reviews.map(r => 
          r.review_id === review.review_id ? data.review : r
        ));
        setSuccessMessage('Review updated successfully!');
      } else {
        setReviews([...reviews, data.review]);
        setSuccessMessage('Review submitted successfully!');
      }
      
      // Reset form
      setReview({ 
        name: currentUser || '', 
        rating: 5, 
        comment: '',
        review_id: null
      });
      
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
      setSnackbarOpen(true);
    }
  };

  const handleEditReview = (reviewToEdit) => {
    setReview({
      name: reviewToEdit.user_name,
      rating: reviewToEdit.rating,
      comment: reviewToEdit.review_text,
      review_id: reviewToEdit.review_id
    });
    
    // Scroll to review form
    document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(`https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/reviews/${reviewToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }
      
      setReviews(reviews.filter(r => r.review_id !== reviewToDelete));
      setSuccessMessage('Review deleted successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to delete review');
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
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

  const handleBookNow = (pkg) => {
    navigate('/booking', { 
      state: { 
        packageData: pkg,
        hotelData: hotel
      }
    });
  };

  return (
    <Container maxWidth="lg" style={{ padding: '32px 0' }}>
      {/* Error/Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={error ? 'error' : 'success'}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Review</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteReview} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hotel Header Section */}
      <Card style={{ marginBottom: 32, overflow: 'hidden', height: '100vh' }}>
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
              <Box className={classes.hotelHeader}>
                <Typography variant="h4" component="h1" style={{ fontWeight: 'bold' }}>
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
                      <Avatar style={{ backgroundColor: '#1976d2' }} className={classes.contactAvatar}>
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
                      <Avatar style={{ backgroundColor: '#4caf50' }} className={classes.contactAvatar}>
                        <Phone />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={hotel.phone_number} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#f44336' }} className={classes.contactAvatar}>
                        <Email />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={hotel.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#2196f3' }} className={classes.contactAvatar}>
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
              <TableContainer 
                component={Paper}
                style={{ 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}
              >
                <Table style={{ minWidth: 800 }} aria-label="hotel packages table">
                  <TableHead 
                    className={classes.packageTableHead}
                    style={{ backgroundColor: '#E4D00A'}}
                  >
                    <TableRow>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '15%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a'
                      }}>Package</TableCell>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '25%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a'
                      }}>Description</TableCell>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '8%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a',
                        textAlign: 'center'
                      }}>Rooms</TableCell>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '15%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a',
                        textAlign: 'center'
                      }}>Price</TableCell>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '20%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a'
                      }}>Inclusions</TableCell>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '10%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a',
                        textAlign: 'center'
                      }}>Validity</TableCell>
                      <TableCell style={{ 
                        fontWeight: 'bold', 
                        width: '7%',
                        fontSize: '0.875rem',
                        color: '#3a3a3a',
                        textAlign: 'center'
                      }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hotel.hotel_packages.map((pkg, index) => (
                      <TableRow
                        key={index}
                        hover
                        style={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafc'
                        }}
                      >
                        <TableCell 
                          component="th" 
                          scope="row" 
                          style={{ 
                            fontWeight: 600,
                            color: '#2c3e50',
                            fontSize: '0.875rem'
                          }}
                        >
                          {pkg.package_name}
                        </TableCell>
                        <TableCell style={{ color: '#6b7280' }}>
                          <Typography 
                            style={{ 
                              maxWidth: '300px',
                              fontSize: '0.875rem',
                              lineHeight: '1.4'
                            }}
                          >
                            {pkg.package_description}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body1" 
                            style={{ 
                              fontWeight: 'bold',
                              color: '#3b82f6',
                              fontSize: '1.5rem'
                            }}
                          >
                            {pkg.no_of_rooms}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Box style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <Typography 
                              variant="body1" 
                              style={{ 
                                fontWeight: 'bold',
                                color: '#10b981',
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <span style={{ 
                                fontSize: '0.9rem',
                                marginRight: 4,
                                color: '#6b7280'
                              }}>Rs</span>
                              {pkg.price.toLocaleString()}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              style={{ 
                                color: '#9ca3af',
                                fontSize: '0.7rem'
                              }}
                            >
                              per night
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <List dense disablePadding>
                            {pkg.inclusions.map((inc, i) => (
                              <ListItem 
                                key={i} 
                                disableGutters
                                style={{ padding: '4px 0' }}
                              >
                                <ListItemAvatar style={{ minWidth: 28 }}>
                                  <CheckCircle 
                                    style={{ 
                                      color: '#10b981',
                                      fontSize: '1rem'
                                    }} 
                                  />
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={
                                    <Typography 
                                      style={{ 
                                        fontSize: '0.875rem',
                                        color: '#4b5563'
                                      }}
                                    >
                                      {inc}
                                    </Typography>
                                  } 
                                />
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Box style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <Event 
                              style={{ 
                                color: '#8b5cf6',
                                fontSize: '1.5rem',
                                marginBottom: 4
                              }} 
                            />
                            <Typography 
                              variant="body2"
                              style={{ 
                                fontSize: '1rem',
                                color: '#6b7280'
                              }}
                            >
                              {new Date(pkg.validity_period).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="medium"
                            style={{
                              borderRadius: 8,
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              padding: '6px 12px',
                              boxShadow: 'none',
                              backgroundColor: '#3b82f6',
                              '&:hover': {
                                backgroundColor: '#2563eb'
                              }
                            }}
                            onClick={() => handleBookNow(pkg)}
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
              <Box 
                style={{ 
                  width: '100%',
                  padding: 24,
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: 12
                }}
              >
                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#64748b',
                    fontSize: '0.875rem'
                  }}
                >
                  No packages available at this time.
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      <HotelReviews 
        hotelId={id} 
        initialReviews={reviews}
        currentUser={currentUser}
      />
          </Container>
        );
      };

export default HotelReservationPage;