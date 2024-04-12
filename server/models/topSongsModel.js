// topSongsModel.js
const { Schema, model } = require('mongoose');

const topSongsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A song must have a name'],
    trim: true,
    unique: true,
    minlength: [3, 'Song name must be more than 3 characters'],
    maxlength: [30, 'Song name must be at most 30 characters'],
  },
  artist: {
    type: String,
    required: [true, 'A song must belong to an artist'],
  },
  song: {
    type: String,
    required: [true, 'A song must have a song file'],
  },
  img: {
    type: String,
    required: [true, 'A song must have a cover img'],
  },
  plays: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TopSongs = model('TopSongs', topSongsSchema);

module.exports = TopSongs;
