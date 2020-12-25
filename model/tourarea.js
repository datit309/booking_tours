var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var AreaSchema = new mongoose.Schema({
    AreaName: String,
    AreaDescription: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}, {
    collection: 'areas'
});


//Export function to create "UserSchema" model class
module.exports = mongoose.model('areas', AreaSchema);