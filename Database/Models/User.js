const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    DPurl: {
        type: String,
        // required: true
    },
    Notifications:{
        type: Array,
        
    },
    followers:{
        type: Array,
    },
    following:{
        type: Array,
    },
    bio:{
        type: String,
    },
    posts:{
        type: Array,
        ref: 'Post',
        default: []
    },
    OTP:{
type: String,
    }

},
{timestamps: true}
);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;