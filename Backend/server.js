const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db_connection = require("./database/index");
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

// Import the user routes
const UserRoutes = require("./routes/userRoute");
const HotelRoutes = require("./routes/hotelRoute");
const DestinationRoutes = require("./routes/destinationRoute");
const ReviewRoutes = require("./routes/reviewRoute");

//tourpakcage
const routes = require("./routes/packages")
const bookingRoutes = require("./routes/PackageBookings");


const app = express();

app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Initialize database connection
db_connection();

// Use the user routes
app.use("/user", UserRoutes);  
app.use("/hotel", HotelRoutes);  
app.use("/destination", DestinationRoutes);  
app.use("/review", ReviewRoutes);  
//touepackage  
app.use("/api/package",routes);
app.use("/api/book", bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
