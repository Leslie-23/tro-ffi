import React from "react";
import { Button } from "./ui/button";

export default function BookingDetails({
  booking,
  onClose,
  isDriver = false,
}: any) {
  if (!booking) return null;
  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Booking Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          &times;
        </button>
      </div>
      <div className="text-sm space-y-1">
        <div>
          <span className="font-medium">Route:</span> {booking.route_id}
        </div>
        <div>
          <span className="font-medium">Bus:</span> {booking.bus_id}
        </div>
        <div>
          <span className="font-medium">Pickup:</span>{" "}
          {booking.pickup_location_id}
        </div>
        <div>
          <span className="font-medium">Dropoff:</span>{" "}
          {booking.dropoff_location_id}
        </div>
        <div>
          <span className="font-medium">Time:</span> {booking.pickup_time}
        </div>
        <div>
          <span className="font-medium">Fare:</span> ${booking.fare}
        </div>
        <div>
          <span className="font-medium">Passengers:</span>{" "}
          {booking.passenger_count}
        </div>
      </div>
      {!isDriver && (
        <Button className="mt-4 w-full bg-[#32bb78] text-white">
          Edit Booking
        </Button>
      )}
    </div>
  );
}
