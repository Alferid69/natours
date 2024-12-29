const express = require('express');
const {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect, restrictTo('adming', 'lead-guide'))

router.post('/', createBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/', getAllBookings);
router.get('/:id', getBooking);


module.exports = router;