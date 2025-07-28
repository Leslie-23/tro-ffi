const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Operator extends Model {}

Operator.init({
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    fleet_size: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0.0
    },
    commission: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    contact_person: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Operator',
    tableName: 'operators',
    timestamps: false
});

module.exports = Operator;