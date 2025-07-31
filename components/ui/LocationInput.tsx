import { useRouteStore } from "@/store/route-store";
import { Location } from "@/types";
import { MapPin, Search, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/Colors";

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: Location | null;
  onChange: (location: Location) => void;
  error?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locations, popularLocations, fetchLocations } = useRouteStore();
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLocations(popularLocations);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations, popularLocations]);

  const handleSelectLocation = (location: Location) => {
    onChange(location);
    setModalVisible(false);
    setSearchQuery("");
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item)}
    >
      <MapPin size={20} color={colors.primary} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error ? styles.inputError : null]}
        onPress={() => setModalVisible(true)}
      >
        <MapPin size={20} color={colors.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={value ? styles.value : styles.placeholder}>
            {value ? value.name : placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.grey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search locations..."
                placeholderTextColor={colors.grey}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {searchQuery.trim() === "" && (
              <Text style={styles.popularText}>Popular Locations</Text>
            )}

            <FlatList
              data={filteredLocations}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.id}
              style={styles.locationsList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No locations found</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    padding: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.inactive,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    fontSize: 16,
    color: colors.inactive,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    fontSize: 16,
  },
  popularText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginVertical: 12,
  },
  locationsList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  locationAddress: {
    fontSize: 14,
    color: colors.inactive,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: colors.inactive,
    marginTop: 20,
  },
});
