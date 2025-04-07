import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, 
  Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import CancelIcon from '@material-ui/icons/Cancel';
import EventIcon from '@material-ui/icons/Event';
import HotelIcon from '@material-ui/icons/Hotel';
import PersonIcon from '@material-ui/icons/Person';
import RoomIcon from '@material-ui/icons/Room';
import PaymentIcon from '@material-ui/icons/Payment';
import ReceiptIcon from '@material-ui/icons/Receipt';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  pageHeader: {
    marginBottom: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6a1b9a',
    fontFamily: '"Poppins", sans-serif',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: '0 12px'
    },
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    '&:hover': {
      backgroundColor: '#f1f1f1',
      transform: 'translateY(-2px)',
      transition: 'all 0.2s',
    },
    boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  tableHeadRow: {
    backgroundColor: '#6a1b9a',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    padding: '16px 12px',
  },
  tableCell: {
    padding: '16px 12px',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '30px',
  },
  searchField: {
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '20px',
    minWidth: '150px',
  },
  confirmedStatus: {
    backgroundColor: '#66bb6a',
    color: 'white',
  },
  cancelledStatus: {
    backgroundColor: '#ef5350',
    color: 'white',
  },
  completedStatus: {
    backgroundColor: '#42a5f5',
    color: 'white',
  },
  actionButton: {
    margin: theme.spacing(0.5),
    minWidth: '30px',
    padding: '8px 16px',
    borderRadius: '20px',
    textTransform: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  viewDetailsButton: {
    backgroundColor: '#4a148c',
    color: 'white',
    '&:hover': {
      backgroundColor: '#6a1b9a',
    },
  },
  hotelCell: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  dataRow: {
    display: 'flex',
    padding: theme.spacing(1.5),
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
  },
  dataLabel: {
    fontWeight: 'bold',
    minWidth: '150px',
    display: 'flex',
    alignItems: 'center',
  },
  dataValue: {
    flex: 1,
  },
  dataIcon: {
    marginRight: theme.spacing(1),
    color: '#6a1b9a',
  },
  dialogTitle: {
    backgroundColor: '#6a1b9a',
    color: 'white',
  },
  dialogContent: {
    padding: theme.spacing(3),
  },
  cardInfoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  maskedCardNumber: {
    letterSpacing: '1px',
    fontFamily: 'monospace',
  },
  homeButton: {
    backgroundColor: '#6a1b9a',
    color: 'white',
    borderRadius: '20px',
    padding: '8px 16px',
    marginBottom: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#4a148c',
    },
  },
}));

const UserBookingsPage = () => {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("booking_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Assuming we get the username from localStorage or context
  const username = localStorage.getItem('username') || 'testuser'; // Default fallback

  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/booking/user/${username}`);
      
      // Handle different response formats
      let bookings = [];
      if (Array.isArray(response.data.bookings)) {
        bookings = response.data.bookings;
      } else if (Array.isArray(response.data)) {
        bookings = response.data;
      } else {
        console.error("Unexpected API response format:", response.data);
      }

      setBookingData(bookings);
    } catch (error) {
      console.error("There was an error fetching the booking data!", error);
      setBookingData([]);
    }
  };

  const handleCancelBooking = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Cancel Booking?',
      text: "This will cancel your reservation. Are you sure?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });
    
    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/booking/${id}`);
        
        // Update the local state
        setBookingData(bookingData.map(booking => 
          booking.booking_id === id ? { ...booking, status: 'cancelled' } : booking
        ));
        
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your booking has been cancelled successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error cancelling the booking!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error cancelling booking: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
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

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const calculateNights = (from, to) => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return 'XXXX-XXXX-XXXX-XXXX';
    // Keep only first 4 and last 4 digits visible
    return cardNumber.slice(0, 4) + "-XXXX-XXXX-" + cardNumber.slice(-4);
  };

  const filteredBookings = bookingData.filter(booking => {
    if (!searchQuery) return true;
    
    // Handle search for different criteria
    const fieldValue = booking[searchCriteria]?.toString().toLowerCase();
    return fieldValue?.includes(searchQuery.toLowerCase());
  });

  const paginatedBookings = filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return classes.confirmedStatus;
      case 'cancelled': return classes.cancelledStatus;
      case 'completed': return classes.completedStatus;
      default: return '';
    }
  };

  const goToHome = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  return (
    <Box className={classes.pageContainer}>
      <Box className={classes.contentContainer}>
        <Button 
          className={classes.homeButton}
          variant="contained" 
          startIcon={<HomeIcon />}
          onClick={goToHome}
        >
          Back to Home
        </Button>
        
        <Typography variant="h4" className={classes.pageHeader}>
          My Bookings
        </Typography>
        
        <Box className={classes.searchContainer}>
          <Box display="flex" alignItems="center">
            <FormControl className={classes.criteriaSelect}>
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchCriteria}
                onChange={handleCriteriaChange}
                label="Search By"
              >
                <MenuItem value="booking_id">Booking ID</MenuItem>
                <MenuItem value="hotel_name">Hotel Name</MenuItem>
                <MenuItem value="package">Package</MenuItem>
                <MenuItem value="status">Status</MenuItem>
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
                <TableCell className={classes.tableHeadCell}>Booking ID</TableCell>
                <TableCell className={classes.tableHeadCell}>Hotel</TableCell>
                <TableCell className={classes.tableHeadCell}>Package</TableCell>
                <TableCell className={classes.tableHeadCell}>Dates</TableCell>
                <TableCell className={classes.tableHeadCell}>Amount</TableCell>
                <TableCell className={classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableHeadCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <TableRow key={booking._id || booking.booking_id} className={classes.tableRow}>
                    <TableCell className={classes.tableCell}>{booking.booking_id}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <div className={classes.hotelCell}>
                        <HotelIcon className={classes.icon} />
                        {booking.hotel_name}
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>{booking.package}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <Box display="flex" alignItems="center">
                        <EventIcon fontSize="small" className={classes.icon} />
                        {formatDate(booking.booking_from)} - {formatDate(booking.booking_to)}
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          ({calculateNights(booking.booking_from, booking.booking_to)} nights)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      ${booking.payment?.amount || booking.price * booking.no_of_rooms}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Chip 
                        label={booking.status} 
                        className={getStatusClass(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Box display="flex">
                        <Button
                          variant="contained"
                          size="small"
                          className={`${classes.actionButton} ${classes.viewDetailsButton}`}
                          onClick={() => handleViewDetails(booking)}
                        >
                          Details
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="contained"
                            size="small"
                            className={`${classes.actionButton} ${classes.cancelButton}`}
                            onClick={() => handleCancelBooking(booking.booking_id)}
                            startIcon={<CancelIcon />}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="subtitle1" style={{ padding: '20px' }}>
                      No bookings found. Book a hotel to see your reservations here!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredBookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
      
      {/* Booking Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          Booking Details
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {selectedBooking && (
            <Box>
              {/* Booking Information */}
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  <ReceiptIcon className={classes.dataIcon} /> Booking ID:
                </Typography>
                <Typography className={classes.dataValue}>
                  {selectedBooking.booking_id}
                </Typography>
              </Box>
              
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  <PersonIcon className={classes.dataIcon} /> Guest Name:
                </Typography>
                <Typography className={classes.dataValue}>
                  {selectedBooking.user_name}
                </Typography>
              </Box>
              
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  <HotelIcon className={classes.dataIcon} /> Hotel:
                </Typography>
                <Typography className={classes.dataValue}>
                  {selectedBooking.hotel_name}
                </Typography>
              </Box>
              
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  <RoomIcon className={classes.dataIcon} /> Package:
                </Typography>
                <Typography className={classes.dataValue}>
                  {selectedBooking.package} ({selectedBooking.no_of_rooms} {selectedBooking.no_of_rooms > 1 ? 'rooms' : 'room'})
                </Typography>
              </Box>
              
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  <EventIcon className={classes.dataIcon} /> Stay Period:
                </Typography>
                <Typography className={classes.dataValue}>
                  {formatDate(selectedBooking.booking_from)} to {formatDate(selectedBooking.booking_to)}
                  <Typography variant="caption" color="textSecondary" display="block">
                    {calculateNights(selectedBooking.booking_from, selectedBooking.booking_to)} nights
                  </Typography>
                </Typography>
              </Box>
              
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  <PaymentIcon className={classes.dataIcon} /> Payment:
                </Typography>
                <Typography className={classes.dataValue}>
                  ${selectedBooking.payment?.amount || selectedBooking.price * selectedBooking.no_of_rooms}
                </Typography>
              </Box>
              
              <Box className={classes.dataRow}>
                <Typography className={classes.dataLabel}>
                  Status:
                </Typography>
                <Typography className={classes.dataValue}>
                  <Chip 
                    label={selectedBooking.status} 
                    className={getStatusClass(selectedBooking.status)}
                  />
                </Typography>
              </Box>
              
              {/* Payment Information */}
              <Box className={classes.cardInfoBox}>
                <Typography variant="subtitle1" gutterBottom>
                  <PaymentIcon className={classes.dataIcon} /> Payment Method
                </Typography>
                <Box className={classes.dataRow}>
                  <Typography className={classes.dataLabel}>
                    Card Type:
                  </Typography>
                  <Typography className={classes.dataValue}>
                    {selectedBooking.payment?.card_type}
                  </Typography>
                </Box>
                <Box className={classes.dataRow}>
                  <Typography className={classes.dataLabel}>
                    Card Number:
                  </Typography>
                  <Typography className={`${classes.dataValue} ${classes.maskedCardNumber}`}>
                    {maskCardNumber(selectedBooking.payment?.card_number)}
                  </Typography>
                </Box>
                <Box className={classes.dataRow}>
                  <Typography className={classes.dataLabel}>
                    Expiry Date:
                  </Typography>
                  <Typography className={classes.dataValue}>
                    {formatDate(selectedBooking.payment?.card_validity)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedBooking && selectedBooking.status === 'confirmed' && (
            <Button 
              onClick={() => {
                handleCancelBooking(selectedBooking.booking_id);
                handleCloseDialog();
              }}
              color="secondary"
              startIcon={<CancelIcon />}
            >
              Cancel Booking
            </Button>
          )}
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserBookingsPage;