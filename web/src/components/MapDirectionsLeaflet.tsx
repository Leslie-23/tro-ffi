"use client";

import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import { Clock, Loader2, MapPin, Navigation, Route } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

// @ts-ignore
import "leaflet-routing-machine";

interface LatLng {
  lat: number;
  lng: number;
}

const defaultFrom: LatLng = { lat: 6.5244, lng: 3.3792 }; // Lagos
const defaultTo: LatLng = { lat: 6.465422, lng: 3.406448 }; // Destination

// Geocode address using OpenStreetMap Nominatim
const geocodeAddress = async (address: string): Promise<LatLng | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: Number.parseFloat(data[0].lat),
        lng: Number.parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const MapView = ({
  from,
  to,
  onFromDrag,
  onToDrag,
  setDistance,
  setDuration,
  mapError,
  setMapError,
}: {
  from: LatLng;
  to: LatLng;
  onFromDrag: (pos: LatLng) => void;
  onToDrag: (pos: LatLng) => void;
  setDistance: (d: string) => void;
  setDuration: (d: string) => void;
  mapError: string | null;
  setMapError: (e: string | null) => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const fromMarkerRef = useRef<L.Marker | null>(null);
  const toMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map instance
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Create map
    const map = L.map(mapRef.current).setView([from.lat, from.lng], 13);
    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add draggable markers
    const fromMarker = L.marker([from.lat, from.lng], {
      draggable: true,
      icon: L.icon({
        iconUrl:
          "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
      title: "From",
    }).addTo(map);
    fromMarker.bindPopup("From").openPopup();
    fromMarker.on("dragend", (e: any) => {
      const pos = e.target.getLatLng();
      onFromDrag({ lat: pos.lat, lng: pos.lng });
    });
    fromMarkerRef.current = fromMarker;

    const toMarker = L.marker([to.lat, to.lng], {
      draggable: true,
      icon: L.icon({
        iconUrl:
          "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
      title: "To",
    }).addTo(map);
    toMarker.bindPopup("To").openPopup();
    toMarker.on("dragend", (e: any) => {
      const pos = e.target.getLatLng();
      onToDrag({ lat: pos.lat, lng: pos.lng });
    });
    toMarkerRef.current = toMarker;

    // Routing
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // @ts-ignore
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      show: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        addWaypoints: false,
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null, // Hide default markers
    })
      .on("routesfound", function (e: any) {
        setMapError(null);
        const route = e.routes[0];
        if (route && route.summary) {
          setDistance((route.summary.totalDistance / 1000).toFixed(2) + " km");
          const mins = Math.round(route.summary.totalTime / 60);
          setDuration(`${mins} min`);
        }
      })
      .on("routingerror", function (e: any) {
        setMapError("Could not find a route between these points.");
        setDistance("-");
        setDuration("-");
      })
      .addTo(map);

    routingControlRef.current = routingControl;

    // Clean up on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [from, to]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-gray-200 shadow"
      id="leaflet-map"
    />
  );
};

export default function MapDirectionsLeaflet() {
  const [from, setFrom] = useState<LatLng>(defaultFrom);
  const [to, setTo] = useState<LatLng>(defaultTo);
  const [distance, setDistance] = useState<string>("-");
  const [duration, setDuration] = useState<string>("-");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFrom({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        (err) => {
          setError("Could not get current location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  }, []);
  // Handle manual input for from/to
  const handleLocationInput = async (value: string, isFrom: boolean) => {
    if (!value.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (value.includes(",")) {
        const [lat, lng] = value.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          if (isFrom) {
            setFrom({ lat, lng });
          } else {
            setTo({ lat, lng });
          }
        } else {
          setError("Invalid coordinates format");
        }
      } else {
        const coords = await geocodeAddress(value);
        if (coords) {
          if (isFrom) {
            setFrom(coords);
          } else {
            setTo(coords);
          }
        } else {
          setError("Location not found");
        }
      }
    } catch (err) {
      setError("Error processing location");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFrom({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => {
          setError("Could not get current location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);

    const tempInput = fromInput;
    setFromInput(toInput);
    setToInput(tempInput);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Interactive Route Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || mapError) && (
            <Alert>
              <AlertDescription>{error || mapError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-input" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                From
              </Label>
              <div className="flex gap-2">
                <Input
                  id="from-input"
                  placeholder="Enter address or lat,lng"
                  value={fromInput}
                  onChange={(e) => setFromInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLocationInput(fromInput, true);
                    }
                  }}
                  onBlur={() => handleLocationInput(fromInput, true)}
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={loading}
                  title="Use current location"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {from.lat.toFixed(4)}, {from.lng.toFixed(4)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-input" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                To
              </Label>
              <div className="flex gap-2">
                <Input
                  id="to-input"
                  placeholder="Enter address or lat,lng"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLocationInput(toInput, false);
                    }
                  }}
                  onBlur={() => handleLocationInput(toInput, false)}
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapLocations}
                  title="Swap locations"
                  disabled={loading}
                >
                  <Route className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {to.lat.toFixed(4)}, {to.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <MapView
            from={from}
            to={to}
            onFromDrag={setFrom}
            onToDrag={setTo}
            setDistance={setDistance}
            setDuration={setDuration}
            mapError={mapError}
            setMapError={setMapError}
          />

          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Distance:</span>
              <span className="font-mono">
                {distance === "-" ? "-" : `${distance}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Duration:</span>
              <span className="font-mono">
                {duration === "-" ? "-" : `${duration}`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              💡 <strong>How to use:</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Drag the markers on the map to adjust locations</li>
              <li>• Enter addresses or coordinates in the input fields</li>
              <li>• Use the location button to get your current position</li>
              <li>• Click the swap button to reverse the route</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
