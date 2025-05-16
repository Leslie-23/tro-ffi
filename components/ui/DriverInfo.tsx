import { colors } from "@/constants/colors";
import { mockUsers } from "@/mocks/data";
import { Driver } from "@/types";
import { MessageCircle, Phone, Star } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "./Card";

interface DriverInfoProps {
  driver: Driver;
  onCall?: () => void;
  onMessage?: () => void;
}

export const DriverInfo: React.FC<DriverInfoProps> = ({
  driver,
  onCall,
  onMessage,
}) => {
  // Find the user data for this driver
  const driverUser = mockUsers.find((user) => user.id === driver.userId);

  if (!driverUser) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Driver</Text>
      </View>

      <View style={styles.driverContainer}>
        <Image
          source={{ uri: driverUser.profileImage }}
          style={styles.driverImage}
        />

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverUser.name}</Text>

          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
            <Text style={styles.tripsText}>• {driver.totalTrips} trips</Text>
          </View>

          <View style={styles.licenseContainer}>
            <Text style={styles.licenseText}>
              License: {driver.licenseNumber}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onCall}>
          <View
            style={[styles.actionIcon, { backgroundColor: colors.primary }]}
          >
            <Phone size={20} color={colors.white} />
          </View>
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
          <View
            style={[styles.actionIcon, { backgroundColor: colors.secondary }]}
          >
            <MessageCircle size={20} color={colors.white} />
          </View>
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
    marginRight: 8,
  },
  tripsText: {
    fontSize: 14,
    color: colors.inactive,
  },
  licenseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  licenseText: {
    fontSize: 14,
    color: colors.inactive,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
});
