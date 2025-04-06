import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, 
  Avatar, Chip, IconButton, Grid, Button
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EventIcon from '@material-ui/icons/Event';
import HotelIcon from '@material-ui/icons/Hotel';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
    borderRadius: 8,
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: '0 8px'
    },
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  tableHeadRow: {
    backgroundColor: '#d4ac0d',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  pendingStatus: {
    backgroundColor: '#ffb74d',
    color: 'white',
  },
  approvedStatus: {
    backgroundColor: '#66bb6a',
    color: 'white',
  },
  rejectedStatus: {
    backgroundColor: '#ef5350',
    color: 'white',
  },
  actionButton: {
    margin: theme.spacing(0.5),
    minWidth: '30px',
    padding: '5px',
  },
  approveButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  deleteButton: {
    backgroundColor: '#757575',
    color: 'white',
    '&:hover': {
      backgroundColor: '#424242',
    },
  },
  hotelCell: {
    display: 'flex',
    alignItems: 'center',
  },
  hotelIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const ViewReviews = () => {
  const classes = useStyles();
  const [reviewData, setReviewData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("review_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/review/reviews');
        
        // Handle different response formats
        let reviews = [];
        if (Array.isArray(response.data.reviews)) {
          reviews = response.data.reviews;
        } else if (Array.isArray(response.data)) {
          reviews = response.data;
        } else {
          console.error("Unexpected API response format:", response.data);
        }

        // Ensure hotel_id is properly handled whether it's an object or string
        const processedReviews = reviews.map(review => ({
          ...review,
          hotel_id: typeof review.hotel_id === 'object' ? review.hotel_id._id : review.hotel_id,
          hotel_name: typeof review.hotel_id === 'object' ? review.hotel_id.hotel_name : 'Unknown Hotel'
        }));

        setReviewData(processedReviews);
      } catch (error) {
        console.error("There was an error fetching the review data!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load review data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setReviewData([]);
      }
    };
  
    fetchReviewData();
  }, []);

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/review/reviews/${id}`);
        setReviewData(reviewData.filter(review => review._id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Review has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error deleting the review!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting review: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/review/reviews/${id}`, {
        review_status: newStatus
      });

      setReviewData(reviewData.map(review => 
        review._id === id ? { ...review, review_status: newStatus } : review
      ));

      Swal.fire({
        title: 'Success!',
        text: `Review has been ${newStatus}.`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error("There was an error updating the review status!", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error updating review status: ' + (error.response?.data?.message || error.message),
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
    setSearchQuery("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReviews = reviewData.filter(review => {
    if (!searchQuery) return true;
    
    // Handle search for different criteria
    const fieldValue = review[searchCriteria]?.toString().toLowerCase();
    return fieldValue?.includes(searchQuery.toLowerCase());
  });

  const paginatedReviews = filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return classes.pendingStatus;
      case 'approved': return classes.approvedStatus;
      case 'rejected': return classes.rejectedStatus;
      default: return '';
    }
  };

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
            marginBottom={3}
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Reviews Management
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="review_id">Review ID</MenuItem>
                  <MenuItem value="user_name">User Name</MenuItem>
                  <MenuItem value="hotel_id">Hotel ID</MenuItem>
                  <MenuItem value="hotel_name">Hotel Name</MenuItem>
                  <MenuItem value="review_status">Status</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}>Review ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>Hotel</TableCell>
                  <TableCell className={classes.tableHeadCell}>User</TableCell>
                  <TableCell className={classes.tableHeadCell}>Rating</TableCell>
                  <TableCell className={classes.tableHeadCell}>Review</TableCell>
                  <TableCell className={classes.tableHeadCell}>Date</TableCell>
                  <TableCell className={classes.tableHeadCell}>Status</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review._id} className={classes.tableRow}>
                    <TableCell>{review.review_id}</TableCell>
                    <TableCell>
                      <div className={classes.hotelCell}>
                        <HotelIcon className={classes.hotelIcon} />
                        {review.hotel_name || 'Unknown Hotel'}
                      </div>
                    </TableCell>
                    <TableCell>{review.user_name}</TableCell>
                    <TableCell>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        size="small"
                      />
                    </TableCell>
                    <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.review_text}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <EventIcon fontSize="small" style={{ marginRight: '5px' }} />
                        {formatDate(review.review_date || review.createdAt)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={review.review_status} 
                        className={getStatusClass(review.review_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        {review.review_status !== 'approved' && (
                          <Button
                            variant="contained"
                            size="small"
                            className={`${classes.actionButton} ${classes.approveButton}`}
                            onClick={() => handleStatusChange(review._id, 'approved')}
                          >
                            <CheckIcon fontSize="small" />
                          </Button>
                        )}
                        {review.review_status !== 'rejected' && (
                          <Button
                            variant="contained"
                            size="small"
                            className={`${classes.actionButton} ${classes.rejectButton}`}
                            onClick={() => handleStatusChange(review._id, 'rejected')}
                          >
                            <CloseIcon fontSize="small" />
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          size="small"
                          className={`${classes.actionButton} ${classes.deleteButton}`}
                          onClick={() => handleDelete(review._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredReviews.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewReviews;