var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
    Username: {
        Unique: true,
        type: String
    },
    Password: String,
    FirstName: String,
    LastName: String,
    Email: {
        Unique: true,
        type: String
    },
    PhoneNumber: String,
    Roles: {
        type: String,
        default: "User",
    },
    Token: {
        access_token: String,
        refresh_token: String
    },
    IsBlock: Boolean
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}, {
    collection: 'user'
});
// comparePassword
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password)
}

//Export function to create "UserSchema" model class
module.exports = mongoose.model('User', UserSchema);