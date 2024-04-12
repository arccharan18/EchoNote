const express = require('express');
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');

const router = express.Router(); // Create an Express router

// Load environment variables from .env file
dotenv.config();

const serviceAccount = require('./echo-note-e2cfb-firebase-adminsdk-cphzj-0ef1e45c72.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Define API endpoint to fetch a song by its ID
router.get('/:songId', async (req, res) => {
  try {
    // Fetch the song ID from request parameters
    const { songId } = req.params;

    // Generate a signed URL for accessing the song from Firebase Storage
    const [songUrl] = await firebaseAdmin.storage().bucket().file(`songs/${songId}`).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
    });

    // Return the song URL to the client
    res.json({ songUrl });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

module.exports = router; // Export the router for use in other files
