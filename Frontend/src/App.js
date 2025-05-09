import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Footer from './Components/footer';
import Header from './Components/guest_header';
import Login from './Pages/User/Login';
import Register from './Pages/User/Register';
import ForgotPassword from './Pages/User/ForgotPassword';
import ResetPassword from './Pages/User/ResetPassword';
import AddHotel from './Pages/Hotel/AddHotel';
import ViewHotels from './Pages/Hotel/ViewHotel';
import UpdateHotel from './Pages/Hotel/UpdateHotel';
import HotelReportPage from './Pages/Hotel/HotelReport';
import MainDashboard from './Pages/Admin/main_dashboard';
import AddDestination from './Pages/Destination/AddDestination';
import ViewDestinations from './Pages/Destination/ViewDestination';
import DestinationReportPage from './Pages/Destination/DestinationReport';
import UpdateDestination from './Pages/Destination/UpdateDestination';
import UserDetailsView from './Pages/User/ViewUser';
import EditProfile from './Pages/User/EditProfile';
import Home  from './Pages/Home/Home';
import ViewUsers from './Pages/User/ViewUser';
import AddUser from './Pages/User/AddUser';
import UserReportPage from './Pages/User/UserReport';
import HotelReservationPage from './Pages/Hotel/ReserveHotel';
import Bill from './Pages/Tourpackage/customer/Bill';
import FrontPage from './Pages/Tourpackage/customer/FrontPage';
import DisplayPackage from './Pages/Tourpackage/customer/DisplayPackage';
import AdminHome from './Pages/Tourpackage/admin/AdminHome';
import PackageDetails from './Pages/Tourpackage/customer/PackageDetails';
import TravelManagement from './Pages/Tourpackage/admin/TravelManagement';
import AdminBookings from './Pages/Tourpackage/admin/AdminBookings';
import ViewReviews from './Pages/Review/ViewReviews';
import BookingForm from './Pages/Booking/BookingForm';
import ViewBookings from './Pages/Booking/ViewBookings';
import UserBookingsPage from './Pages/Booking/UserBookings';
import AllHotelsPage from './Pages/Hotel/AllHotels';
import ViewAllDestinationsPage from './Pages/Destination/AllDestinations';
import DestinationDetails from './Pages/Destination/DestinationDetails';
import PackingReportGenerator from './Pages/PackingReport/PackingReportGenerator';

function App() {
  return (
      <div>
        <Header></Header>
        <Routes>
           {/* Redirect from root to login */}
           <Route path="/" element={<Home/>} />

          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/view-user" element={<UserDetailsView/>} />
          <Route path="/edit-profile" element={<EditProfile/>} />
          <Route path="/users" element={<ViewUsers/>} />
          <Route path="/add-user" element={<AddUser/>} />
          <Route path="/user-report" element={<UserReportPage/>} />

          <Route path="/view-reviews" element={<ViewReviews/>} />

          <Route path="/dashboard" element={<MainDashboard/>} />
          <Route path="/add-hotel" element={<AddHotel/>} />
          <Route path="/view-hotels" element={<ViewHotels/>} />
          <Route path="/update-hotel/:id" element={<UpdateHotel/>} />
          <Route path="/hotel-report" element={<HotelReportPage/>} />
          <Route path="/reserve-hotel/:id" element={<HotelReservationPage/>} />
          <Route path="/hotels" element={<AllHotelsPage/>} />

          <Route path="/booking" element={<BookingForm/>} />
          <Route path="/view-bookings" element={<ViewBookings/>} />
          <Route path="/my-bookings" element={<UserBookingsPage/>} />

          <Route path="/add-destination" element={<AddDestination/>} />
          <Route path="/view-destination" element={<ViewDestinations/>} />
          <Route path="/update-destination/:id" element={<UpdateDestination/>} />
          <Route path="/hotel-report" element={<HotelReportPage/>} />
          <Route path="/destination-report" element={<DestinationReportPage/>} />
          <Route path="/view-more-destinations" element={<ViewAllDestinationsPage/>} />
          <Route path="/destination-details/:id" element={<DestinationDetails/>} />

          {/* Tourpackage Routes */}
          <Route path="/bill" element={<Bill/>} />
          <Route path="/firstpage" element={<FrontPage />} />
          <Route path="/packages" element={<DisplayPackage />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/packagedetails" element={<PackageDetails />} />
          <Route path="/admin/travel" element={<TravelManagement />} />
          <Route path="/admin/bookings" element={<AdminBookings/>} />

          {/* <Route path="/AIgenaration" element={<PackingReportGenerator/>} /> */}
          <Route path="/packing-list" element={<PackingReportGenerator/>} />

        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
