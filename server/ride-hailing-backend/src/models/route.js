const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    start_location_id: {
        type: String,
        required: true,
        ref: 'Location'
    },
    end_location_id: {
        type: String,
        required: true,
        ref: 'Location'
    },
    distance: {
        type: Number,
        required: true
    },
    estimated_duration: {
        type: Number,
        required: true
    },
    base_fare: {
        type: Number,
        required: true
    },
    per_km_fare: {
        type: Number,
        required: true
    },
    current_fare: {
        type: Number,
        required: true
    },
    frequency_minutes: {
        type: Number,
        required: true
    },
    first_departure: {
        type: String,
        required: true
    },
    last_departure: {
        type: String,
        required: true
    },
    popularity: {
        type: Number,
        default: 0.00
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Route', routeSchema);