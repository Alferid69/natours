const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression')

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // will be used to store the templates

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(helmet());

// Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too may request from this IP! Please try again in an hour.',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // liimits the amount of data sent inside the body
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parse data from url when using action of html form
app.use(cookieParser());

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  }),
);

app.use(compression())

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies)
  next();
});

// 3) ROUTES
// mounting the routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// an automatically recognized global error handler
app.use(globalErrorHandler);

module.exports = app;
