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

const app = express();

app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public')));

// Increase the body size limits for JSON and URL-encoded requests
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Initialize database connection
db_connection();

// Use the user routes
app.use("/user", UserRoutes);  
app.use("/hotel", HotelRoutes);  
app.use("/destination", DestinationRoutes);  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});