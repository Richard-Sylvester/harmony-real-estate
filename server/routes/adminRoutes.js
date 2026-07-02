const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAllUsers, 
  getAllProperties, 
  approveProperty, 
  deletePropertyAdmin,
  deleteUser,
  toggleFeaturedProperty
} = require('../controllers/adminController');

// Import BOTH locks
const { protect, admin } = require('../middleware/authMiddleware');

// 🚨 Apply both locks to every single route in this file
router.use(protect, admin);

// GET /api/admin/...
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);

// Action Routes
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/feature', toggleFeaturedProperty);
router.delete('/properties/:id', deletePropertyAdmin);
router.delete('/users/:id', deleteUser);

module.exports = router;