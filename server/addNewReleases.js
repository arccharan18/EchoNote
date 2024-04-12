// addNewReleases.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const NewReleases = require('./models/newReleasesModel');

const newReleasesDirectory = 'C:/Desktop/EchoNote/server/addSongs/new-releases';

const readFilesFromDirectory = (directory) => new Promise((resolve, reject) => {
  fs.readdir(directory, (error, files) => {
    if (error) {
      reject(error);
    } else {
      resolve(files);
    }
  });
});

const addNewReleasesToDatabase = async () => {
  try {
    const songFiles = await readFilesFromDirectory(newReleasesDirectory);

    const newReleasesData = songFiles.map((file) => ({
      name: path.basename(file, path.extname(file)).substring(0, 30),
      artist: 'Unknown',
      song: path.join(newReleasesDirectory, file),
      img: 'default_image_url.jpg',
      plays: 0,
    }));

    const insertedNewReleases = await NewReleases.insertMany(newReleasesData);
    console.log('New releases added to database:', insertedNewReleases);
  } catch (error) {
    console.error('Error adding new releases to database:', error);
  }
};

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    addNewReleasesToDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
