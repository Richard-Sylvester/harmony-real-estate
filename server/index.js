const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Google DNS to bypass ISP blocking
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose

// Initialize automated background tasks
require('./cron');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes')); // New route for image uploads

// Database Connection Logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Stop the server if the DB fails
    }
};

connectDB(); // Run the connection

app.get('/', (req, res) => {
    res.send('Harmony API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));