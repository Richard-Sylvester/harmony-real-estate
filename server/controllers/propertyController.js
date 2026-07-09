const Property = require('../models/Property');

// @desc    Create a new property
// @route   POST /api/properties
const createProperty = async (req, res) => {
    const { title, description, type, category, price, location, locationData, amenities, images } = req.body;

    // --- NEW: THE ADMIN INTERCEPTOR ---
    // If the logged-in user is an admin, it's company-owned. Otherwise, it's false.
    const isCompanyOwned = req.user && req.user.isAdmin ? true : false;
    
    // Admins bypass the pending queue and go live instantly! Normal users go to pending (false).
    const isApproved = req.user && req.user.isAdmin ? true : false; 

    const property = new Property({
        user: req.user._id, // Taken from the "protect" middleware
        title,
        description,
        type,
        category,
        price,
        location,
        locationData,
        amenities,
        images,
        // --- NEW: INJECT THE PREMIUM FLAGS ---
        isCompanyOwned,
        isApproved 
    });

    try {
        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        console.error("Failed to create property:", error);
        res.status(500).json({ message: "Server Error creating property" });
    }
};

// @desc    Fetch all properties (with filtering!)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
    try {
        // 1. Start with the foundational rules!
        // ONLY fetch properties that are approved by admin AND are marked as 'Available'
        let query = {
            isApproved: true
        };
        // 2. Catch the Exact Match filters
        if (req.query.type) query.type = req.query.type; // 'Sell' or 'Rent'
        if (req.query.category) query.category = req.query.category; // 'Villa', 'Flat', etc.
        if (req.query.status) query.possessionStatus = req.query.status;
       
        // 3. Residential Filters
        if (req.query.bedrooms) query.bedrooms = req.query.bedrooms;
        if (req.query.bathrooms) query.bathrooms = req.query.bathrooms;
        if (req.query.balconies) query.balconies = req.query.balconies;
        if (req.query.furnishedStatus) query.furnishedStatus = req.query.furnishedStatus;

        // 4. Commercial Filters
        if (req.query.washrooms) query.washrooms = req.query.washrooms;
        if (req.query.parkingSpaces) query.parkingSpaces = req.query.parkingSpaces;

        // 5. Plot Filters
        if (req.query.boundaryWall) query.boundaryWall = req.query.boundaryWall;
        if (req.query.openSides) query.openSides = req.query.openSides;

        // 6. PG Filters
        if (req.query.roomType) query.roomType = req.query.roomType;
        if (req.query.foodIncluded) query.foodIncluded = req.query.foodIncluded;

        // 7. Catch the Budget filters (Greater Than / Less Than)
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // 8. Fetch the properties that match our dynamically built query
        const properties = await Property.find(query).sort({ createdAt: -1 }); // Newest first
        
        res.json(properties);
    } catch (error) {
        console.error("Fetch Properties Error:", error);
        res.status(500).json({ message: "Server Error fetching properties" });
    }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
    const property = await Property.findById(req.params.id).populate('user', 'name email');

    if (property) {
        res.json(property);
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
};

// @desc    Get logged in user's properties
// @route   GET /api/properties/myproperties
// @access  Private (Requires Token)
const getMyProperties = async (req, res) => {
    try {
        // req.user._id comes from your JWT authentication middleware
        // We look for any property where the 'user' field matches the logged-in person
        const properties = await Property.find({ user: req.user._id });
        res.json(properties);
    } catch (error) {
        console.error("Error fetching user properties:", error);
        res.status(500).json({ message: "Server error while fetching properties." });
    }
};

// --- DELETE A PROPERTY ---
// Route: DELETE /api/properties/:id
// Access: Private (Only the owner can delete)
const deleteProperty = async (req, res) => {
  try {
    // 1. Find the property in the database
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // 2. CRITICAL SECURITY CHECK: Ensure the logged-in user owns this property
    // We convert property.user to a string to safely compare it to req.user.id
    if (property.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this property' });
    }

    // 3. If it passes the check, delete it!
    await property.deleteOne();

    res.status(200).json({ 
      id: req.params.id, 
      message: 'Property deleted successfully' 
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- MARK PROPERTY AS SOLD/RENTED ---
// Route: PUT /api/properties/:id/status
// Access: Private
const updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Security check: Only the owner can change the status
    if (property.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Flip the status based on what the frontend sends
    property.status = req.body.status; 
    await property.save();

    res.status(200).json(property);
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- UPDATE PROPERTY DETAILS ---
// Route: PUT /api/properties/:id
// Access: Private (Only the owner can edit)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Security check: Ensure the logged-in user owns this property
    if (property.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to edit this property' });
    }

    // Update only the fields we allowed in the Edit form
    property.price = req.body.price || property.price;
    property.description = req.body.description || property.description;
    
    // Safely update images if the array is provided
    if (req.body.images !== undefined) {
      property.images = req.body.images;
    }

    const updatedProperty = await property.save();

    res.status(200).json(updatedProperty);
    
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Don't forget to export it at the bottom!

module.exports = { createProperty, getProperties, getPropertyById, getMyProperties, deleteProperty, updatePropertyStatus, updateProperty };
