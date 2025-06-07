import { BusTracker } from "@/components/ui/BusTracker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DriverInfo } from "@/components/ui/DriverInfo";
import { SafetyFeatures } from "@/components/ui/SafetyFeatures";
import { colors } from "@/constants/colors";
import { mockBuses, mockDrivers } from "@/mocks/data";
import { useBookingStore } from "@/store/booking-store";
import { Booking } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  DollarSign,
  Share2,
  Users,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { bookings, cancelBooking, isLoading } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const bookingData = bookings.find((b) => b.id === id);
    if (bookingData) {
      setBooking(bookingData);
    } else {
      // Booking not found, redirect to bookings list
      router.replace("/bookings");
    }
  }, [id, bookings, router]);

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

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

  const handleCancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? Cancellation fees may apply.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          onPress: async () => {
            try {
              await cancelBooking(booking.id);
              Alert.alert(
                "Booking Cancelled",
                "Your booking has been cancelled successfully.",
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to cancel booking. Please try again.",
                [{ text: "OK" }]
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleShareBooking = () => {
    // In a real app, this would use the Share API
    Alert.alert(
      "Share Booking",
      "Sharing functionality would be implemented here.",
      [{ text: "OK" }]
    );
  };

  // Get bus and driver info if booking is active
  const isActiveBooking = ["pending", "confirmed"].includes(booking.status);
  const bus = isActiveBooking
    ? mockBuses.find((b) => b.id === booking.busId)
    : null;
  const driver = bus ? mockDrivers.find((d) => d.id === bus.driverId) : null;

  // Calculate estimated arrival (for active bookings)
  const estimatedArrival = new Date();
  estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 30);

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

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar barStyle={"default"} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Stack.Screen
          options={{
            title: "Booking Details",
            headerTitleStyle: { color: colors.text },
            headerStyle: { backgroundColor: colors.background },
            headerRight: () => (
              <TouchableOpacity
                onPress={handleShareBooking}
                style={styles.shareButton}
              >
                <Share2 size={20} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(booking.status) },
            ]}
          />
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>

        <Card style={styles.bookingCard}>
          <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>

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
                <Text style={styles.locationAddress}>
                  {booking.pickupLocation.address}
                </Text>
              </View>

              <View style={styles.location}>
                <Text style={styles.locationName}>
                  {booking.dropoffLocation.name}
                </Text>
                <Text style={styles.locationAddress}>
                  {booking.dropoffLocation.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {formatDate(booking.pickupTime)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Clock size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {formatTime(booking.pickupTime)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Users size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {booking.passengerCount}{" "}
                {booking.isGroupBooking ? "(Group)" : ""}
              </Text>
            </View>
          </View>

          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareAmount}>GHS {booking.fare}</Text>
          </View>

          <View style={styles.paymentInfo}>
            <View style={styles.paymentMethod}>
              <DollarSign size={16} color={colors.inactive} />
              <Text style={styles.paymentMethodText}>
                {booking.paymentMethod === "mobile_money"
                  ? "Mobile Money"
                  : booking.paymentMethod === "card"
                  ? "Card"
                  : "Cash"}
              </Text>
            </View>

            <Text
              style={[
                styles.paymentStatus,
                {
                  color:
                    booking.paymentStatus === "paid"
                      ? colors.success
                      : booking.paymentStatus === "failed"
                      ? colors.error
                      : colors.warning,
                },
              ]}
            >
              {booking.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </Card>

        {isActiveBooking && bus && (
          <BusTracker
            bus={bus}
            destination={booking.pickupLocation}
            estimatedArrival={estimatedArrival.toISOString()}
          />
        )}

        {isActiveBooking && driver && (
          <DriverInfo
            driver={driver}
            onCall={() => {
              /* Handle call */
            }}
            onMessage={() => {
              /* Handle message */
            }}
          />
        )}

        {isActiveBooking && <SafetyFeatures />}

        {isActiveBooking && (
          <Button
            title="Cancel Booking"
            onPress={handleCancelBooking}
            variant="outline"
            leftIcon={<X size={20} color={colors.error} />}
            textStyle={{ color: colors.error }}
            style={styles.cancelButton}
            isLoading={isLoading}
            fullWidth
          />
        )}

        {booking.status === "completed" && (
          <Button
            title="Rate Your Trip"
            onPress={
              () => {}
              // router.push(`/rate-trip/${booking.id}`)
            }
            style={styles.rateButton}
            fullWidth
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  shareButton: {
    marginRight: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  bookingCard: {
    marginBottom: 24,
  },
  bookingId: {
    fontSize: 14,
    color: colors.inactive,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.inactive,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  fareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.inactive,
    marginLeft: 6,
    textTransform: "capitalize",
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 24,
    borderColor: colors.error,
  },
  rateButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  safeArea: {
    flex: 1,
  },
});
