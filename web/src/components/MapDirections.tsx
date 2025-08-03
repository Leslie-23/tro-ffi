import React, { useEffect, useRef, useState } from "react";

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyB9CqQrp2hitBlalM9jYDOYwknZ-dxDclM";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface LatLng {
  lat: number;
  lng: number;
}

const defaultFrom: LatLng = { lat: 6.5244, lng: 3.3792 }; // Lagos
const defaultTo: LatLng = { lat: 6.465422, lng: 3.406448 }; // Example destination

const MapDirections: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState<LatLng>(defaultFrom);
  const [to, setTo] = useState<LatLng>(defaultTo);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    }
    // eslint-disable-next-line
  }, []);

  // Update route when from/to changes
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
    }
    // eslint-disable-next-line
  }, [from, to]);

  function initMap() {
    if (!mapRef.current || !window.google) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: from,
      zoom: 13,
    });

    // Markers
    const fromMarker = new window.google.maps.Marker({
      position: from,
      map,
      label: "From ",
      draggable: true,
    });
    const toMarker = new window.google.maps.Marker({
      position: to,
      map,
      label: "To",
      draggable: true,
    });

    fromMarker.addListener("dragend", (e: any) => {
      setFrom({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });
    toMarker.addListener("dragend", (e: any) => {
      setTo({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });

    // Directions
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
        } else {
          setDistance("");
          setDuration("");
        }
      }
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            From (lat, lng):
          </label>
          <input
            type="text"
            value={`${from.lat},${from.lng}`}
            onChange={(e) => {
              const [lat, lng] = e.target.value.split(",").map(Number);
              setFrom({ lat: lat || 0, lng: lng || 0 });
            }}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            To (lat, lng):
          </label>
          <input
            type="text"
            value={`${to.lat},${to.lng}`}
            onChange={(e) => {
              const [lat, lng] = e.target.value.split(",").map(Number);
              setTo({ lat: lat || 0, lng: lng || 0 });
            }}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>
      <div ref={mapRef} className="w-full h-[400px] rounded shadow" />
      <div className="mt-4">
        <span className="font-semibold">Distance:</span> {distance || "-"}
        <span className="ml-6 font-semibold">Duration:</span> {duration || "-"}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Drag the markers or enter coordinates to update route.
      </div>
    </div>
  );
};

export default MapDirections;
