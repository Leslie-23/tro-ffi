import { Button } from "@/components/ui/Button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { LocationInput } from "@/components/ui/LocationInput";
import { PassengerCounter } from "@/components/ui/PassengerCounter";
import { RouteCard } from "@/components/ui/RouteCard";
import { useBookingStore } from "@/store/booking-store";
import { useRouteStore } from "@/store/route-store";
import { Route } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "../../constants/Colors";

export default function SearchScreen() {
  const router = useRouter();
  const { locations, fetchLocations, searchRoutes } = useRouteStore();
  const {
    selectedPickup,
    selectedDropoff,
    selectedDate,
    passengerCount,
    isGroupBooking,
    setSelectedPickup,
    setSelectedDropoff,
    setSelectedDate,
    setPassengerCount,
    setIsGroupBooking,
  } = useBookingStore();

  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({
    pickup: "",
    dropoff: "",
    date: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);

  const validateForm = () => {
    const newErrors = {
      pickup: !selectedPickup ? "Please select pickup location" : "",
      dropoff: !selectedDropoff ? "Please select dropoff location" : "",
      date: !selectedDate ? "Please select date and time" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSearch = async () => {
    if (!validateForm()) return;

    setIsSearching(true);
    try {
      const results = await searchRoutes(
        selectedPickup?.name || "",
        selectedDropoff?.name || ""
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRouteSelect = (route: Route) => {
    useBookingStore.getState().setSelectedRoute(route);
    router.push(`/route-details/${route.id}`);
  };

  const handleGroupBookingToggle = () => {
    const isGroup = !isGroupBooking;
    setIsGroupBooking(isGroup);
    if (isGroup && passengerCount < 5) {
      setPassengerCount(5);
    }
  };

  // Date picker handlers
  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  // Location input handlers
  const handleLocationSelect = (location: any, type: "pickup" | "dropoff") => {
    if (type === "pickup") {
      setSelectedPickup(location);
    } else {
      setSelectedDropoff(location);
    }
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            stickyHeaderIndices={[0]}
          >
            {/* Search Form at the Top */}
            <View style={styles.searchForm}>
              <Text style={styles.title}>Find Your Route</Text>

              <LocationInput
                label="From"
                placeholder="Select pickup location"
                value={selectedPickup}
                onChange={(location) =>
                  handleLocationSelect(location, "pickup")
                }
                error={errors.pickup}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <LocationInput
                label="To"
                placeholder="Select destination"
                value={selectedDropoff}
                onChange={(location) =>
                  handleLocationSelect(location, "dropoff")
                }
                error={errors.dropoff}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <TouchableOpacity onPress={showDatePicker}>
                <DateTimePicker
                  label="Departure Time"
                  value={selectedDate}
                  editable={false}
                  error={errors.date}
                />
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />

              <PassengerCounter
                label="Passengers"
                value={passengerCount}
                onChange={setPassengerCount}
                min={isGroupBooking ? 5 : 1}
              />

              <TouchableOpacity
                style={styles.groupBookingToggle}
                onPress={handleGroupBookingToggle}
              >
                <View
                  style={[
                    styles.checkbox,
                    isGroupBooking && styles.checkboxChecked,
                  ]}
                >
                  {isGroupBooking && <View style={styles.checkmark} />}
                </View>
                <Text style={styles.groupBookingText}>
                  Group Booking (5+ passengers)
                </Text>
              </TouchableOpacity>

              <Button
                title="Search Routes"
                onPress={handleSearch}
                isLoading={isSearching}
                fullWidth
                style={styles.searchButton}
              />
            </View>

            {/* Results Section Below */}
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Searching for routes...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Search Results</Text>
                {searchResults.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onPress={handleRouteSelect}
                  />
                ))}
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  searchForm: {
    backgroundColor: colors.background,
    paddingBottom: 16,
    marginBottom: 8,
    zIndex: 1,
  },
  groupBookingToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  groupBookingText: {
    fontSize: 14,
    color: colors.text,
  },
  searchButton: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
});
