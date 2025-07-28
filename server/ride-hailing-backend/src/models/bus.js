const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    license_plate: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    current_occupancy: {
        type: Number,
        default: 0
    },
    driver_id: {
        type: String,
        ref: 'Driver'
    },
    operator_id: {
        type: String,
        required: true,
        ref: 'Operator'
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive'],
        default: 'active'
    },
    last_maintenance: {
        type: Date
    },
    next_maintenance: {
        type: Date
    },
    fuel_level: {
        type: Number,
        default: 0.00
    },
    current_latitude: {
        type: Number
    },
    current_longitude: {
        type: Number
    },
    image_url: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bus', busSchema);