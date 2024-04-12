// Import necessary modules
const express = require('express');
const admin = require('firebase-admin');
const chalk = require('chalk');

// Create a router instance
const router = express.Router();

// Initialize Firebase Admin SDK
const serviceAccount = require('../echo-note-e2cfb-firebase-adminsdk-cphzj-3502f21c9b.json');
// Path to your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'echo-note-e2cfb.appspot.com/o' // Replace with your Firebase Storage bucket name
});

// Define function to fetch a song by its ID
router.get('/:songId', async (req, res) => {
  try {
    // Fetch the song ID from request parameters
    const { songId } = req.params;

    // Generate the file path based on the song ID
    const filePath = `/addSongs%2F${songId}.mp3`; // Adjust the file path as per your Firebase Storage structure

    // Get a reference to the file in Firebase Storage
    const fileRef = admin.storage().bucket().file(filePath);

    // Check if the file exists
    const exists = await fileRef.exists();
    if (!exists[0]) {
      throw new Error('File not found');
    }

    // Generate a signed URL for accessing the song from Firebase Storage
    const [songUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
    });

    // Redirect to the signed URL
    res.redirect(songUrl);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(chalk.red('Error fetching song:'), error);
    res.status(404).json({ error: 'Song not found' });
  }
});

// Export the router
module.exports = router;
