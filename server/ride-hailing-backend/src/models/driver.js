const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    license_number: {
        type: String,
        required: true,
        unique: true
    },
    license_expiry: {
        type: Date,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0.0
    },
    total_trips: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['available', 'on_trip', 'offline'],
        default: 'available'
    },
    verification_status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Driver', driverSchema);