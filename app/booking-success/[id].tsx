import { BusTracker } from "@/components/ui/BusTracker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DriverInfo } from "@/components/ui/DriverInfo";
import { SafetyFeatures } from "@/components/ui/SafetyFeatures";
import { mockBuses, mockDrivers } from "@/mocks/data";
import { useBookingStore } from "@/store/booking-store";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react-native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/Colors";

export default function BookingSuccessScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { activeBooking, bookings } = useBookingStore();

  useEffect(() => {
    if (!activeBooking && bookings.length > 0) {
      const booking = bookings.find((b) => b.id === id);
      if (booking) {
        useBookingStore.getState().setActiveBooking(booking);
      }
    }
  }, [id, activeBooking, bookings]);

  if (!activeBooking) {
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

  // Get bus and driver info
  const bus = mockBuses.find((b) => b.id === activeBooking.busId);
  const driver = mockDrivers.find((d) => d.id === (bus?.driverId || ""));

  // Calculate estimated arrival (30 minutes from now)
  const estimatedArrival = new Date();
  estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 30);

  const handleViewBookings = () => {
    router.replace("/bookings");
  };

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen
        options={{
          title: "Booking Confirmed",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => null, // Disable back button
        }}
      />

      <View style={styles.successHeader}>
        <CheckCircle size={60} color={colors.success} />
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successMessage}>
          Your booking has been confirmed. You will receive a confirmation SMS
          shortly.
        </Text>
      </View>

      <Card style={styles.bookingCard}>
        <Text style={styles.bookingId}>Booking ID: {activeBooking.id}</Text>

        <View style={styles.routeInfo}>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <View style={styles.locationLine} />
            <View style={styles.locationDot} />
          </View>

          <View style={styles.locationDetails}>
            <View style={styles.location}>
              <Text style={styles.locationName}>
                {activeBooking.pickupLocation.name}
              </Text>
              <Text style={styles.locationAddress}>
                {activeBooking.pickupLocation.address}
              </Text>
            </View>

            <View style={styles.location}>
              <Text style={styles.locationName}>
                {activeBooking.dropoffLocation.name}
              </Text>
              <Text style={styles.locationAddress}>
                {activeBooking.dropoffLocation.address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              {formatDate(activeBooking.pickupTime)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Clock size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              {formatTime(activeBooking.pickupTime)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Users size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              {activeBooking.passengerCount}{" "}
              {activeBooking.isGroupBooking ? "(Group)" : ""}
            </Text>
          </View>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareAmount}>GHS {activeBooking.fare}</Text>
        </View>

        <View style={styles.paymentStatus}>
          <Text style={styles.paymentStatusLabel}>Payment Status:</Text>
          <Text
            style={[
              styles.paymentStatusValue,
              {
                color:
                  activeBooking.paymentStatus === "paid"
                    ? colors.success
                    : colors.warning,
              },
            ]}
          >
            {activeBooking.paymentStatus.toUpperCase()}
          </Text>
        </View>
      </Card>

      {bus && (
        <BusTracker
          bus={bus}
          destination={activeBooking.pickupLocation}
          estimatedArrival={estimatedArrival.toISOString()}
        />
      )}

      {driver && (
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

      <SafetyFeatures />

      <View style={styles.buttonsContainer}>
        <Button
          title="View My Bookings"
          onPress={handleViewBookings}
          fullWidth
          style={styles.viewBookingsButton}
        />

        <Button
          title="Back to Home"
          onPress={handleGoHome}
          variant="outline"
          fullWidth
          style={styles.homeButton}
        />
      </View>
    </ScrollView>
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
  successHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: colors.inactive,
    textAlign: "center",
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
  paymentStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  paymentStatusLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  paymentStatusValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  viewBookingsButton: {
    marginBottom: 12,
  },
  homeButton: {},
});
