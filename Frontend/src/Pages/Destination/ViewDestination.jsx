import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, Avatar, Chip, 
  IconButton, Collapse, Grid, Card, CardContent, CardHeader, Divider, TablePagination
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/destination_sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import StarIcon from '@material-ui/icons/Star';
import TravelExploreIcon from '@material-ui/icons/ExploreOutlined'; 
import ClimateIcon from '@material-ui/icons/WbSunny';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import HotelIcon from '@material-ui/icons/Hotel';
import TipsIcon from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';

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
  destinationAvatar: {
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
  userInfoFlex: {
    display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: theme.spacing(3),
  },
  destinationAvatarLarge: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(4),
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '3px solid white',
  },
  destinationDetailsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  destinationName: {
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
  cardHeaderClimate: {
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
  attractionChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#e0f7fa',
  }
}));

const ViewDestinations = () => {
  const classes = useStyles();
  const [destinationData, setDestinationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("destination_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/destination/get-destinations');
        
        if (Array.isArray(response.data)) {
          setDestinationData(response.data);
        } else if (response.data && Array.isArray(response.data.destinations)) {
          setDestinationData(response.data.destinations);
        } else if (response.data && Array.isArray(response.data.data)) {
          setDestinationData(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setDestinationData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the destination data!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load destination data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setDestinationData([]);
      }
    };
  
    fetchDestinationData();
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
        await axios.delete(`http://localhost:3001/destination/delete-destination/${id}`);
        setDestinationData(destinationData.filter(destination => destination._id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Destination has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error deleting the destination!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting destination: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleUpdate = (destinationId) => {
    console.log(`Update destination with ID: ${destinationId}`);
    navigate(`/update-destination/${destinationId}`);
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

  const filteredDestinations = destinationData.filter(destination => {
    if (!searchQuery) return true;
    
    const field = destination[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedDestinations = filteredDestinations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              Destinations List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="destination_id">Destination ID</MenuItem>
                  <MenuItem value="destination_name">Destination Name</MenuItem>
                  <MenuItem value="location">Location</MenuItem>
                  <MenuItem value="climate">Climate</MenuItem>
                  <MenuItem value="destination_rating">Rating</MenuItem>
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
                  <TableCell className={classes.tableHeadCell}>Destination ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>Destination Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>Location</TableCell>
                  <TableCell className={classes.tableHeadCell}>Climate</TableCell>
                  <TableCell className={classes.tableHeadCell}>Rating</TableCell>
                  <TableCell className={classes.tableHeadCell}>Best Time</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDestinations.map((destination) => (
                  <React.Fragment key={destination._id}>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(destination._id)}
                          style={{ transform: expandedRow === destination._id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {destination.destination_image ? (
                          <Avatar 
                            className={classes.destinationAvatar} 
                            src={destination.destination_image}
                            alt={destination.destination_name}
                            onError={(e) => {
                              console.error("Error loading image");
                              e.target.onerror = null; 
                              e.target.src = ""; 
                            }}
                          />
                        ) : (
                          <Avatar className={classes.destinationAvatar}>
                            {destination.destination_name ? destination.destination_name.charAt(0).toUpperCase() : 'D'}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell><strong>{destination.destination_id}</strong></TableCell>
                      <TableCell><strong>{destination.destination_name}</strong></TableCell>
                      <TableCell>{destination.location}</TableCell>
                      <TableCell>{destination.climate}</TableCell>
                      <TableCell>
                        <Rating 
                          value={destination.destination_rating || 0} 
                          readOnly 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{destination.best_time_to_visit}</TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <IconButton
                            className={`${classes.actionButton} ${classes.editButton}`}
                            size="small"
                            onClick={() => handleUpdate(destination._id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            className={`${classes.actionButton} ${classes.deleteButton}`}
                            size="small"
                            onClick={() => handleDelete(destination._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={expandedRow === destination._id} timeout="auto" unmountOnExit>
                          <Box className={classes.detailsContainer}>
                            <Box className={classes.userInfoFlex}>
                              {destination.destination_image ? (
                                <Avatar 
                                  className={classes.destinationAvatarLarge} 
                                  src={destination.destination_image}
                                  alt={destination.destination_name}
                                  onError={(e) => {
                                    console.error("Error loading image");
                                    e.target.onerror = null; 
                                    e.target.src = ""; 
                                  }}
                                />
                              ) : (
                                <Avatar className={classes.destinationAvatarLarge}>
                                  {destination.destination_name ? destination.destination_name.charAt(0).toUpperCase() : 'D'}
                                </Avatar>
                              )}
                              <Box className={classes.destinationDetailsSection}>
                                <Typography variant="h5" className={classes.destinationName}>
                                  {destination.destination_name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {destination.destination_id}
                                </Typography>
                                <Box mt={1}>
                                  <Rating 
                                    value={destination.destination_rating || 0} 
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
                                      <Typography className={classes.infoLabel}>Location:</Typography>
                                      <Typography className={classes.infoValue}>{destination.location}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <TravelExploreIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Best Time to Visit:</Typography>
                                      <Typography className={classes.infoValue}>{destination.best_time_to_visit}</Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              {/* Climate Information Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderClimate}`}
                                    avatar={<ClimateIcon className={classes.cardIcon} />}
                                    title="Climate Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <ClimateIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Climate:</Typography>
                                      <Typography className={classes.infoValue}>{destination.climate}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Popular Attractions:</Typography>
                                      <Chip 
                                        label={destination.popular_attractions?.length || 0} 
                                        size="small" 
                                        className={classes.attractionChip}
                                      />
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
                                      <Typography className={classes.infoLabel}>Destination Rating:</Typography>
                                      <Rating 
                                        value={destination.destination_rating || 0} 
                                        readOnly 
                                        size="small"
                                      />
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <Typography className={classes.infoLabel}>Description:</Typography>
                                      <Typography className={classes.infoValue} noWrap>
                                        {destination.destination_description || 'N/A'}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Popular Attractions Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader}`}
                                    style={{ backgroundColor: '#2196f3' }}
                                    avatar={<LocalActivityIcon className={classes.cardIcon} />}
                                    title="Popular Attractions"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    {destination.popular_attractions && destination.popular_attractions.length > 0 ? (
                                      destination.popular_attractions.map((attraction, index) => (
                                        <Box key={index} className={classes.infoRow}>
                                          <Typography className={classes.infoValue}>
                                            • {attraction}
                                          </Typography>
                                        </Box>
                                      ))
                                    ) : (
                                      <Typography className={classes.infoValue}>No attractions found</Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Accommodation Options Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader}`}
                                    style={{ backgroundColor: '#4caf50' }}
                                    avatar={<HotelIcon className={classes.cardIcon} />}
                                    title="Accommodation Options"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    {destination.accommodation_options && destination.accommodation_options.length > 0 ? (
                                      destination.accommodation_options.map((accommodation, index) => (
                                        <Box key={index} className={classes.infoRow}>
                                          <Typography className={classes.infoValue}>
                                            • {accommodation}
                                          </Typography>
                                        </Box>
                                      ))
                                    ) : (
                                      <Typography className={classes.infoValue}>No accommodations found</Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Travel Tips Card */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader}`}
                                    style={{ backgroundColor: '#ff9800' }}
                                    avatar={<TipsIcon className={classes.cardIcon} />}
                                    title="Travel Tips"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Typography className={classes.infoValue}>
                                      {destination.travel_tips || 'No travel tips available'}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Full Description Card - Spanning full width */}
                              <Grid item xs={12}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader}`}
                                    style={{ backgroundColor: '#9c27b0' }}
                                    avatar={<InfoIcon className={classes.cardIcon} />}
                                    title="Destination Description"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                    disableTypography={false}
                                  />
                                  <CardContent>
                                    <Typography variant="body1" className={classes.infoValue}>
                                      {destination.destination_description || 'No description available'}
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
            count={filteredDestinations.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewDestinations;