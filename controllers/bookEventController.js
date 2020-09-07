
var loadModel = require('../model/bookEvent');

exports.createBooking = function (req, res) {

    let data={
        eventId : req.body.eventId,
        userEmail : req.body.email,
        userPhoneNumber : req.body.phoneNumber,
        noOfSeats : req.body.noOfSeats,
        createdAt : req.body.createdAt,
        attendees : req.body.attendees,
    };

    loadModel.create(data, function (err, data) {
        if (!err) {
            res.send({
                success: true,
                successMessage: "Event created successfully"
            })
        } else {
            res.send({
                success: false,
                message: "Unable to create event, Please check given inputs"
            })
        }
    });
}

exports.getAllBookings = function (req, res) {
    loadModel.find({}, function (err, data) {
        if (!err) {
            res.send({
                success: true,
                data
            })
        } else {
            res.send({
                success: false,
                message: "Unable to fetch events, Please try again after sometime"
            })
        }
    });
}