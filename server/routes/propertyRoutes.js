const express = require('express');
const router = express.Router();
const { 
  createProperty, 
  getProperties, 
  getPropertyById, 
  getMyProperties,
  deleteProperty,
  updatePropertyStatus,
  updateProperty // <-- 1. Import the new controller function
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

// Order doesn't strictly matter here, but keep them clean:
router.post('/', protect, createProperty); 
router.get('/', getProperties);
router.get('/myproperties', protect, getMyProperties);
router.get('/:id', getPropertyById);

// 2. Add the delete route (protected!)
router.delete('/:id', protect, deleteProperty);

//3. Add the new route for updating property status (also protected!)
router.put('/:id/status', protect, updatePropertyStatus);

//4. Add the new route for updating property details (also protected!)
router.put('/:id', protect, updateProperty);

module.exports = router;