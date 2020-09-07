
var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var dbSchema = new Schema({
    eventId:{
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPhoneNumber: {
        type: Number,
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true
    },
    createdAt:{
        type: String,
        required: true
    },
    attendees:{
        type: Object,
        required: true
    }

});


// Export the model
module.exports = mongoose.model('book-event', dbSchema);

