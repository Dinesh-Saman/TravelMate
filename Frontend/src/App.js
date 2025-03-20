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

function App() {
  return (
      <div>
        <Header></Header>
        <Routes>
           {/* Redirect from root to login */}
           <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />

          <Route path="/hotel-management" element={<MainDashboard/>} />
          <Route path="/add-hotel" element={<AddHotel/>} />
          <Route path="/view-hotels" element={<ViewHotels/>} />
          <Route path="/update-hotel/:id" element={<UpdateHotel/>} />
          <Route path="/hotel-report" element={<HotelReportPage/>} />

        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
