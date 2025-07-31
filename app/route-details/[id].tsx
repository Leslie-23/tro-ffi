import { BusCard } from "@/components/ui/BusCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockBuses } from "@/mocks/data";
import { useBookingStore } from "@/store/booking-store";
import { useRouteStore } from "@/store/route-store";
import { Bus, Route } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/Colors";

export default function RouteDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getRouteById } = useRouteStore();
  const {
    selectedPickup,
    selectedDropoff,
    selectedDate,
    passengerCount,
    isGroupBooking,
    setSelectedRoute,
  } = useBookingStore();

  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [availableBuses, setAvailableBuses] = useState<Bus[]>([]);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const routeData = getRouteById(id as string);
        if (routeData) {
          setRoute(routeData);
          setSelectedRoute(routeData);

          // Filter buses for this route
          const buses = mockBuses.filter(
            (bus) =>
              bus.status === "active" && bus.currentOccupancy < bus.capacity
          );
          setAvailableBuses(buses);
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetails();
  }, [id, getRouteById, setSelectedRoute]);

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

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const handleBookNow = () => {
    router.push("/booking-confirmation");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading route details...</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Route not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen
        options={{
          title: "Route Details",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
        }}
      />

      <Card style={styles.routeCard}>
        <Text style={styles.routeName}>{route.name}</Text>

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

        <View style={styles.routeStats}>
          <View style={styles.routeStat}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.routeStatText}>
              <Text style={styles.routeStatLabel}>Duration</Text>
              <Text style={styles.routeStatValue}>
                {formatDuration(route.estimatedDuration)}
              </Text>
            </View>
          </View>

          <View style={styles.routeStat}>
            <MapPin size={20} color={colors.primary} />
            <View style={styles.routeStatText}>
              <Text style={styles.routeStatLabel}>Distance</Text>
              <Text style={styles.routeStatValue}>{route.distance} km</Text>
            </View>
          </View>

          <View style={styles.routeStat}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.routeStatText}>
              <Text style={styles.routeStatLabel}>Fare</Text>
              <Text style={styles.routeStatValue}>
                {formatCurrency(route.fare.current)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.scheduleHeader}
        onPress={() => setShowSchedule(!showSchedule)}
      >
        <Text style={styles.scheduleTitle}>Schedule</Text>
        {showSchedule ? (
          <ChevronUp size={20} color={colors.text} />
        ) : (
          <ChevronDown size={20} color={colors.text} />
        )}
      </TouchableOpacity>

      {showSchedule && (
        <Card style={styles.scheduleCard}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Frequency</Text>
            <Text style={styles.scheduleValue}>
              Every {route.schedule.frequency} minutes
            </Text>
          </View>

          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>First Departure</Text>
            <Text style={styles.scheduleValue}>
              {formatTime(route.schedule.firstDeparture)}
            </Text>
          </View>

          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Last Departure</Text>
            <Text style={styles.scheduleValue}>
              {formatTime(route.schedule.lastDeparture)}
            </Text>
          </View>

          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Occupancy</Text>
            <Text style={styles.scheduleValue}>
              {Math.round(route.popularity * 100)}% full
            </Text>
          </View>
        </Card>
      )}

      <Text style={styles.sectionTitle}>Available Buses</Text>

      {availableBuses.length > 0 ? (
        availableBuses.map((bus) => <BusCard key={bus.id} bus={bus} />)
      ) : (
        <Card style={styles.noBusesCard}>
          <Text style={styles.noBusesText}>
            No buses available for this route at the moment
          </Text>
        </Card>
      )}

      <Card style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>

        <View style={styles.summaryItem}>
          <View style={styles.summaryItemLeft}>
            <MapPin size={16} color={colors.grey} />
            <Text style={styles.summaryLabel}>Pickup</Text>
          </View>
          <Text style={styles.summaryValue}>
            {selectedPickup?.name || route.startLocation.name}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryItemLeft}>
            <MapPin size={16} color={colors.grey} />
            <Text style={styles.summaryLabel}>Dropoff</Text>
          </View>
          <Text style={styles.summaryValue}>
            {selectedDropoff?.name || route.endLocation.name}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryItemLeft}>
            <Calendar size={16} color={colors.grey} />
            <Text style={styles.summaryLabel}>Date & Time</Text>
          </View>
          <Text style={styles.summaryValue}>
            {selectedDate
              ? new Date(selectedDate).toLocaleString()
              : "Not selected"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryItemLeft}>
            <Users size={16} color={colors.grey} />
            <Text style={styles.summaryLabel}>Passengers</Text>
          </View>
          <Text style={styles.summaryValue}>
            {passengerCount} {isGroupBooking ? "(Group)" : ""}
          </Text>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareAmount}>
            {formatCurrency(route.fare.current * passengerCount)}
          </Text>
        </View>
      </Card>

      <Button
        title="Continue to Booking"
        onPress={handleBookNow}
        fullWidth
        style={styles.bookButton}
      />
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
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
  routeCard: {
    marginBottom: 16,
  },
  routeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
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
    color: colors.grey,
  },
  routeStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  routeStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeStatText: {
    marginLeft: 8,
  },
  routeStatLabel: {
    fontSize: 12,
    color: colors.grey,
  },
  routeStatValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  scheduleCard: {
    marginBottom: 24,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleLabel: {
    fontSize: 14,
    color: colors.text,
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  noBusesCard: {
    marginBottom: 24,
    padding: 24,
    alignItems: "center",
  },
  noBusesText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
  },
  bookingSummary: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  fareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginTop: 8,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  bookButton: {
    marginBottom: 24,
  },
});
