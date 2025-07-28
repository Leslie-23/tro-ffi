const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class RouteStop extends Model {}

RouteStop.init({
    route_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
            model: 'routes',
            key: 'id'
        }
    },
    location_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id'
        }
    },
    stop_order: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RouteStop',
    tableName: 'route_stops',
    timestamps: false
});

module.exports = RouteStop;