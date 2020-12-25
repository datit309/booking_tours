var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var TourdetailSchema = new mongoose.Schema({
    Date: String,
    Time: String,
    Discount: [{
        name: String,
        description: String,
        code: String
    }],
    Available: Number,
    Price: Number,
    PriceChildren: Number,
    Booked: Number,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}, {
    collection: 'tourdetails'
});


//Export function to create "UserSchema" model class
module.exports = mongoose.model('tourdetails', TourdetailSchema);