const User = require('../models/User'); 
const Property = require('../models/Property'); 

// 1. Get Platform Analytics
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProperties = await Property.countDocuments({});
    const pendingApprovals = await Property.countDocuments({ isApproved: false });

    res.status(200).json({ totalUsers, totalProperties, pendingApprovals });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: 'Failed to fetch admin statistics' });
  }
};

// 2. Get All Users
const getAllUsers = async (req, res) => {
  try {
    // .select('-password') guarantees we NEVER accidentally send hashed passwords to the frontend!
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// 3. Get All Properties (For Moderation)
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

// 4. Approve a Property
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      property.isApproved = true;
      await property.save();
      res.status(200).json({ message: 'Property successfully approved!' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve property' });
  }
};

// 5. Admin Delete Override
const deletePropertyAdmin = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property permanently deleted by Admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete property' });
  }
};

// 6. Admin Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Failsafe: Prevent admins from deleting themselves or other admins
    if (user.isAdmin) {
      return res.status(400).json({ message: 'Cannot delete admin accounts!' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User permanently deleted.' });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// 7. Toggle Featured Status
const toggleFeaturedProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (property) {
      // Flips the current state (true becomes false, false becomes true)
      property.isFeatured = !property.isFeatured; 
      await property.save();
      
      res.status(200).json({ 
        message: property.isFeatured ? 'Property is now featured!' : 'Property removed from featured.' 
      });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error("Feature toggle error:", error);
    res.status(500).json({ message: 'Failed to toggle featured status' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProperties,
  approveProperty,
  deletePropertyAdmin,
  deleteUser,
  toggleFeaturedProperty
};