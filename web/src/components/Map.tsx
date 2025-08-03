import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

export default function Map({
  user,
  buses,
  routes,
  locations,
  bookings,
  isDriver = false,
}: any) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Maps JS API if not loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !window.google) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: user?.lat || 0, lng: user?.lng || 0 },
        zoom: 13,
      });

      // User marker
      if (user?.lat && user?.lng) {
        new window.google.maps.Marker({
          position: { lat: user.lat, lng: user.lng },
          map,
          title: "You",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });
      }

      // Bus markers
      buses?.forEach((bus: any) => {
        if (bus.lat && bus.lng) {
          new window.google.maps.Marker({
            position: { lat: bus.lat, lng: bus.lng },
            map,
            title: `Bus ${bus.id}`,
            icon: "http://maps.google.com/mapfiles/ms/icons/bus.png",
          });
        }
      });

      // TODO: Draw routes, show bookings, etc.
    }
  }, [user, buses, routes, bookings]);

  return (
    <div className="w-full h-[400px] rounded shadow" ref={mapRef}>
      {/* Google Map renders here */}
    </div>
  );
}
