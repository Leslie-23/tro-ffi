import { BusCard } from "@/components/ui/BusCard";
import { RouteCard } from "@/components/ui/RouteCard";
import { SafetyFeatures } from "@/components/ui/SafetyFeatures";
import { colors } from "@/constants/colors";
import { mockBuses } from "@/mocks/data";
import { useAuthStore } from "@/store/auth-store";
import { useBookingStore } from "@/store/booking-store";
import { useRouteStore } from "@/store/route-store";
import { useRouter } from "expo-router";
import { Bus as BusIcon, Calendar, MapPin, Search } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { popularRoutes, fetchRoutes } = useRouteStore();
  const { activeBooking, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchRoutes();
    fetchBookings();
  }, [fetchRoutes, fetchBookings]);

  const handleRoutePress = (routeId: string) => {
    router.push(`/route-details/${routeId}`);
  };

  const handleSearchPress = () => {
    router.push("/search");
  };

  const handleActiveBookingPress = () => {
    if (activeBooking) {
      router.push(`/booking-details/${activeBooking.id}`);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with user greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(" ")[0] || "Guest"}
          </Text>
          <Text style={styles.subGreeting}>Where are you going today?</Text>
        </View>
        {user?.profileImage && (
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
        )}
      </View>

      {/* Search bar */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Search size={20} color={colors.grey} />
        <Text style={styles.searchText}>Search for routes or destinations</Text>
      </TouchableOpacity>

      {/* Active booking card */}
      {activeBooking && (
        <TouchableOpacity
          style={styles.activeBookingCard}
          onPress={handleActiveBookingPress}
        >
          <View style={styles.activeBookingHeader}>
            <Text style={styles.activeBookingTitle}>Active Booking</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{activeBooking.status}</Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.bookingDetail}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.bookingDetailText}>
                {activeBooking.pickupLocation.name}
              </Text>
            </View>

            <View style={styles.bookingDetail}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.bookingDetailText}>
                {formatTime(activeBooking.pickupTime)}
              </Text>
            </View>

            <View style={styles.bookingDetail}>
              <BusIcon size={16} color={colors.primary} />
              <Text style={styles.bookingDetailText}>
                Bus #{activeBooking.busId}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Safety features */}
      <SafetyFeatures />

      {/* Popular routes section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Routes</Text>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {popularRoutes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          onPress={() => handleRoutePress(route.id)}
        />
      ))}

      {/* Available buses section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Buses</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {mockBuses
        .filter((bus) => bus.status === "active")
        .slice(0, 2)
        .map((bus) => (
          <BusCard key={bus.id} bus={bus} />
        ))}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.grey,
    marginTop: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.grey,
  },
  activeBookingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  activeBookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activeBookingTitle: {
    fontSize: 16,
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
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: colors.text,
    textTransform: "capitalize",
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingDetailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
});
