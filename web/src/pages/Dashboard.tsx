import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingDetails from "../components/BookingDetails";
import BookingForm from "../components/BookingForm";
import DriverPanel from "../components/DriverPanel";
import Map from "../components/Map";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user info and data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [userRes, routesRes, busesRes, locationsRes, bookingsRes] =
          await Promise.all([
            axios.get("/api/user/me"),
            axios.get("/api/routes"),
            axios.get("/api/buses"),
            axios.get("/api/locations"),
            axios.get("/api/bookings/me"),
          ]);
        setUser(Array.isArray(userRes.data) ? userRes.data[0] : userRes.data);
        setRoutes(
          Array.isArray(routesRes.data) ? routesRes.data : routesRes.data
        );
        setBuses(Array.isArray(busesRes.data) ? busesRes.data : busesRes.data);
        setLocations(
          Array.isArray(locationsRes.data)
            ? locationsRes.data
            : locationsRes.data
        );
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      } catch (err) {
        // handle error, maybe redirect to login
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  // DRIVER DASHBOARD
  if (user?.is_driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4 bg-[#32bb78] text-white font-bold text-xl shadow">
          Driver Dashboard
        </header>
        <main className="flex-1 flex flex-col md:flex-row">
          <section className="w-full md:w-2/3 p-4">
            <Map
              user={user}
              buses={buses}
              routes={routes}
              locations={locations}
              bookings={bookings}
              isDriver
            />
          </section>
          <aside className="w-full md:w-1/3 p-4">
            <DriverPanel
              user={user}
              bookings={bookings}
              routes={routes}
              onBookingSelect={setSelectedBooking}
            />
            {selectedBooking && (
              <BookingDetails
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                isDriver
              />
            )}
          </aside>
        </main>
      </div>
    );
  }

  // RIDER DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-[#32bb78] text-white font-bold text-xl shadow">
        Bus Booking Dashboard
      </header>
      <main className="flex-1 flex flex-col md:flex-row">
        <section className="w-full md:w-2/3 p-4">
          <Map
            user={user}
            buses={buses}
            routes={routes}
            locations={locations}
            bookings={bookings}
          />
        </section>
        <aside className="w-full md:w-1/3 p-4 space-y-6">
          <BookingForm
            user={user}
            routes={routes}
            buses={buses}
            locations={locations}
            onBookingCreated={(booking: any) =>
              setBookings((prev) => [...prev, booking])
            }
          />
          <div>
            <h2 className="text-lg font-semibold mb-2">Your Bookings</h2>
            <div className="space-y-2">
              {bookings.length === 0 && (
                <div className="text-gray-500 text-sm">No bookings yet.</div>
              )}
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded shadow p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="font-medium">
                    Route: {booking.route_id} | Bus: {booking.bus_id}
                  </div>
                  <div className="text-xs text-gray-500">
                    Pickup: {booking.pickup_time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedBooking && (
            <BookingDetails
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
            />
          )}
        </aside>
      </main>
    </div>
  );
}
