const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    route_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "routes",
        key: "id",
      },
    },
    bus_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "buses",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
    },
    pickup_location_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "locations",
        key: "id",
      },
    },
    dropoff_location_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "locations",
        key: "id",
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
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("mobile_money", "card", "cash"),
      allowNull: false,
    },
    passenger_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_group_booking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Booking;
