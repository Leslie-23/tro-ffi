import React from "react";
import { Button } from "./ui/button";

export default function DriverPanel({
  user,
  bookings,
  routes,
  onBookingSelect,
}: any) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Assigned Bookings</h2>
      {bookings.length === 0 && (
        <div className="text-gray-500 text-sm">No assignments yet.</div>
      )}
      <div className="space-y-2">
        {bookings.map((booking: any) => (
          <div
            key={booking.id}
            className="bg-gray-100 rounded p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => onBookingSelect(booking)}
          >
            <div className="font-medium">
              Route: {booking.route_id} | Passengers: {booking.passenger_count}
            </div>
            <div className="text-xs text-gray-500">
              Pickup: {booking.pickup_time}
            </div>
            <Button className="mt-2 w-full bg-[#32bb78] text-white">
              Mark Segment Complete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
