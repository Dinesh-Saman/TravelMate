const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    duration: { type: String, required: true }
});

module.exports = mongoose.model("Package", PackageSchema); // ✅ Capitalized "Package"
