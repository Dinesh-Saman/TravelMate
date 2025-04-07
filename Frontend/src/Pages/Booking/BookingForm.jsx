import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Card,
  CardContent,
  Fade,
  Slide,
  List
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { 
  Event, 
  AttachMoney, 
  CreditCard, 
  Lock, 
  CalendarToday,
  KingBed,
  Hotel as HotelIcon,
  CardGiftcard,
  Payment,
  DateRange
} from '@material-ui/icons';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BookingReceipt from './BookingReceipt';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Alert from '@material-ui/lab/Alert';

const MySwal = withReactContent(Swal);

// Custom styled components
const StyledTextField = withStyles((theme) => ({
  root: {
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}))(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
    },
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    background: 'white',
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 4,
      height: '100%',
      background: 'linear-gradient(to bottom, #3f51b5, #2196f3)',
    },
  },
  header: {
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    fontWeight: 700,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: 60,
      height: 4,
      background: 'linear-gradient(to right, #3f51b5, #2196f3)',
      borderRadius: 2,
    },
  },
  sectionHeader: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.primary.dark,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1.5),
      color: theme.palette.primary.main,
    },
  },
  divider: {
    margin: theme.spacing(3, 0),
    backgroundColor: theme.palette.primary.light,
    height: 2,
    backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(63, 81, 181, 0.5), rgba(0, 0, 0, 0.1))',
  },
  cardDetails: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    },
  },
  textField: {
    marginBottom: theme.spacing(3),
    '& .MuiInputBase-input': {
      fontSize: '0.95rem',
    },
  },
  button: {
    padding: theme.spacing(1.75),
    fontSize: '1.1rem',
    marginTop: theme.spacing(3),
    fontWeight: 600,
    borderRadius: 12,
    textTransform: 'none',
    letterSpacing: 0.5,
    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
    },
  },
  priceDisplay: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2.5),
    borderRadius: 12,
    marginTop: theme.spacing(2),
    textAlign: 'center',
    border: `1px solid ${theme.palette.primary.light}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  alert: {
    marginBottom: theme.spacing(3),
    borderRadius: 12,
  },
  summaryCard: {
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: 'none',
    overflow: 'hidden',
  },
  summaryTitle: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(2),
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  summaryContent: {
    padding: theme.spacing(3),
  },
  priceHighlight: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '1.4rem',
  },
  inputAdornment: {
    color: theme.palette.primary.main,
  },
  listItem: {
    padding: theme.spacing(1, 0),
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
  },
  listLabel: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  listValue: {
    fontWeight: 500,
  },
  cardIcon: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    padding: 8,
    borderRadius: '50%',
    marginRight: theme.spacing(2),
  },
  cardTypeIcon: {
    width: 40,
    height: 25,
    objectFit: 'contain',
    marginLeft: theme.spacing(1),
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  animatedSection: {
    transition: 'all 0.5s ease',
  },
}));

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};

const BookingForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const packageData = location.state?.packageData;
  const hotelData = location.state?.hotelData;
  const user = localStorage.getItem('username');
  const [roomAvailability, setRoomAvailability] = useState({
    available: packageData?.no_of_rooms || 0,
    requested: 1
  });

  const [formData, setFormData] = useState({
    no_of_rooms: 1,
    booking_from: new Date(),
    booking_to: new Date(new Date().setDate(new Date().getDate() + 1)),
    card_type: 'Visa',
    card_number: '',
    card_validity: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [price, setPrice] = useState(packageData?.price || 0);
  const [totalDays, setTotalDays] = useState(1);
  const [cardValidityError, setCardValidityError] = useState('');
  const [apiError, setApiError] = useState(null);

useEffect(() => {
  if (packageData && formData.booking_from && formData.booking_to) {
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(formData.booking_to - formData.booking_from);
    // Convert to days and add 1 to get number of nights
    const nights = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalDays(nights);
    setPrice(packageData.price * formData.no_of_rooms * nights);
  }
}, [formData.no_of_rooms, formData.booking_from, formData.booking_to, packageData]);

  const validateCardValidity = (value) => {
    if (!value) {
      setCardValidityError('Expiry date is required');
      return false;
    }
    
    const [month, year] = value.split('/');
    const expiryDate = new Date(parseInt('20' + year), parseInt(month) - 1);
    const currentDate = new Date();
    
    if (expiryDate < currentDate) {
      setCardValidityError('Card has expired');
      return false;
    }
    
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)) {
      setCardValidityError('Invalid format (MM/YY)');
      return false;
    }
    
    setCardValidityError('');
    return true;
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Room validation
    if (!formData.no_of_rooms || formData.no_of_rooms < 1) {
      newErrors.no_of_rooms = 'Number of rooms must be at least 1';
    }
    else if (packageData.no_of_rooms == 0) {
        newErrors.no_of_rooms = `No rooms available in this package`;
    }
    else if (packageData && formData.no_of_rooms > packageData.no_of_rooms) {
      newErrors.no_of_rooms = `Only ${packageData.no_of_rooms} rooms available in this package`;
    }

    // Date validation
    if (!formData.booking_from) {
      newErrors.booking_from = 'Check-in date is required';
    } else if (formData.booking_from < today) {
      newErrors.booking_from = 'Check-in date cannot be in the past';
    }

    if (!formData.booking_to) {
      newErrors.booking_to = 'Check-out date is required';
    } else if (formData.booking_to <= formData.booking_from) {
      newErrors.booking_to = 'Check-out date must be after check-in date';
    }

    // Payment validation
    if (!formData.card_type) {
      newErrors.card_type = 'Card type is required';
    }

    if (!formData.card_number) {
      newErrors.card_number = 'Card number is required';
    } else if (!/^\d{16,16}$/.test(formData.card_number.replace(/\s/g, ''))) {
      newErrors.card_number = 'Card number must be exactly 16 digits';
    }

    if (!validateCardValidity(formData.card_validity)) {
      newErrors.card_validity = cardValidityError;
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,3}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be exactly 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === 'no_of_rooms') {
      if (value === '' || /^[0-9\b]+$/.test(value)) {
        setFormData({ ...formData, [name]: value === '' ? '' : parseInt(value) });
      }
      return;
    }
    
    // Special handling for card number (digits only, formatted as XXXX XXXX XXXX XXXX)
    if (name === 'card_number') {
      const formattedValue = formatCardNumber(value);
      const unformattedValue = formattedValue.replace(/\s/g, '');
      if (unformattedValue.length <= 16) {
        setFormData({ ...formData, [name]: formattedValue });
      }
      return;
    }
    
    // Special handling for CVV (exactly 3 digits)
    if (name === 'cvv') {
      if (value === '' || /^[0-9\b]+$/.test(value)) {
        if (value.length <= 3) {
          setFormData({ ...formData, [name]: value });
        }
      }
      return;
    }
    
    // Special handling for card validity (MM/YY format)
    if (name === 'card_validity') {
      const formattedValue = value
        .replace(/\D/g, '') // Remove all non-digit characters
        .replace(/(\d{2})(\d{0,2})/, (match, p1, p2) => {
          return p2 ? `${p1}/${p2}` : p1;
        })
        .substring(0, 5);
      
      setFormData({ ...formData, [name]: formattedValue });
      validateCardValidity(formattedValue);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name) => (date) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    console.log(formData.no_of_rooms);
    console.log(packageData.no_of_rooms);

    setIsSubmitting(true);
    setApiError(null); 

    try {
      // Generate a unique booking ID
      const booking_id = `BK-${Date.now()}`;
      
      // Prepare card validity date for storage
      const [month, year] = formData.card_validity.split('/');
      const expMonth = parseInt(month);
      const expYear = parseInt('20' + year);
      
      // Create a proper date object for card validity
      const cardValidityDate = new Date(expYear, expMonth - 1, 1);
      
      // Format the booking data with all necessary fields
      const bookingData = {
        booking_id,
        user_name: user,
        hotel_name: hotelData.hotel_name,
        package: packageData.package_name,
        price: packageData.price,
        amount: price,
        status: 'confirmed',
        booking_from: formData.booking_from.toISOString(),
        booking_to: formData.booking_to.toISOString(),
        no_of_rooms: formData.no_of_rooms,
        card_type: formData.card_type,
        card_number: formData.card_number.replace(/\s/g, ''),
        cvv: formData.cvv,
        card_validity: cardValidityDate.toISOString()
      };

      const response = await fetch('http://localhost:3001/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors (like not enough rooms)
        if (data.message) {
          setApiError(data.message);
        } else {
          throw new Error('Booking failed');
        }
        return;
      }
      
      // Ensure the booking details have all required fields for BookingReceipt
      const completeBookingDetails = {
        ...data,
        card_type: formData.card_type,
        card_number: formData.card_number,
        booking_from: formData.booking_from,
        booking_to: formData.booking_to,
        no_of_rooms: formData.no_of_rooms,
        amount: price
      };
      
      setBookingDetails(completeBookingDetails);
      setBookingSuccess(true);

      // Show success message
      MySwal.fire({
        title: <Typography variant="h5" style={{ color: '#4CAF50' }}>Booking Confirmed!</Typography>,
        html: (
          <div>
            <Typography variant="body1" style={{ marginBottom: '1rem' }}>
              Your booking at <strong>{hotelData.hotel_name}</strong> has been confirmed.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              A receipt is being downloaded automatically.
            </Typography>
          </div>
        ),
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#4CAF50',
        background: '#f8f9fa',
      });

      // Delay the PDF download to ensure bookingDetails state is updated
      setTimeout(() => {
        const pdfLink = document.querySelector('a[download="booking_receipt.pdf"]');
        if (pdfLink) {
          pdfLink.click();
        }
      }, 1500);

    // Navigate back to previous page after successful booking
    navigate(`/my-bookings`);

    } catch (error) {
      console.error('Booking error:', error);
      MySwal.fire({
        title: 'Booking Failed',
        text: 'There was an error processing your booking. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f44336',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.no_of_rooms > 0 &&
      formData.booking_from &&
      formData.booking_to &&
      formData.card_type &&
      formData.card_number.replace(/\s/g, '').length === 16 &&
      /^\d+$/.test(formData.card_number.replace(/\s/g, '')) &&
      formData.card_validity.length === 5 &&
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.card_validity) &&
      !cardValidityError &&
      formData.cvv.length === 3 &&
      /^\d+$/.test(formData.cvv)
    );
  };

  if (!packageData || !hotelData) {
    return (
      <Container className={classes.root}>
        <Alert severity="error" className={classes.alert}>
          No package or hotel data found. Please go back and select a package to book.
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)}
          className={classes.button}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className={classes.root} maxWidth="lg">
      <Fade in={true} timeout={500}>
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h3" className={classes.header} gutterBottom>
            Complete Your Booking
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Slide in={true} direction="right" timeout={600}>
                <div>
                  <Card className={classes.cardDetails}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <HotelIcon className={classes.cardIcon} fontSize="large" />
                        <Typography variant="h5" style={{ fontWeight: 600 }}>
                          {hotelData.hotel_name}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <CardGiftcard className={classes.cardIcon} fontSize="large" />
                        <Typography variant="h6" color="textSecondary">
                          {packageData.package_name}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {packageData.package_description}
                      </Typography>
                      <Divider className={classes.divider} />
                      <Typography variant="body2" style={{ fontWeight: 600 }}>
                        Package Inclusions:
                      </Typography>
                      <ul style={{ paddingLeft: 20 }}>
                        {packageData.inclusions.map((item, index) => (
                          <li key={index} style={{ marginBottom: 4 }}>
                            <Typography variant="body2">{item}</Typography>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Typography variant="h5" className={classes.sectionHeader}>
                    <DateRange /> Booking Details
                  </Typography>

                  <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                        label="Number of Rooms"
                        name="no_of_rooms"
                        type="number"
                        value={formData.no_of_rooms}
                        onChange={handleChange}
                        fullWidth
                        className={classes.textField}
                        error={!!errors.no_of_rooms}
                        helperText={
                        errors.no_of_rooms || 
                        `Available: ${packageData.no_of_rooms} room${packageData.no_of_rooms !== 1 ? 's' : ''}`
                        }
                        variant="outlined"
                        inputProps={{ 
                        min: 1, 
                        max: packageData.no_of_rooms,
                        style: { fontSize: '1rem' }
                        }}
                        // Add this to your TextField's InputProps
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start" className={classes.inputAdornment}>
                                <KingBed />
                            </InputAdornment>
                            )
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box className={classes.priceDisplay}>
                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                          Total Price: 
                        </Typography>
                        <Typography variant="h4" className={classes.priceHighlight}>
                          Rs. {price.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ({formData.no_of_rooms} room{formData.no_of_rooms !== 1 ? 's' : ''} × {totalDays} night{totalDays !== 1 ? 's' : ''} 
                          <br />× Rs. {packageData.price.toLocaleString()}/night)
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Check-in Date"
                          value={formData.booking_from}
                          onChange={handleDateChange('booking_from')}
                          minDate={new Date()}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              fullWidth
                              className={classes.textField}
                              error={!!errors.booking_from}
                              helperText={errors.booking_from}
                              variant="outlined"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start" className={classes.inputAdornment}>
                                    <CalendarToday />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Check-out Date"
                          value={formData.booking_to}
                          onChange={handleDateChange('booking_to')}
                          minDate={new Date()}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              fullWidth
                              className={classes.textField}
                              error={!!errors.booking_to}
                              helperText={errors.booking_to}
                              variant="outlined"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start" className={classes.inputAdornment}>
                                    <CalendarToday />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>

                  <Typography variant="h5" className={classes.sectionHeader}>
                    <Payment /> Payment Information
                  </Typography>

                  <FormControl component="fieldset" className={classes.textField} fullWidth>
                    <FormLabel component="legend" style={{ marginBottom: 8, fontWeight: 500, color: 'rgba(0, 0, 0, 0.87)' }}>
                      Card Type
                    </FormLabel>
                    <RadioGroup
                      row
                      name="card_type"
                      value={formData.card_type}
                      onChange={handleChange}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <FormControlLabel 
                        value="Visa" 
                        control={<Radio color="primary" />} 
                        label={
                          <Box display="flex" alignItems="center">
                            Visa
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                              alt="Visa" 
                              className={classes.cardTypeIcon}
                            />
                          </Box>
                        } 
                      />
                      <FormControlLabel 
                        value="MasterCard" 
                        control={<Radio color="primary" />} 
                        label={
                          <Box display="flex" alignItems="center">
                            MasterCard
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                              alt="MasterCard" 
                              className={classes.cardTypeIcon}
                            />
                          </Box>
                        } 
                      />
                      <FormControlLabel 
                        value="American Express" 
                        control={<Radio color="primary" />} 
                        label={
                          <Box display="flex" alignItems="center">
                            Amex
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png" 
                              alt="Amex" 
                              className={classes.cardTypeIcon}
                            />
                          </Box>
                        } 
                      />
                    </RadioGroup>
                    {errors.card_type && (
                      <Typography color="error" variant="caption">
                        {errors.card_type}
                      </Typography>
                    )}
                  </FormControl>

                  <StyledTextField
                    label="Card Number"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleChange}
                    fullWidth
                    className={classes.textField}
                    error={!!errors.card_number}
                    helperText={errors.card_number}
                    variant="outlined"
                    placeholder="XXXX XXXX XXXX XXXX"
                    inputProps={{ maxLength: 19 }} // 16 digits + 3 spaces
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" className={classes.inputAdornment}>
                          <CreditCard />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <StyledTextField
                        label="Expiry Date (MM/YY)"
                        name="card_validity"
                        value={formData.card_validity}
                        onChange={handleChange}
                        fullWidth
                        className={classes.textField}
                        error={!!errors.card_validity}
                        helperText={errors.card_validity || cardValidityError}
                        variant="outlined"
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" className={classes.inputAdornment}>
                              <Event />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StyledTextField
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        fullWidth
                        className={classes.textField}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                        variant="outlined"
                        placeholder="XXX"
                        inputProps={{ maxLength: 3 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" className={classes.inputAdornment}>
                              <Lock />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    className={classes.button}
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isSubmitting}
                    startIcon={<AttachMoney />}
                  >
                    {isSubmitting ? (
                      <span>Processing Your Booking...</span>
                    ) : (
                      <span>Confirm Booking for Rs. {price.toLocaleString()}</span>
                    )}
                  </Button>
                </div>
              </Slide>
            </Grid>

            <Grid item xs={12} md={5}>
              <Slide in={true} direction="left" timeout={600}>
                <div>
                  <Card className={classes.summaryCard}>
                    <div className={classes.summaryTitle}>
                      Booking Summary
                    </div>
                    <CardContent className={classes.summaryContent}>
                      <List>
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel}>Hotel</Typography>
                          <Typography variant="body1" className={classes.listValue}>
                            {hotelData.hotel_name}
                          </Typography>
                        </Box>
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel}>Package</Typography>
                          <Typography variant="body1" className={classes.listValue}>
                            {packageData.package_name}
                          </Typography>
                        </Box>
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel}>Check-in</Typography>
                          <Typography variant="body1" className={classes.listValue}>
                            {formData.booking_from?.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Box>
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel}>Check-out</Typography>
                          <Typography variant="body1" className={classes.listValue}>
                            {formData.booking_to?.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Box>
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel}>Duration</Typography>
                          <Typography variant="body1" className={classes.listValue}>
                            {totalDays} night{totalDays !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel}>Rooms</Typography>
                          <Typography variant="body1" className={classes.listValue}>
                            {formData.no_of_rooms} room{formData.no_of_rooms !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                        <Divider className={classes.divider} style={{ margin: '16px 0' }} />
                        <Box className={classes.listItem}>
                          <Typography variant="body2" className={classes.listLabel} style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            Total Price
                          </Typography>
                          <Typography variant="body1" className={classes.priceHighlight} style={{ fontSize: '1.4rem' }}>
                            Rs. {price.toLocaleString()}
                          </Typography>
                        </Box>
                      </List>
                    </CardContent>
                  </Card>
                </div>
              </Slide>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {bookingSuccess && bookingDetails && (
        <PDFDownloadLink
            document={
            <BookingReceipt 
                booking={bookingDetails} 
                hotel={hotelData} 
                package={packageData} 
            />
            }
            fileName="booking_receipt.pdf"
            style={{ display: 'none' }}
        >
            {({ loading }) => (loading ? 'Loading document...' : 'Download')}
        </PDFDownloadLink>
        )}
    </Container>
  );
};

export default BookingForm;