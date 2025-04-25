import React, { useState, useEffect } from 'react';
import { 
  Star as StarIcon,
  Edit,
  Delete,
  Send,
  CheckCircle,
  Favorite,
  Person,
  RateReview,
  ThumbUp,
  EmojiEmotions,
  Event
} from '@material-ui/icons';
import { 
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grow,
  Zoom,
  Slide,
  Chip,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    borderRadius: theme.shape.borderRadius * 3,
    padding: theme.spacing(4),
    boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  reviewForm: {
    background: 'white',
    borderRadius: theme.shape.borderRadius * 3,
    padding: theme.spacing(4),
    boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
    marginBottom: theme.spacing(4),
    transition: 'all 0.4s ease',
    '&:hover': {
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  rating: {
    '& .MuiRating-iconFilled': {
      color: '#FFD700',
    },
    '& .MuiRating-iconHover': {
      color: '#FFC107',
    },
  },
  submitButton: {
    borderRadius: 50,
    padding: theme.spacing(1.5, 4),
    background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    fontWeight: 600,
    letterSpacing: 0.5,
    boxShadow: '0 4px 15px rgba(106, 17, 203, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(106, 17, 203, 0.4)',
    },
  },
  cancelButton: {
    borderRadius: 50,
    padding: theme.spacing(1.5, 4),
    marginLeft: theme.spacing(2),
  },
  reviewItem: {
    background: 'white',
    borderRadius: theme.shape.borderRadius * 3,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
    },
  },
  avatar: {
    width: 56,
    height: 56,
    background: 'linear-gradient(45deg, #2196F3 0%, #21CBF3 100%)',
    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
  },
  reviewText: {
    position: 'relative',
    '&:before': {
      content: '"""',
      fontSize: 50,
      color: 'rgba(33, 150, 243, 0.1)',
      position: 'absolute',
      left: -20,
      top: -20,
      fontFamily: 'serif',
      lineHeight: 1,
    },
    '&:after': {
      content: '"""',
      fontSize: 50,
      color: 'rgba(18, 88, 145, 0.1)',
      position: 'absolute',
      right: -10,
      bottom: -30,
      fontFamily: 'serif',
      lineHeight: 1,
    },
  },
  sectionTitle: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: theme.spacing(4),
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: '50%',
      height: 4,
      background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
      borderRadius: 2,
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    '& svg': {
      fontSize: 60,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2),
    },
  },
  actionButton: {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  editButton: {
    color: '#4CAF50',
  },
  deleteButton: {
    color: '#F44336',
  },
  dateChip: {
    borderRadius: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    padding: theme.spacing(0.5, 2),
    marginTop: theme.spacing(1),
  },
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  actionButtons: {
    display: 'flex',
    marginLeft: theme.spacing(2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const HotelReviews = ({ hotelId, initialReviews = [], currentUser }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [review, setReview] = useState({
    name: currentUser || '',
    rating: 5,
    comment: '',
    review_id: null,
    _id: null
  });
  
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);

  const ratingLabels = {
    1: 'Terrible',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSuccessMessage('');
    setError(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const reviewData = {
        hotel_id: hotelId,
        user_name: review.name,
        rating: review.rating,
        review_text: review.comment
      };

      let response, endpoint, method;
      
      // Check if we're updating an existing review
      if (review._id) {
        // Fixed: Use the correct endpoint for updating user reviews
        endpoint = `http://localhost:3001/review/user-review/${review._id}`;
        method = 'PUT';
      } else {
        endpoint = `http://localhost:3001/review/reviews`;
        method = 'POST';
      }

      response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      
      const data = await response.json();
      
      if (review._id) {
        // Update the review in the local state
        setReviews(reviews.map(r => r._id === review._id ? data.review : r));
        setSuccessMessage('Your review was updated successfully! ✨');
      } else {
        // Add new review to the local state
        setReviews([...reviews, data.review]);
        setSuccessMessage('Thank you for your review! 🌟');
      }
      
      // Reset form
      setReview({ name: currentUser || '', rating: 5, comment: '', review_id: null, _id: null });
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (reviewToEdit) => {
    // Store both review_id and _id for proper identification
    setReview({
      name: reviewToEdit.user_name,
      rating: reviewToEdit.rating,
      comment: reviewToEdit.review_text,
      review_id: reviewToEdit.review_id,
      _id: reviewToEdit._id
    });
    
    document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' });
  };

  // FIX: Updated to pass the entire review object instead of just the ID
  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  // FIX: Updated to use _id for deletion
  const handleDeleteReview = async () => {
    try {
      setLoading(true);
      // Use the MongoDB _id for deletion
      const response = await fetch(`http://localhost:3001/review/reviews/${reviewToDelete._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }
      
      // Remove the deleted review from state using _id for accurate filtering
      setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
      setSuccessMessage('Review deleted successfully');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to delete review');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  useEffect(() => {
    if (initialReviews.length === 0 && hotelId) {
        const fetchReviews = async () => {
            try {
              setLoading(true);
              const response = await fetch(`http://localhost:3001/review/hotels/${hotelId}/reviews?status=approved`);
              if (!response.ok) throw new Error('Failed to fetch reviews');
              const data = await response.json();
              setReviews(data.reviews || data);
            } catch (err) {
              setError(err.message);
              setSnackbarOpen(true);
            } finally {
              setLoading(false);
            }
          };
      fetchReviews();
    }
  }, [hotelId, initialReviews]);

  return (
    <Box className={classes.root} id="reviews-section">
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={error ? 'error' : 'success'}
          icon={error ? null : <ThumbUp fontSize="inherit" />}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        TransitionComponent={Slide}
        PaperProps={{
          style: {
            borderRadius: 20,
            padding: theme.spacing(2),
          }
        }}
      >
        <DialogTitle style={{ textAlign: 'center' }}>
          <Delete color="error" style={{ fontSize: 60 }} />
          <Typography variant="h6">Delete Review?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: theme.spacing(3) }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined" 
            style={{ borderRadius: 50, padding: '8px 24px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteReview} 
            color="secondary" 
            variant="contained"
            style={{ borderRadius: 50, padding: '8px 24px' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Form */}
      <div
        style={{
          opacity: 0,
          animation: 'fadeIn 0.5s forwards',
          animationDelay: '0.1s'
        }}
      >
        <Paper className={classes.reviewForm} id="review-form">
          <Typography variant="h5" className={classes.sectionTitle} gutterBottom>
            {review._id ? 'Edit Your Review' : 'Share Your Experience'}
          </Typography>
          
          <form onSubmit={handleReviewSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={review.name}
                  onChange={(e) => setReview({...review, name: e.target.value})}
                  required
                  disabled={!!currentUser}
                  InputProps={{
                    startAdornment: <Person color="action" style={{ marginRight: 8 }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <Rating
                    name="review-rating"
                    value={review.rating}
                    onChange={(e, newValue) => setReview({...review, rating: newValue})}
                    onChangeActive={(e, newHover) => setHoverRating(newHover)}
                    precision={1}
                    size="large"
                    icon={<StarIcon fontSize="inherit" style={{ color: '#FFD700' }} />}
                    emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                    className={classes.rating}
                  />
                  {review.rating !== null && (
                    <Box ml={2} color="text.secondary">
                      {ratingLabels[hoverRating || review.rating]}
                    </Box>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Share your thoughts..."
                  variant="outlined"
                  multiline
                  rows={4}
                  value={review.comment}
                  onChange={(e) => setReview({...review, comment: e.target.value})}
                  required
                  InputProps={{
                    startAdornment: <RateReview color="action" style={{ marginRight: 8 }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.submitButton}
                    disabled={loading}
                    startIcon={loading ? null : <Send />}
                    style={{
                      transform: 'translateY(0)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : review._id ? 'Update Review' : 'Submit Review'}
                  </Button>
                  
                  {review._id && (
                    <Button
                      variant="text"
                      className={classes.cancelButton}
                      onClick={() => setReview({ 
                        name: currentUser || '', 
                        rating: 5, 
                        comment: '',
                        review_id: null,
                        _id: null
                      })}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>

      {/* Reviews List */}
      <Typography variant="h5" className={classes.sectionTitle} gutterBottom>
        Guest Reviews
      </Typography>
      
      {reviews.length > 0 ? (
        <List style={{ width: '100%' }}>
          {reviews.map((rev, index) => (
            <Grow in={true} key={rev._id || rev.review_id} timeout={index * 200}>
              <Paper className={classes.reviewItem}>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      {rev.user_name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
                        <Typography variant="subtitle1" style={{ fontWeight: 600, marginLeft:'35px' }}>
                          {rev.user_name}
                        </Typography>
                        <Rating 
                          value={rev.rating} 
                          readOnly 
                          size={isMobile ? 'small' : 'medium'}
                          icon={<StarIcon fontSize="inherit" style={{ color: '#FFD700' }} />}
                          emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                          style={{marginRight:'35px'}}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="div"
                          variant="body1"
                          color="textPrimary"
                          className={classes.reviewText}
                          style={{ margin: theme.spacing(2, 0) , marginLeft:'35px', marginRight:'35px'}}
                        >
                          {rev.review_text}
                        </Typography>
                        
                        {/* Modified section: Date and action buttons in one row */}
                        <Box className={classes.metaContainer}>
                          <Chip
                            icon={<Event fontSize="small" />}
                            label={new Date(rev.review_date || rev.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                            className={classes.dateChip}
                            style={{marginLeft:'30px'}}
                          />
                          
                          {currentUser && currentUser === rev.user_name && (
                            <Box className={classes.actionButtons}>
                              <IconButton 
                                aria-label="edit" 
                                onClick={() => handleEditReview(rev)}
                                className={`${classes.actionButton} ${classes.editButton}`}
                                size="medium"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton 
                                aria-label="delete" 
                                onClick={() => handleDeleteClick(rev)}
                                className={`${classes.actionButton} ${classes.deleteButton}`}
                                size="medium"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Paper>
            </Grow>
          ))}
        </List>
      ) : (
        <div
          style={{
            opacity: 0,
            animation: 'fadeIn 0.5s forwards',
            animationDelay: '0.2s'
          }}
        >
          <Box className={classes.emptyState}>
            <EmojiEmotions fontSize="inherit" />
            <Typography variant="h6" gutterBottom>
              No reviews yet
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Be the first to share your experience!
            </Typography>
          </Box>
        </div>
      )}
    </Box>
  );
};

export default HotelReviews;