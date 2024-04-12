const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const router = express.Router();

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: 'db4a84518b5a4ba1b9225d32b4c809ed',
  clientSecret: '783e3f661bd54a7b964c6239432f37fb',
  redirectUri: 'http://localhost:8000' // Specify your redirect URI
});

// Redirect to Spotify authorization page
router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email']; // Add required scopes
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Callback route to handle successful authentication
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    // Use dynamic import for node-fetch
    const fetch = await import('node-fetch');

    const data = await spotifyApi.authorizationCodeGrant(code);
    // eslint-disable-next-line camelcase
    const { access_token, refresh_token } = data.body;

    // Set access token for future requests
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect('/success'); // Redirect to success page
  } catch (error) {
    console.error('Error authenticating with Spotify:', error);
    res.redirect('/error'); // Redirect to error page
  }
});

// Route to handle authentication errors
router.get('/error', (req, res) => {
  res.send('Authentication failed. Please try again.');
});

// Route to handle successful authentication
router.get('/success', (req, res) => {
  res.send('Authentication successful!');
});

// Middleware to check if access token is set and refresh if needed
const checkAccessToken = async (req, res, next) => {
  if (!spotifyApi.getAccessToken()) {
    res.redirect('/login'); // Redirect to login if access token is not set
  } else {
    // Check if access token is expired and refresh if needed
    const data = await spotifyApi.refreshAccessToken();
    // eslint-disable-next-line camelcase
    const { access_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    next();
  }
};

// Fetch Spotify songs
router.get('/spotify-songs', checkAccessToken, async (req, res) => {
  try {
    // Fetch songs from Spotify API
    const response = await spotifyApi.getRecommendations({ limit: 5 });

    // Extract relevant song data from the response
    const songs = response.body.tracks.map((item) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(', ')
    }));

    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs from Spotify:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
