// addTopSongs.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const TopSongs = require('./models/topSongsModel');

const topSongsDirectory = 'C:/Desktop/EchoNote/server/addSongs/top-songs';

const readFilesFromDirectory = (directory) => new Promise((resolve, reject) => {
  fs.readdir(directory, (error, files) => {
    if (error) {
      reject(error);
    } else {
      resolve(files);
    }
  });
});

const addTopSongsToDatabase = async () => {
  try {
    const songFiles = await readFilesFromDirectory(topSongsDirectory);

    const topSongsData = songFiles.map((file) => ({
      name: path.basename(file, path.extname(file)).substring(0, 30),
      artist: 'Unknown',
      song: path.join(topSongsDirectory, file),
      img: 'default_image_url.jpg',
      plays: 0,
    }));

    const insertedTopSongs = await TopSongs.insertMany(topSongsData);
    console.log('Top songs added to database:', insertedTopSongs);
  } catch (error) {
    console.error('Error adding top songs to database:', error);
  }
};

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    addTopSongsToDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
