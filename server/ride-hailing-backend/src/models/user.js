const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    phone: {
        type: String,
        maxlength: 255
    },
    email: {
        type: String,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 512
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    profile_image: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0.0,
        min: 0.0,
        max: 5.0
    },
    ride_count: {
        type: Number,
        default: 0
    },
    is_driver: {
        type: Boolean,
        default: false
    },
    preferred_language: {
        type: String,
        default: 'en',
        maxlength: 10
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    provider: {
        type: String,
        maxlength: 20
    },
    google_id: {
        type: String,
        maxlength: 256
    }
});

module.exports = mongoose.model('User', userSchema);