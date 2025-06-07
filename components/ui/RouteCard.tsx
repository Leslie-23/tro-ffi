import { colors } from "@/constants/colors";
import { Route } from "@/types";
import { Clock, MapPin, Users } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "./Card";

interface RouteCardProps {
  route: Route;
  onPress: (route: Route) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onPress }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  const formatCurrency = (amount: number) => {
    return `GHS ${amount}`;
  };

  return (
    <TouchableOpacity onPress={() => onPress(route)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.routeName}>{route.name}</Text>
          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>Fare</Text>
            <Text style={styles.fareAmount}>
              {formatCurrency(route.fare.current)}
            </Text>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <View style={styles.locationLine} />
            <View style={styles.locationDot} />
          </View>

          <View style={styles.locationDetails}>
            <View style={styles.location}>
              <Text style={styles.locationName}>
                {route.startLocation.name}
              </Text>
              <Text style={styles.locationAddress}>
                {route.startLocation.address}
              </Text>
            </View>

            <View style={styles.location}>
              <Text style={styles.locationName}>{route.endLocation.name}</Text>
              <Text style={styles.locationAddress}>
                {route.endLocation.address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.grey} />
            <Text style={styles.infoText}>
              {formatDuration(route.estimatedDuration)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={16} color={colors.grey} />
            <Text style={styles.infoText}>{route.distance} km</Text>
          </View>

          <View style={styles.infoItem}>
            <Users size={16} color={colors.grey} />
            <Text style={styles.infoText}>
              {Math.round(route.popularity * 100)}% full
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  fareContainer: {
    alignItems: "flex-end",
  },
  fareLabel: {
    fontSize: 12,
    color: colors.grey,
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  routeInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  locationContainer: {
    width: 20,
    alignItems: "center",
    marginRight: 12,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  locationDetails: {
    flex: 1,
  },
  location: {
    marginBottom: 12,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  locationAddress: {
    fontSize: 12,
    color: colors.grey,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: colors.grey,
    marginLeft: 4,
  },
});
