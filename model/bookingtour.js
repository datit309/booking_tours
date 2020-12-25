var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var BookingtourSchema = new mongoose.Schema({
    ID_User: { type: Schema.Types.ObjectId, ref: 'users' },
    ID_Tour: { type: Schema.Types.ObjectId, ref: 'tours' },
    Audult: Number,
    Available: Number,
    Children: Number,
    Total: Number,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}, {
    collection: 'bookingtour'
});


//Export function to create "UserSchema" model class
module.exports = mongoose.model('bookingtour', BookingtourSchema);