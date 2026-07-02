const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true }, // 'Sell' or 'Rent'
    category: { type: String, required: true }, // 'Residential House', 'Apartment/Flat', etc.
    price: { type: Number, required: true },
    
    // --- NEW DEDICATED MAGICBRICKS FIELDS ---
    bedrooms: { type: String },
    bathrooms: { type: String },
    balconies: { type: String },
    furnishedStatus: { type: String },
    superArea: { type: Number },
    superAreaUnit: { type: String, default: 'Sq-ft' },
    possessionStatus: { type: String, default: 'Ready to Move' },
    
    // --- LOCATION DATA ---
    location: { type: String, required: true }, // The readable string (e.g. "Whitefield, Bengaluru")
    locationData: { // The exact coordinates for the Map
        lat: { type: Number },
        lng: { type: Number }
    },
    // ---------------------

    amenities: [String], // e.g., ['Parking', 'CCTV', 'Paved Road']
    images: [String], // Array of URLs
    
    // --- TRACK RECORD FEATURE ---
    // Replaced isAvailable with status to handle Available, Sold, and Rented states
    status: { 
        type: String, 
        enum: ['Available', 'Sold', 'Rented'], 
        default: 'Available' 
    },
    // --- NEW: ADMIN MODERATION LEVERS ---
    isApproved: { 
      type: Boolean, 
      default: false // Set to false so new posts are hidden until an admin reviews them
    },
    isFeatured: { 
      type: Boolean, 
      default: false // Allows admin to pin specific properties to the top of the homepage
    },
    isCompanyOwned: { 
      type: Boolean, 
      default: false // Flags properties posted directly by Harmony Admins
    }
  },
 { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);