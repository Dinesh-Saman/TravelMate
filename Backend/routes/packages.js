const express = require("express");
const router = express.Router();
const Package = require("../models/package"); // ✅ Use correct name

// Test Route
router.get("/test", (req, res) => res.send("Package route is working"));

// Add a new package
router.post("/", (req, res) => {
    console.log(req.body); // Log the incoming package data to check if it’s received correctly
    Package.create(req.body) // ✅ Use correct model name
        .then(() => res.json({ msg: "Package added successfully" }))
        .catch(() => res.status(400).json({ msg: "Failed to add package" }));
});

// Get all packages
router.get("/", (req, res) => {
    Package.find()
        .then((packages) => res.json(packages))
        .catch(() => res.status(400).json({ msg: "No packages found" }));
});

// Get a package by ID
router.get("/:id", (req, res) => {
    Package.findById(req.params.id)
        .then((pkg) => res.json(pkg))
        .catch(() => res.status(400).json({ msg: "Cannot find this package" }));
});

// Update a package by ID
router.put("/:id", (req, res) => {
    Package.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPkg) => res.json(updatedPkg))
        .catch(() => res.status(400).json({ msg: "Failed to update package" }));
});

// Delete a package by ID
router.delete("/:id", (req, res) => {
    Package.findByIdAndDelete(req.params.id)
        .then(() => res.json({ msg: "Deleted successfully" }))
        .catch(() => res.status(400).json({ msg: "Failed to delete package" }));
});

module.exports = router;
