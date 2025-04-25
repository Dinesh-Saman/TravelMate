import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, 
  Avatar, Chip, IconButton, Collapse, Grid, Card, CardContent, CardHeader, Divider, 
  List, ListItem, ListItemText, Rating, Badge
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import HotelIcon from '@material-ui/icons/Hotel';
import PersonIcon from '@material-ui/icons/Person';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import PaymentIcon from '@material-ui/icons/Payment';
import RoomIcon from '@material-ui/icons/Room';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]}
      labelRowsPerPage=""
    />
  );
};

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: '#3f51b5',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  bookingAvatar: {
    width: 60,
    height: 60,
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
    border: '2px solid white',
  },
  detailsContainer: {
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: theme.spacing(2, 0),
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  bookingInfoFlex: {
    display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: theme.spacing(3),
  },
  bookingAvatarLarge: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(4),
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '3px solid white',
  },
  bookingDetailsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bookingId: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderBooking: {
    backgroundColor: '#3f51b5',
  },
  cardHeaderPayment: {
    backgroundColor: '#43a047',
  },
  cardHeaderUser: {
    backgroundColor: '#7b1fa2',
  },
  cardIcon: {
    marginRight: theme.spacing(1),
    color: 'white',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1.5, 0),
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
  },
  infoLabel: {
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    minWidth: 120,
  },
  infoValue: {
    color: theme.palette.text.primary,
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  editButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2E7D32',
    },
  },
  statusChip: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },
  confirmedStatus: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  cancelledStatus: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  completedStatus: {
    backgroundColor: '#2196f3',
    color: 'white',
  },
  amountText: {
    fontWeight: 'bold',
    color: '#4caf50',
  }
}));

const ViewBookings = () => {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("booking_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/booking');
        
        if (Array.isArray(response.data)) {
          setBookingData(response.data);
        } else if (response.data && Array.isArray(response.data.bookings)) {
          setBookingData(response.data.bookings);
        } else if (response.data && Array.isArray(response.data.data)) {
          setBookingData(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setBookingData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the booking data!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load booking data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setBookingData([]);
      }
    };
  
    fetchBookingData();
  }, []);

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    });
    
    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/booking/${id}`);
        setBookingData(bookingData.filter(booking => booking.booking_id !== id));
        
        Swal.fire({
          title: 'Cancelled!',
          text: 'Booking has been cancelled successfully.',
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

  const handleUpdate = (bookingId) => {
    navigate(`/update-booking/${bookingId}`);
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

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <CheckCircleIcon style={{ color: '#4caf50' }} />;
      case 'cancelled':
        return <CancelIcon style={{ color: '#f44336' }} />;
      case 'completed':
        return <CheckCircleIcon style={{ color: '#2196f3' }} />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed':
        return classes.confirmedStatus;
      case 'cancelled':
        return classes.cancelledStatus;
      case 'completed':
        return classes.completedStatus;
      default:
        return '';
    }
  };

  const filteredBookings = bookingData.filter(booking => {
    if (!searchQuery) return true;
    
    const field = booking[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedBookings = filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              Bookings List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="booking_id">Booking ID</MenuItem>
                  <MenuItem value="user_name">User Name</MenuItem>
                  <MenuItem value="hotel_name">Hotel Name</MenuItem>
                  <MenuItem value="package">Package Name</MenuItem>
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
                  <TableCell className={classes.tableHeadCell}></TableCell>
                  <TableCell className={classes.tableHeadCell}>Booking ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>User</TableCell>
                  <TableCell className={classes.tableHeadCell}>Hotel</TableCell>
                  <TableCell className={classes.tableHeadCell}>Package</TableCell>
                  <TableCell className={classes.tableHeadCell}>Amount</TableCell>
                  <TableCell className={classes.tableHeadCell}>Status</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBookings.map((booking) => (
                  <React.Fragment key={booking._id}>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(booking._id)}
                          style={{ transform: expandedRow === booking._id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <strong>{booking.booking_id}</strong>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PersonIcon style={{ marginRight: 8 }} />
                          {booking.user_name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <HotelIcon style={{ marginRight: 8 }} />
                          {booking.hotel_name}
                        </Box>
                      </TableCell>
                      <TableCell>{booking.package}</TableCell>
                      <TableCell className={classes.amountText}>
                        {formatCurrency(booking.payment?.amount || booking.price * booking.no_of_rooms)}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getStatusIcon(booking.status)}
                          <Chip 
                            label={booking.status} 
                            size="small" 
                            className={`${classes.statusChip} ${getStatusClass(booking.status)}`}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <IconButton
                            className={`${classes.actionButton} ${classes.editButton}`}
                            size="small"
                            onClick={() => handleUpdate(booking._id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            className={`${classes.actionButton} ${classes.deleteButton}`}
                            size="small"
                            onClick={() => handleDelete(booking._id)}
                            disabled={booking.status === 'cancelled'}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={expandedRow === booking._id} timeout="auto" unmountOnExit>
                          <Box className={classes.detailsContainer}>
                            <Box className={classes.bookingInfoFlex}>
                              <Avatar className={classes.bookingAvatarLarge}>
                                <EventIcon fontSize="large" />
                              </Avatar>
                              <Box className={classes.bookingDetailsSection}>
                                <Typography variant="h5" className={classes.bookingId}>
                                  Booking #{booking.booking_id}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {booking.status === 'confirmed' ? 'Upcoming Stay' : 
                                   booking.status === 'completed' ? 'Completed Stay' : 'Cancelled Booking'}
                                </Typography>
                                <Box mt={1} display="flex" alignItems="center">
                                  {getStatusIcon(booking.status)}
                                  <Chip 
                                    label={booking.status.toUpperCase()} 
                                    size="small" 
                                    className={`${classes.statusChip} ${getStatusClass(booking.status)}`}
                                  />
                                </Box>
                              </Box>
                            </Box>
                            
                            <Grid container spacing={3}>
                              {/* Booking Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderBooking}`}
                                    avatar={<EventIcon className={classes.cardIcon} />}
                                    title="Booking Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <HotelIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Hotel:</Typography>
                                      <Typography className={classes.infoValue}>{booking.hotel_name}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <RoomIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Package:</Typography>
                                      <Typography className={classes.infoValue}>{booking.package}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <CalendarTodayIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Check-in:</Typography>
                                      <Typography className={classes.infoValue}>{formatDate(booking.booking_from)}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <CalendarTodayIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Check-out:</Typography>
                                      <Typography className={classes.infoValue}>{formatDate(booking.booking_to)}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <RoomIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Rooms:</Typography>
                                      <Typography className={classes.infoValue}>{booking.no_of_rooms}</Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              {/* Payment Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderPayment}`}
                                    avatar={<PaymentIcon className={classes.cardIcon} />}
                                    title="Payment Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Amount:</Typography>
                                      <Typography className={classes.amountText}>
                                        {formatCurrency(booking.payment?.amount || booking.price * booking.no_of_rooms)}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <CreditCardIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Card Type:</Typography>
                                      <Typography className={classes.infoValue}>{booking.payment?.card_type}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Card Number:</Typography>
                                      <Typography className={classes.infoValue}>
                                        **** **** **** {booking.payment?.card_number?.slice(-4)}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Expiry:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {booking.payment?.card_validity ? 
                                          formatDate(booking.payment.card_validity) : 'N/A'}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              {/* User Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderUser}`}
                                    avatar={<PersonIcon className={classes.cardIcon} />}
                                    title="User Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <PersonIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>User Name:</Typography>
                                      <Typography className={classes.infoValue}>{booking.user_name}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Booking Date:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Last Updated:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {booking.updatedAt ? formatDate(booking.updatedAt) : 'N/A'}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredBookings.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewBookings;