const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, authUser, googleAuth, updateUserProfile, toggleSavedProperty, getSavedProperties, requestAccountDeletion } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', authUser); // <--- Add this line
router.post('/google', googleAuth); // <--- Add this line
router.put('/profile', protect, updateUserProfile);
router.get('/saved', protect, getSavedProperties);
router.post('/saved/:propertyId', protect, toggleSavedProperty);
router.put('/delete-request', protect, requestAccountDeletion);
module.exports = router;