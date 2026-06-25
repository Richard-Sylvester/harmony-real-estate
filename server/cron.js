const cron = require('node-cron');
const User = require('./models/User'); // Updated to match your actual filename!
const Property = require('./models/Property'); // Double-check this filename too!

console.log("Cron jobs initialized. Database reaper standing by.");

// This job runs automatically every night at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running nightly database cleanup...');
  
  try {
    // Find all users whose deletion date is today or earlier
    const usersToDelete = await User.find({ 
      scheduledDeletionDate: { $lte: new Date() } 
    });

    if (usersToDelete.length === 0) {
      console.log('No users scheduled for deletion today.');
      return;
    }

    for (const user of usersToDelete) {
      // 1. Permanently delete all their properties
      await Property.deleteMany({ user: user._id });
      
      // 2. Permanently delete the user
      await User.findByIdAndDelete(user._id);
      
      console.log(`Hard deleted user and their properties: ${user._id}`);
    }
  } catch (error) {
    console.error('Error in nightly deletion cron job:', error);
  }
});