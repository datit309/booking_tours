var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var TourSchema = new mongoose.Schema({
    TourName: String,
    TourDescription: String,
    TourDuration: String, // thoi gian o
    TourDeparture: String, // diem khoi hanh
    TourTransportation: String, // phuong tien di chuyen
    TourArea: { type: Schema.Types.ObjectId, ref: 'areas' },
    TourPolicy: String,
    TourImages: Array,
    TourDetail: [{ type: Schema.Types.ObjectId, ref: 'tourdetails' }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}, {
    collection: 'tours'
});


//Export function to create "UserSchema" model class
module.exports = mongoose.model('tours', TourSchema);