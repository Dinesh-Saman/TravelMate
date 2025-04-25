import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, 
  Avatar, Chip, IconButton, Collapse, Grid, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import WebIcon from '@material-ui/icons/Language';
import StarIcon from '@material-ui/icons/Star';
import RoomIcon from '@material-ui/icons/Room';
import TravelExploreIcon from '@material-ui/icons/ExploreOutlined'; 
import DescriptionIcon from '@material-ui/icons/Description';

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
    backgroundColor: '#d4ac0d',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  hotelAvatar: {
    width: 60,
    height: 60,
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
    border: '2px solid white',
  },
  ratingChip: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: theme.spacing(2, 0),
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  userInfoFlex: {
    display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: theme.spacing(3),
  },
  hotelAvatarLarge: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(4),
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '3px solid white',
  },
  hotelDetailsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  hotelName: {
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
  cardHeaderLocation: {
    backgroundColor: '#43a047',
  },
  cardHeaderContact: {
    backgroundColor: '#1976d2',
  },
  cardHeaderRating: {
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
    minWidth: 90,
  },
  infoValue: {
    color: theme.palette.text.primary
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
    backgroundColor: '#4CAF50', // Green
    color: 'white',
    '&:hover': {
      backgroundColor: '#2E7D32', // Dark Green
    },
  },
  packageChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#e0f7fa',
  }
}));

const ViewHotels = () => {
  const classes = useStyles();
  const [hotelData, setHotelData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("hotel_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hotel/get-hotels');
        
        if (Array.isArray(response.data)) {
          setHotelData(response.data);
        } else if (response.data && Array.isArray(response.data.hotels)) {
          setHotelData(response.data.hotels);
        } else if (response.data && Array.isArray(response.data.data)) {
          setHotelData(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setHotelData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the hotel data!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load hotel data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setHotelData([]);
      }
    };
  
    fetchHotelData();
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
        await axios.delete(`http://localhost:3001/hotel/delete-hotel/${id}`);
        setHotelData(hotelData.filter(hotel => hotel._id !== id));
        
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

  const handleUpdate = (hotelId) => {
    console.log(`Update hotel with ID: ${hotelId}`);
    navigate(`/update-hotel/${hotelId}`); // Navigate to the update page with the hotel ID
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

  const filteredHotels = hotelData.filter(hotel => {
    if (!searchQuery) return true;
    
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
            marginBottom={3}
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
                  <MenuItem value="address">Address</MenuItem>
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
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}></TableCell>
                  <TableCell className={classes.tableHeadCell}>Image</TableCell>
                  <TableCell className={classes.tableHeadCell}>Hotel ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>Hotel Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>City</TableCell>
                  <TableCell className={classes.tableHeadCell}>Star Rating</TableCell>
                  <TableCell className={classes.tableHeadCell}>Packages</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHotels.map((hotel) => (
                  <React.Fragment key={hotel._id}>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(hotel._id)}
                          style={{ transform: expandedRow === hotel._id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {hotel.hotel_image ? (
                          <Avatar 
                            className={classes.hotelAvatar} 
                            src={hotel.hotel_image}
                            alt={hotel.hotel_name}
                            onError={(e) => {
                              console.error("Error loading image");
                              e.target.onerror = null; 
                              e.target.src = ""; 
                            }}
                          />
                        ) : (
                          <Avatar className={classes.hotelAvatar}>
                            {hotel.hotel_name ? hotel.hotel_name.charAt(0).toUpperCase() : 'H'}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell><strong>{hotel.hotel_id}</strong></TableCell>
                      <TableCell><strong>{hotel.hotel_name}</strong></TableCell>
                      <TableCell>{hotel.city}</TableCell>
                      <TableCell>
                        <Rating 
                          value={hotel.star_rating || 0} 
                          readOnly 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={hotel.hotel_packages?.length || 0} 
                          size="small" 
                          className={classes.packageChip}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                        <IconButton
                            className={`${classes.actionButton} ${classes.editButton}`}
                            size="small"
                            onClick={() => handleUpdate(hotel._id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            className={`${classes.actionButton} ${classes.deleteButton}`}
                            size="small"
                            onClick={() => handleDelete(hotel._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={expandedRow === hotel._id} timeout="auto" unmountOnExit>
                          <Box className={classes.detailsContainer}>
                            <Box className={classes.userInfoFlex}>
                              {hotel.hotel_image ? (
                                <Avatar 
                                  className={classes.hotelAvatarLarge} 
                                  src={hotel.hotel_image}
                                  alt={hotel.hotel_name}
                                  onError={(e) => {
                                    console.error("Error loading image");
                                    e.target.onerror = null; 
                                    e.target.src = ""; 
                                  }}
                                />
                              ) : (
                                <Avatar className={classes.hotelAvatarLarge}>
                                  {hotel.hotel_name ? hotel.hotel_name.charAt(0).toUpperCase() : 'H'}
                                </Avatar>
                              )}
                              <Box className={classes.hotelDetailsSection}>
                                <Typography variant="h5" className={classes.hotelName}>
                                  {hotel.hotel_name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {hotel.hotel_id}
                                </Typography>
                                <Box mt={1}>
                                  <Rating 
                                    value={hotel.star_rating || 0} 
                                    readOnly 
                                    size="small"
                                  />
                                </Box>
                              </Box>
                            </Box>
                            
                            <Grid container spacing={3}>
                              {/* Location Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderLocation}`}
                                    avatar={<LocationOnIcon className={classes.cardIcon} />}
                                    title="Location Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <LocationOnIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>City:</Typography>
                                      <Typography className={classes.infoValue}>{hotel.city}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <RoomIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Address:</Typography>
                                      <Typography className={classes.infoValue}>{hotel.address}</Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              {/* Contact Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderContact}`}
                                    avatar={<PhoneIcon className={classes.cardIcon} />}
                                    title="Contact Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <PhoneIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Phone:</Typography>
                                      <Typography className={classes.infoValue}>{hotel.phone_number}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <WebIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Website:</Typography>
                                      <Typography className={classes.infoValue}>
                                        <a 
                                          href={hotel.website} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                        >
                                          {hotel.website}
                                        </a>
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              {/* Rating Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderRating}`}
                                    avatar={<StarIcon className={classes.cardIcon} />}
                                    title="Rating Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Star Rating:</Typography>
                                      <Rating 
                                        value={hotel.star_rating || 0} 
                                        readOnly 
                                        size="small"
                                      />
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Total Packages:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {hotel.hotel_packages?.length || 0}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>

                              <Grid item xs={12} md={6}>
                              <Card>
                                <CardHeader
                                  className={`${classes.cardHeader} ${classes.cardHeaderPackages}`}
                                  avatar={<TravelExploreIcon className={classes.cardIcon} />}
                                  title="Hotel Packages"
                                  titleTypographyProps={{ variant: 'subtitle1' }}
                                  disableTypography={false}
                                />
                                <CardContent>
                                  {hotel.hotel_packages && hotel.hotel_packages.length > 0 ? (
                                    <List className={classes.packageList}>
                                      {hotel.hotel_packages.map((pkg, index) => (
                                        <ListItem key={index} className={classes.packageListItem}>
                                          <ListItemText
                                            primary={
                                              <Typography className={classes.packageName}>
                                                {pkg.package_name}
                                              </Typography>
                                            }
                                            secondary={
                                              <>
                                                <Typography variant="body2" color="textSecondary">
                                                  Price: ${pkg.price}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                  No of Rooms: {pkg.no_of_rooms}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                  Inclusions: {pkg.inclusions.join(', ')}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                  Validity: {new Date(pkg.validity_period).toLocaleDateString()}
                                                </Typography>
                                              </>
                                            }
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  ) : (
                                    <Typography variant="body2" color="textSecondary">
                                      No packages available
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>

                                                  {/* Description Card */}
                                                  <Grid item xs={12} md={6}>
                              <Card>
                                <CardHeader
                                  className={`${classes.cardHeader} ${classes.cardHeaderDescription}`}
                                  avatar={<DescriptionIcon className={classes.cardIcon} />}
                                  title="Hotel Description"
                                  titleTypographyProps={{ variant: 'subtitle1' }}
                                  disableTypography={false}
                                />
                                <CardContent>
                                  <Typography 
                                    variant="body2" 
                                    color="textPrimary" 
                                    className={classes.descriptionText}
                                  >
                                    {hotel.description || 'No description available'}
                                  </Typography>
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