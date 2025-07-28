const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Carpool extends Model {}

Carpool.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    route_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'routes',
            key: 'id',
        },
    },
    bus_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'buses',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    pickup_location_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id',
        },
    },
    dropoff_location_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id',
        },
    },
    pickup_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    passenger_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Carpool',
    tableName: 'carpools',
    timestamps: false,
});

module.exports = Carpool;