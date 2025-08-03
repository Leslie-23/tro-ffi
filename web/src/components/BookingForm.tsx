import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function BookingForm({
  user,
  routes,
  buses,
  locations,
  onBookingCreated,
}: any) {
  const [form, setForm] = useState({
    route_id: "",
    bus_id: "",
    pickup_location_id: "",
    dropoff_location_id: "",
    pickup_time: "",
    fare: "",
    payment_method: "1",
    passenger_count: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_id: user?.id,
          fare: Number(form.fare),
          passenger_count: Number(form.passenger_count),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onBookingCreated(data);
        setForm({
          route_id: "",
          bus_id: "",
          pickup_location_id: "",
          dropoff_location_id: "",
          pickup_time: "",
          fare: "",
          payment_method: "1",
          passenger_count: 1,
        });
      } else {
        alert(data.message || "Booking failed");
      }
    } catch {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-3 bg-white p-4 rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold mb-2">Book a Bus</h2>
      <div>
        <Label>Route</Label>
        <select
          name="route_id"
          value={form.route_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select route</option>
          {(Array.isArray(routes) ? routes : []).map((r: any) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Bus</Label>
        <select
          name="bus_id"
          value={form.bus_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select bus</option>
          {(Array.isArray(buses) ? buses : []).map((b: any) => (
            <option key={b.id} value={b.id}>
              {b.name || b.id}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Pickup Location</Label>
        <select
          name="pickup_location_id"
          value={form.pickup_location_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select pickup</option>
          {(Array.isArray(locations) ? locations : []).map((l: any) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Dropoff Location</Label>
        <select
          name="dropoff_location_id"
          value={form.dropoff_location_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select dropoff</option>
          {locations.map((l: any) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Pickup Time</Label>
        <Input
          type="datetime-local"
          name="pickup_time"
          value={form.pickup_time}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Fare</Label>
        <Input
          type="number"
          name="fare"
          value={form.fare}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div>
        <Label>Passengers</Label>
        <Input
          type="number"
          name="passenger_count"
          value={form.passenger_count}
          onChange={handleChange}
          min={1}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#32bb78] text-white"
      >
        {loading ? "Booking..." : "Book Now"}
      </Button>
    </form>
  );
}
