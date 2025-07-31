import { Bus, Location } from "@/types";
import { MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/Colors";
import { Card } from "./Card";

interface BusTrackerProps {
  bus: Bus;
  destination: Location;
  estimatedArrival: string;
}

export const BusTracker: React.FC<BusTrackerProps> = ({
  bus,
  destination,
  estimatedArrival,
}) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [distance, setDistance] = useState("");

  useEffect(() => {
    // Simulate bus movement
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.005;
        return newProgress > 1 ? 1 : newProgress;
      });
    }, 1000);

    // Calculate remaining time
    const arrivalTime = new Date(estimatedArrival);
    const now = new Date();
    const diffMs = arrivalTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins <= 0) {
      setRemainingTime("Arriving now");
    } else if (diffMins < 60) {
      setRemainingTime(`${diffMins} min`);
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      setRemainingTime(`${hours} hr ${mins} min`);
    }

    // Simulate distance calculation
    setDistance("2.3 km");

    return () => clearInterval(interval);
  }, [estimatedArrival]);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus Tracker</Text>
        <Text style={styles.busInfo}>
          {bus.name} • {bus.licensePlate}
        </Text>
      </View>

      <View style={styles.trackerContainer}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>

          <View style={styles.locationMarkers}>
            <View style={styles.startMarker}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.markerLabel}>Start</Text>
            </View>

            <View
              style={[
                styles.busMarker,
                { left: `${Math.min(Math.max(0, progress * 100), 100)}%` },
              ]}
            />

            <View style={styles.endMarker}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.markerLabel}>Destination</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estimated Arrival</Text>
            <Text style={styles.infoValue}>{remainingTime}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{distance}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Destination</Text>
            <Text style={styles.infoValue}>{destination.name}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  busInfo: {
    fontSize: 14,
    color: colors.grey,
  },
  trackerContainer: {
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  locationMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  startMarker: {
    alignItems: "center",
  },
  endMarker: {
    alignItems: "center",
  },
  busMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    position: "absolute",
    transform: [{ translateX: -8 }],
  },
  markerLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
