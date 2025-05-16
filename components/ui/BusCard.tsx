import { colors } from "@/constants/colors";
import { Bus } from "@/types";
import { Fuel, User } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "./Card";

interface BusCardProps {
  bus: Bus;
  onPress?: (bus: Bus) => void;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success;
      case "maintenance":
        return colors.warning;
      default:
        return colors.error;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const occupancyPercentage = (bus.currentOccupancy / bus.capacity) * 100;

  const handlePress = () => {
    if (onPress) {
      onPress(bus);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={!onPress}>
      <Card style={styles.card}>
        {bus.imageUrl && (
          <Image
            source={{ uri: bus.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.busName}>{bus.name}</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(bus.status) },
                ]}
              />
              <Text style={styles.statusText}>{getStatusText(bus.status)}</Text>
            </View>
          </View>

          <Text style={styles.licensePlate}>{bus.licensePlate}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <User size={16} color={colors.inactive} />
              <Text style={styles.infoText}>
                {bus.currentOccupancy}/{bus.capacity} seats
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Fuel size={16} color={colors.inactive} />
              <Text style={styles.infoText}>
                {Math.round(bus.fuelLevel * 100)}% fuel
              </Text>
            </View>
          </View>

          <View style={styles.occupancyContainer}>
            <View style={styles.occupancyBar}>
              <View
                style={[
                  styles.occupancyFill,
                  { width: `${occupancyPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.occupancyText}>
              {Math.round(occupancyPercentage)}% occupied
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  busName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: colors.text,
  },
  licensePlate: {
    fontSize: 14,
    color: colors.inactive,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  occupancyContainer: {
    marginTop: 4,
  },
  occupancyBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  occupancyFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  occupancyText: {
    fontSize: 12,
    color: colors.inactive,
    textAlign: "right",
  },
});
