const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to create a "Digital Key" (Token)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // bcrypt.compare checks if the typed password matches the hashed one
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Authenticate with Google
// @route   POST /api/users/google
const googleAuth = async (req, res) => {
    const { name, email, photo } = req.body;

    try {
        // 1. Check if this Google user already exists in MongoDB
        let user = await User.findOne({ email });

        if (user) {
            // User exists! Just generate a token and log them in.
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            // 2. User does NOT exist. Let's create a new account for them!
            // Since your User model likely requires a password, we generate a massive random dummy password.
            // They will never need to remember or type this, because Firebase handles their Google login.
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: generatedPassword, 
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error("Backend Google Auth Error:", error);
        res.status(500).json({ message: 'Server error during Google Authentication' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Requires Token)
const updateUserProfile = async (req, res) => {
    try {
        // req.user._id comes from your "protect" middleware!
        const user = await User.findById(req.user._id);

        if (user) {
            // Update the fields. If they didn't type a new name, keep the old one.
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            
            // Only update role if it's explicitly passed (prevents accidental downgrades)
            if (req.body.role) {
                user.role = req.body.role;
            }

            // Security: Only update the password if they actually typed a new one!
            if (req.body.password) {
                user.password = req.body.password; 
                // Note: Our User.js pre('save') hook will automatically hash this for us!
            }

            const updatedUser = await user.save();

            // Send back the fresh user data so the frontend can update the Navbar/Dashboard
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                token: req.token // Keep their current login session alive
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

// @desc    Toggle property in saved list (Add/Remove)
// @route   POST /api/users/saved/:propertyId
// @access  Private
const toggleSavedProperty = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const propertyId = req.params.propertyId;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the property is already in the array
        const isSaved = user.savedProperties.includes(propertyId);

        if (isSaved) {
            // Remove it
            user.savedProperties = user.savedProperties.filter(
                (id) => id.toString() !== propertyId
            );
        } else {
            // Add it
            user.savedProperties.push(propertyId);
        }

        await user.save();
        res.json({ message: isSaved ? "Property removed from saved" : "Property saved", savedProperties: user.savedProperties });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get user's saved properties
// @route   GET /api/users/saved
// @access  Private
const getSavedProperties = async (req, res) => {
    try {
        // The .populate() method is magic. It takes the array of IDs and replaces 
        // them with the actual property data (title, price, images, etc.)!
        const user = await User.findById(req.user._id).populate('savedProperties');
        
        if (user) {
            res.json(user.savedProperties);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching saved properties" });
    }
};

const Property = require('../models/Property'); // Make sure to import Property!

// --- REQUEST ACCOUNT DELETION ---
// Route: PUT /api/users/delete-request
// Access: Private
const requestAccountDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Set the 30-day timer (30 days * 24 hours * 60 min * 60 sec * 1000 ms)
    user.accountStatus = 'PendingDeletion';
    user.scheduledDeletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    // 2. Hide all their properties from the marketplace
    // Changing the status to 'Hidden' ensures it drops off your "Available" logic!
    await Property.updateMany(
      { user: req.user.id }, 
      { status: 'Hidden' } 
    );

    res.status(200).json({ message: 'Account scheduled for deletion' });
  } catch (error) {
    console.error("Deletion request error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, authUser, googleAuth, updateUserProfile, toggleSavedProperty, getSavedProperties, requestAccountDeletion };