import { colors } from "@/constants/colors";
import { Booking } from "@/types";
import { Calendar } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "./Card";

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.primary;
      case "completed":
        return colors.success;
      case "cancelled":
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <TouchableOpacity onPress={() => onPress(booking)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(booking.status) },
              ]}
            />
            <Text style={styles.statusText}>
              {getStatusText(booking.status)}
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.inactive} />
            <Text style={styles.dateText}>
              {formatDate(booking.pickupTime)}
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
                {booking.pickupLocation.name}
              </Text>
              <Text style={styles.locationTime}>
                {formatTime(booking.pickupTime)}
              </Text>
            </View>

            <View style={styles.location}>
              <Text style={styles.locationName}>
                {booking.dropoffLocation.name}
              </Text>
              <Text style={styles.locationTime}>Destination</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.fareLabel}>Fare</Text>
            <Text style={styles.fareAmount}>GHS {booking.fare}</Text>
          </View>

          {booking.isGroupBooking && (
            <View style={styles.groupBookingTag}>
              <Text style={styles.groupBookingText}>
                Group Booking ({booking.passengerCount})
              </Text>
            </View>
          )}

          <View style={styles.paymentStatus}>
            <Text
              style={[
                styles.paymentStatusText,
                {
                  color:
                    booking.paymentStatus === "paid"
                      ? colors.success
                      : colors.warning,
                },
              ]}
            >
              {booking.paymentStatus.charAt(0).toUpperCase() +
                booking.paymentStatus.slice(1)}
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
    alignItems: "center",
    marginBottom: 16,
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
    fontWeight: "500",
    color: colors.text,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: colors.inactive,
    marginLeft: 4,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  locationTime: {
    fontSize: 12,
    color: colors.inactive,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  fareLabel: {
    fontSize: 12,
    color: colors.inactive,
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  groupBookingTag: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  groupBookingText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  paymentStatus: {
    alignItems: "flex-end",
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
