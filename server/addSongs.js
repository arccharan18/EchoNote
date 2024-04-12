require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Song = require('./models/songModel');

// Directory where song files are located
const songsDirectory = 'C:/Desktop/EchoNote/server/addSongs';

// Function to read files from a directory
const readFilesFromDirectory = (directory) => new Promise((resolve, reject) => {
  fs.readdir(directory, (error, files) => {
    if (error) {
      reject(error);
    } else {
      resolve(files);
    }
  });
});

// Function to add songs to database
const addSongsToDatabase = async () => {
  try {
    // Read files from directory
    const songFiles = await readFilesFromDirectory(songsDirectory);

    // Create documents for each song and insert into database
    const songsData = songFiles.map((file) => ({
      name: path.basename(file, path.extname(file)).substring(0, 30), // Truncate to 30 characters
      artist: 'Unknown',
      song: path.join(songsDirectory, file),
      img: 'default_image_url.jpg',
      plays: 0,
    }));

    // Insert songs into database
    const insertedSongs = await Song.insertMany(songsData);
    console.log('Songs added to database:', insertedSongs);
  } catch (error) {
    console.error('Error adding songs to database:', error);
  }
};

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Call function to add songs to database
    addSongsToDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
