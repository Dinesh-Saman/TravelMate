import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, Avatar } from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/navbar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]} // Hide rows per page selector
      labelRowsPerPage="" // Hide rows per page label
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
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  hotelImage: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  packageCount: {
    backgroundColor: '#d4ac0d',
    color: 'white',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    display: 'inline-block',
  }
}));

const ViewHotels = () => {
  const classes = useStyles();
  const [hotelData, setHotelData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("hotel_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hotel/get-hotels');
        
        // Check if response.data exists and has the expected structure
        // If the response has a data property or some other property containing the array, use that
        if (Array.isArray(response.data)) {
          setHotelData(response.data);
        } else if (response.data && Array.isArray(response.data.hotels)) {
          // If the array is nested in a 'hotels' property
          setHotelData(response.data.hotels);
        } else if (response.data && Array.isArray(response.data.data)) {
          // If the array is nested in a 'data' property
          setHotelData(response.data.data);
        } else {
          // If nothing works, initialize as empty array
          console.error("Unexpected API response format:", response.data);
          setHotelData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the hotel data!", error);
        // Show error message with SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load hotel data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        // Initialize as empty array on error
        setHotelData([]);
      }
    };
  
    fetchHotelData();
  }, []);

  const handleUpdate = (hotelId) => {
    console.log(`Update hotel with ID: ${hotelId}`);
    navigate(`/update-hotel/${hotelId}`); // Navigate to the update page with the hotel ID
  };

  const handleViewPackages = (hotelId) => {
    console.log(`View packages for hotel with ID: ${hotelId}`);
    navigate(`/hotel-packages/${hotelId}`); // Navigate to the hotel packages page
  };

  const handleDelete = async (id) => {
    // First confirm deletion with SweetAlert
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
        // First check if hotel has associated bookings
        const bookingCheckResponse = await axios.get(`http://localhost:3001/booking/check-bookings/${id}`);
        
        if (bookingCheckResponse.data.hasBookings) {
          // Show error message if hotel has bookings
          Swal.fire({
            title: 'Cannot Delete!',
            text: 'Bookings associated with this hotel exist.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
          return;
        }
        
        // If no bookings, proceed with deletion
        await axios.delete(`http://localhost:3001/hotel/delete-hotel/${id}`);
        setHotelData(hotelData.filter(hotel => hotel._id !== id));
        
        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Hotel has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error deleting the hotel!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting hotel: ' + (error.response?.data?.message || error.message),
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredHotels = hotelData.filter(hotel => {
    if (!searchQuery) return true;
    
    // Handle special case for star_rating which is a number
    if (searchCriteria === 'star_rating') {
      return hotel[searchCriteria] === parseInt(searchQuery);
    }
    
    const field = hotel[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedHotels = filteredHotels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Hotels List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="hotel_id">Hotel ID</MenuItem>
                  <MenuItem value="hotel_name">Hotel Name</MenuItem>
                  <MenuItem value="city">City</MenuItem>
                  <MenuItem value="phone_number">Phone Number</MenuItem>
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="star_rating">Star Rating</MenuItem>    
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
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}>Image</TableCell>
                  <TableCell style={{ color: 'white' }}>Hotel ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Hotel Name</TableCell>
                  <TableCell style={{ color: 'white' }}>City</TableCell>
                  <TableCell style={{ color: 'white' }}>Phone</TableCell>
                  <TableCell style={{ color: 'white' }}>Website</TableCell>
                  <TableCell style={{ color: 'white' }}>Rating</TableCell>
                  <TableCell style={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHotels.map((hotel) => (
                  <TableRow key={hotel._id}>
                    <TableCell>
                      <Avatar 
                        src={hotel.hotel_image} 
                        alt={hotel.hotel_name}
                        className={classes.hotelImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/50?text=Hotel";
                        }}
                      />
                    </TableCell>
                    <TableCell>{hotel.hotel_id}</TableCell>
                    <TableCell>{hotel.hotel_name}</TableCell>
                    <TableCell>{hotel.city}</TableCell>
                    <TableCell>{hotel.phone_number}</TableCell>
                    <TableCell>{hotel.website}</TableCell>
                    <TableCell>
                      <Rating 
                        value={hotel.star_rating} 
                        readOnly 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          style={{ marginRight: '8px' }}
                          onClick={() => handleUpdate(hotel._id)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleDelete(hotel._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredHotels.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewHotels;