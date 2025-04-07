import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create custom A4 page with increased height (297mm → 350mm)
const pageSize = { width: '210mm', height: '350mm' };

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    width: pageSize.width,
    height: pageSize.height,
  },
  letterhead: {
    height: '100px', // Reduced from 120px to save space
    width: '100%',
    backgroundColor: '#2c3e50',
    position: 'relative',
    paddingTop: '15px',
    marginBottom: '20px',
  },
  letterheadContent: {
    position: 'absolute',
    bottom: '15px',
    left: '30px',
    right: '30px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  letterheadText: {
    color: '#ffffff',
    fontSize: '9px', // Slightly smaller
  },
  logoContainer: {
    width: '100px', // Smaller
    height: '70px',
    backgroundColor: '#ffffff',
    borderRadius: '35px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    width: '80px',
    height: '50px',
  },
  content: {
    padding: '0 30px 30px 30px', // Reduced padding
  },
  header: {
    marginBottom: '15px', // Reduced
    textAlign: 'center',
  },
  title: {
    fontSize: '22px', // Slightly smaller
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#2c3e50',
    letterSpacing: '1px',
  },
  subtitle: {
    fontSize: '12px', // Smaller
    color: '#7f8c8d',
    letterSpacing: '0.5px',
  },
  decorativeLine: {
    height: '2px',
    width: '80px', // Smaller
    backgroundColor: '#e74c3c',
    margin: '0 auto 15px auto',
  },
  section: {
    marginBottom: '15px', // Reduced
    backgroundColor: '#f8f9fa',
    padding: '12px', // Reduced
    borderRadius: '5px',
    borderLeft: '4px solid #3498db',
  },
  sectionHeader: {
    fontSize: '14px', // Smaller
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '6px', // Reduced
    alignItems: 'center',
  },
  label: {
    fontSize: '9px', // Smaller
    fontWeight: 'bold',
    color: '#7f8c8d',
    width: '40%',
  },
  value: {
    fontSize: '9px', // Smaller
    fontWeight: 'normal',
    color: '#2c3e50',
    width: '60%',
    textAlign: 'right',
  },
  totalContainer: {
    marginTop: '12px', // Reduced
    paddingTop: '8px',
    borderTop: '1px dashed #bdc3c7',
  },
  total: {
    fontSize: '12px', // Smaller
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  footer: {
    marginTop: '20px', // Reduced
    fontSize: '8px', // Smaller
    textAlign: 'center',
    color: '#7f8c8d',
    paddingTop: '8px',
    borderTop: '1px solid #ecf0f1',
  },
  watermark: {
    position: 'absolute',
    bottom: '40px', // Adjusted
    left: '0',
    right: '0',
    textAlign: 'center',
    color: 'rgba(0,0,0,0.1)',
    fontSize: '50px', // Smaller
    fontWeight: 'bold',
    transform: 'rotate(-15deg)',
  },
  decorativeCorner: {
    position: 'absolute',
    width: '80px', // Smaller
    height: '80px',
    borderRight: '2px solid #e74c3c',
    borderBottom: '2px solid #e74c3c',
    bottom: '0',
    right: '0',
  },
  companyName: {
    fontSize: '18px', // Slightly smaller
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: '10px', // Smaller
    color: '#ffffff',
    fontStyle: 'italic',
    marginBottom: '8px',
  },
});

const BookingReceipt = ({ booking, hotel, package: pkg }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        {/* TravelMate Letterhead */}
        <View style={styles.letterhead}>
          <View style={styles.letterheadContent}>
            <View>
              <Text style={styles.companyName}>TRAVELMATE</Text>
              <Text style={styles.tagline}>INTERCAMBIO & TURISMO</Text>
              <Text style={styles.letterheadText}>Oceana 08 26/08, De Seram Road</Text>
              <Text style={styles.letterheadText}>Mount Lavinia, Sri Lanka</Text>
              <Text style={styles.letterheadText}>travelmate.lk | 0112839237 | travelmatesl@gmail.com</Text>
            </View>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src="https://www.felca.org/wp-content/uploads/logotravelmate.jpg" />
            </View>
          </View>
          <View style={styles.decorativeCorner} />
        </View>

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>BOOKING CONFIRMATION</Text>
            <Text style={styles.subtitle}>Your travel experience awaits</Text>
            <View style={styles.decorativeLine} />
          </View>

          {/* Booking Details - Made more compact */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Booking Summary</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Confirmation:</Text>
              <Text style={{...styles.value, fontWeight: 'bold'}}>{booking.booking_id}</Text>
            </View>
            <View style={{...styles.row, marginBottom: 0}}>
              <Text style={styles.label}>Issued/Status:</Text>
              <View style={{width: '60%', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.value}>{formatDate(new Date())}</Text>
                <Text style={{...styles.value, color: '#27ae60', fontWeight: 'bold'}}>CONFIRMED</Text>
              </View>
            </View>
          </View>

          {/* Hotel Information - Made more compact */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Hotel Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Hotel:</Text>
              <Text style={{...styles.value, fontWeight: 'bold'}}>{hotel.hotel_name}</Text>
            </View>
            <View style={{...styles.row, marginBottom: 0}}>
              <Text style={styles.label}>Address/Contact:</Text>
              <View style={{width: '60%'}}>
                <Text style={styles.value}>{hotel.address}, {hotel.city}</Text>
                <Text style={styles.value}>{hotel.phone_number} | {hotel.email}</Text>
              </View>
            </View>
          </View>

          {/* Reservation Details - Made more compact */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Your Stay</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Package:</Text>
              <Text style={{...styles.value, fontWeight: 'bold'}}>{pkg.package_name}</Text>
            </View>
            <View style={{...styles.row, marginBottom: 0}}>
              <Text style={styles.label}>Dates:</Text>
              <View style={{width: '60%'}}>
                <Text style={styles.value}>
                  {formatDate(booking.booking_from)} (2PM) → {formatDate(booking.booking_to)} (12PM)
                </Text>
              </View>
            </View>
            <View style={{...styles.row, marginBottom: 0}}>
              <Text style={styles.label}>Details:</Text>
              <View style={{width: '60%', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.value}>{booking.no_of_rooms} Room(s)</Text>
                <Text style={styles.value}>
                  {Math.ceil((new Date(booking.booking_to) - new Date(booking.booking_from)+1) / (1000 * 60 * 60 * 24))} Nights
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Information - Made more compact */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Payment Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Method:</Text>
              <Text style={styles.value}>{booking.card_type} •••• {booking.card_number.slice(-4)}</Text>
            </View>
            <View style={{...styles.row, marginBottom: 0}}>
              <Text style={styles.label}>Transaction:</Text>
              <View style={{width: '60%', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.value}>{formatDate(new Date())}</Text>
                <Text style={styles.value}>AUTH{Math.floor(100000 + Math.random() * 900000)}</Text>
              </View>
            </View>
            <View style={styles.totalContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Total Amount:</Text>
                <Text style={styles.total}>{formatCurrency(booking.amount)}</Text>
              </View>
            </View>
          </View>

          {/* Price Breakdown - Made more compact */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Price Breakdown</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Rate:</Text>
              <Text style={styles.value}>{formatCurrency(pkg.price)}/room/night</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Calculation:</Text>
              <Text style={styles.value}>
                {booking.no_of_rooms} × {Math.ceil((new Date(booking.booking_to) - new Date(booking.booking_from)) / (1000 * 60 * 60 * 24))} = {formatCurrency(pkg.price * booking.no_of_rooms * Math.ceil((new Date(booking.booking_to) - new Date(booking.booking_from)) / (1000 * 60 * 60 * 24)))}
              </Text>
            </View>
            <View style={styles.totalContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Total Charged:</Text>
                <Text style={styles.total}>{formatCurrency(booking.amount)}</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Thank you for choosing TravelMate</Text>
            <Text>For inquiries: 0112839237 | travelmatesl@gmail.com | travelmate.lk</Text>
            <Text style={{marginTop: '4px', fontStyle: 'italic', fontSize: '7px'}}>This is an electronically generated receipt. No signature required.</Text>
          </View>

          {/* Watermark */}
          <Text style={styles.watermark} fixed>TRAVELMATE</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BookingReceipt;