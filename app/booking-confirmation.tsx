import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PaymentMethodSelector } from "@/components/ui/PaymentMethodSelector";
import { colors } from "@/constants/colors";
import { useBookingStore } from "@/store/booking-store";
import { PaymentMethod } from "@/types";
import { Stack, useRouter } from "expo-router";
import { Calendar, CheckCircle, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const {
    selectedRoute,
    selectedPickup,
    selectedDropoff,
    selectedDate,
    passengerCount,
    isGroupBooking,
    createBooking,
    isLoading,
  } = useBookingStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({
    payment: "",
    terms: "",
  });

  if (!selectedRoute || !selectedPickup || !selectedDropoff || !selectedDate) {
    // Redirect back if booking details are missing
    router.replace("/search");
    return null;
  }

  const totalFare = selectedRoute.fare.current * passengerCount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const validateForm = () => {
    const newErrors = {
      payment: !paymentMethod ? "Please select a payment method" : "",
      terms: !termsAccepted ? "You must accept the terms and conditions" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;

    try {
      const booking = await createBooking({
        paymentMethod: paymentMethod?.type || "mobile_money",
        paymentStatus: "pending",
      });

      // Navigate to success screen
      router.replace(`/booking-success/${booking.id}`);
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        "There was an error processing your booking. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen
        options={{
          title: "Confirm Booking",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
        }}
      />

      <Text style={styles.title}>Booking Summary</Text>

      <Card style={styles.routeCard}>
        <Text style={styles.routeName}>{selectedRoute.name}</Text>

        <View style={styles.routeInfo}>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <View style={styles.locationLine} />
            <View style={styles.locationDot} />
          </View>

          <View style={styles.locationDetails}>
            <View style={styles.location}>
              <Text style={styles.locationName}>{selectedPickup.name}</Text>
              <Text style={styles.locationAddress}>
                {selectedPickup.address}
              </Text>
            </View>

            <View style={styles.location}>
              <Text style={styles.locationName}>{selectedDropoff.name}</Text>
              <Text style={styles.locationAddress}>
                {selectedDropoff.address}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.detailsCard}>
        <View style={styles.detailItem}>
          <View style={styles.detailItemLeft}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.detailLabel}>Date</Text>
          </View>
          <Text style={styles.detailValue}>{formatDate(selectedDate)}</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailItemLeft}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.detailLabel}>Time</Text>
          </View>
          <Text style={styles.detailValue}>{formatTime(selectedDate)}</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailItemLeft}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.detailLabel}>Passengers</Text>
          </View>
          <Text style={styles.detailValue}>
            {passengerCount} {isGroupBooking ? "(Group)" : ""}
          </Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Payment</Text>

      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
        error={errors.payment}
      />

      <Card style={styles.fareBreakdown}>
        <Text style={styles.fareTitle}>Fare Breakdown</Text>

        <View style={styles.fareItem}>
          <Text style={styles.fareItemLabel}>Base Fare</Text>
          <Text style={styles.fareItemValue}>
            GHS {selectedRoute.fare.current}
          </Text>
        </View>

        <View style={styles.fareItem}>
          <Text style={styles.fareItemLabel}>Passengers</Text>
          <Text style={styles.fareItemValue}>x {passengerCount}</Text>
        </View>

        {isGroupBooking && (
          <View style={styles.fareItem}>
            <Text style={styles.fareItemLabel}>Group Discount</Text>
            <Text style={styles.fareItemValue}>-10%</Text>
          </View>
        )}

        <View style={styles.totalFare}>
          <Text style={styles.totalFareLabel}>Total</Text>
          <Text style={styles.totalFareValue}>
            GHS {isGroupBooking ? totalFare * 0.9 : totalFare}
          </Text>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => setTermsAccepted(!termsAccepted)}
      >
        <View
          style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
        >
          {termsAccepted && <CheckCircle size={16} color={colors.white} />}
        </View>
        <Text style={styles.termsText}>
          I accept the terms and conditions, including the cancellation policy
        </Text>
      </TouchableOpacity>

      {errors.terms ? (
        <Text style={styles.errorText}>{errors.terms}</Text>
      ) : null}

      <Button
        title="Confirm & Pay"
        onPress={handleConfirmBooking}
        isLoading={isLoading}
        fullWidth
        style={styles.confirmButton}
      />
    </ScrollView>
  );
}

import { Clock } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  routeCard: {
    marginBottom: 16,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  routeInfo: {
    flexDirection: "row",
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
  detailsCard: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  fareBreakdown: {
    marginTop: 24,
    marginBottom: 24,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  fareItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  fareItemLabel: {
    fontSize: 14,
    color: colors.text,
  },
  fareItemValue: {
    fontSize: 14,
    color: colors.text,
  },
  totalFare: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalFareLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  totalFareValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  termsText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 16,
  },
  confirmButton: {
    marginBottom: 24,
  },
});
