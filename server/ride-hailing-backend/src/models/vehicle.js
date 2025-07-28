const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: String,
        enum: ['car', 'bus'],
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
        ref: 'Operator',
        required: true
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
    current_location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;