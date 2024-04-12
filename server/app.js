const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const songRouter = require('./routes/songRoutes');
const userRouter = require('./routes/userRoutes');
const playlistRouter = require('./routes/playlistRoutes');
const searchRouter = require('./routes/searchRoutes');
const fbSongsRouter = require('./routes/firebaseroute'); // Import Firebase songs router
const spotifyAuthRouter = require('./spotifyAuth'); // Import Spotify authentication router

const app = express();

// Middleware setup
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// CORS setup
app.use(
  cors({
<<<<<<< HEAD
    origin: ['http://localhost:5173', 'https://echo-note-woad.vercel.app'],
=======
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://echo-note-woad.vercel.app',
>>>>>>> 0010eae1af5f8a2d0c042fb45a2fd8009ee0d766
    credentials: true,
  })
);

// Serve static files
app.use('/public', express.static('public'));

// Route to handle Spotify authentication callback
// eslint-disable-next-line consistent-return
app.get('/', (req, res, next) => {
  const { code } = req.query;
  if (code) {
    // If code parameter is present, redirect to Spotify authentication callback route
    return res.redirect(`/auth/callback?code=${code}`);
  }
  // Otherwise, continue to serve the welcome message
  res.status(200).send('Welcome to EchoNote');
});

// Route to handle successful authentication callback
app.get('/success', (req, res) => {
  // eslint-disable-next-line camelcase
  const { access_token } = req.query;
  // eslint-disable-next-line camelcase
  res.status(200).send(`Authentication successful! Access token: ${access_token}`);
});

// Mount Spotify authentication router
app.use('/auth', spotifyAuthRouter);

// Routes setup
app.use('/api/v1/songs', songRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/search', searchRouter);

// Mount Firebase songs router
app.use('/api/v1/firebase-songs', fbSongsRouter);

// Error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
