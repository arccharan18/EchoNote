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

const app = express();

// Enable CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://maqsud-spotify.vercel.app',
    credentials: true,
  })
);

// Set security HTTP headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Parse cookies
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serve static files
app.use('/public', express.static('public'));

// Route handlers
app.use('/api/v1/songs', songRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/search', searchRouter);

// Root route handler
app.get('/', (req, res) => {
  res.status(200).send('Welcome to EchoNote');
});

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
