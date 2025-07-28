const { User } = require("../models/user");
const { Driver } = require("../models/driver");
const { Booking } = require("../models/booking");
const { Carpool } = require("../models/carpool");
const { Location } = require("../models/location");
const { Op } = require("sequelize");

class MatchingService {
  async findAvailableDrivers(pickupLocationId, dropoffLocationId) {
    const pickupLocation = await Location.findByPk(pickupLocationId);
    const dropoffLocation = await Location.findByPk(dropoffLocationId);

    if (!pickupLocation || !dropoffLocation) {
      throw new Error("Invalid pickup or dropoff location");
    }

    const availableDrivers = await Driver.findAll({
      where: {
        status: "available",
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "phone", "email"],
        },
      ],
    });

    return availableDrivers;
  }

  async matchRiderWithDriver(riderId, pickupLocationId, dropoffLocationId) {
    const availableDrivers = await this.findAvailableDrivers(
      pickupLocationId,
      dropoffLocationId
    );

    if (availableDrivers.length === 0) {
      throw new Error("No available drivers found");
    }

    const selectedDriver = availableDrivers[0]; // Simple selection logic, can be improved

    const booking = await Booking.create({
      user_id: riderId,
      driver_id: selectedDriver.id,
      pickup_location_id: pickupLocationId,
      dropoff_location_id: dropoffLocationId,
      status: "pending",
      fare: this.calculateFare(pickupLocationId, dropoffLocationId),
      pickup_time: new Date(),
    });

    return {
      booking,
      driver: selectedDriver,
    };
  }

  calculateFare(pickupLocationId, dropoffLocationId) {
    // Implement fare calculation logic based on distance, vehicle type, etc.
    return 10.0; // Placeholder fare
  }

  async createCarpoolRequest(
    userId,
    pickupLocationId,
    dropoffLocationId,
    passengerCount
  ) {
    const carpoolRequest = await Carpool.create({
      user_id: userId,
      pickup_location_id: pickupLocationId,
      dropoff_location_id: dropoffLocationId,
      passenger_count: passengerCount,
      status: "open",
    });

    return carpoolRequest;
  }

  async findCarpoolMatches(carpoolRequestId) {
    const carpoolRequest = await Carpool.findByPk(carpoolRequestId);

    if (!carpoolRequest) {
      throw new Error("Carpool request not found");
    }

    const potentialMatches = await Carpool.findAll({
      where: {
        status: "open",
        pickup_location_id: carpoolRequest.pickup_location_id,
        dropoff_location_id: carpoolRequest.dropoff_location_id,
        passenger_count: {
          [Op.lte]: carpoolRequest.passenger_count,
        },
      },
    });

    return potentialMatches;
  }
}

module.exports = new MatchingService();
