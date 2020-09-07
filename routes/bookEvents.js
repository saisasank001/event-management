
var express = require('express');
var router = express.Router();

var loadController = require('../controllers/bookEventController');

router.post('/createBooking',  loadController.createBooking);

router.get('/getBookings', loadController.getAllBookings);

module.exports = router;

