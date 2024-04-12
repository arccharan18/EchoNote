// Import necessary modules
const express = require('express');
const Song = require('../models/songModel');
const TopSong = require('../models/topSongsModel');
const NewRelease = require('../models/newReleasesModel');

// Create a router instance
const router = express.Router();

// Route to fetch all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch a single song by ID
// eslint-disable-next-line consistent-return
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/topsongs', async (req, res) => {
  try {
    // Query top songs from the database
    const topSongs = await TopSong.find();
    res.json(topSongs);
  } catch (error) {
    console.error('Error fetching top songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch new releases
router.get('/newreleases', async (req, res) => {
  try {
    // Query new releases from the database
    const newReleases = await NewRelease.find();
    res.json(newReleases);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
