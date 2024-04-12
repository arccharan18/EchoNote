// Load environment variables from .env file
require('dotenv').config();

// Import firebase-admin
const admin = require('firebase-admin');

// Your Firebase service account configuration
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase Admin SDK with bucket name
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'echo-note-e2cfb.appspot.com'
});

// Access Firebase Storage
const storage = admin.storage();

// Define function to fetch a song by its ID
const getSongUrl = async (req, res, next) => {
  try {
    // Fetch the folder and song ID from request parameters
    const { folder, songId } = req.params;

    // Generate the file path based on the folder and song ID
    const filePath = `${folder}/${songId}`;

    // Generate a signed URL for accessing the song from Firebase Storage
    const [songUrl] = await admin.storage().bucket().file(filePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
    });

    // Redirect to the signed URL
    res.redirect(songUrl);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
};

module.exports = getSongUrl;
