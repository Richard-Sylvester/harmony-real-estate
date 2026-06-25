const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['buyer', 'seller', 'admin'], 
        default: 'buyer' 
    },
    // --- ADD THIS NEW FIELD ---
    savedProperties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property' // Tells Mongoose to link these IDs to the Property collection
    }],

    // --- ADDED FOR ACCOUNT DELETION PIPELINE ---
    accountStatus: {
        type: String,
        enum: ['Active', 'PendingDeletion'],
        default: 'Active'
    },
    scheduledDeletionDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// This line automatically hides the password before saving it (Security first!)
userSchema.pre('save', async function () {
    // If the password wasn't modified, we just 'return' to exit the function early.
    // No 'next()' needed!
    if (!this.isModified('password')) {
        return; 
    }

    // If it WAS modified, we hash it. 
    // Mongoose will automatically wait for these 'await' lines to finish before saving.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);