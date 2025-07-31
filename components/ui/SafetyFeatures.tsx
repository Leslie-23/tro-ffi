import {
  AlertTriangle,
  Bell,
  MapPin,
  Phone,
  Shield,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/Colors";
import { Button } from "./Button";

export const SafetyFeatures: React.FC = () => {
  const [sosPanelVisible, setSosPanelVisible] = useState(false);

  const handleSOS = () => {
    setSosPanelVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.safetyHeader}>
        <Shield size={20} color={colors.primary} />
        <Text style={styles.safetyTitle}>Safety Features</Text>
      </View>

      <View style={styles.featuresContainer}>
        <TouchableOpacity style={styles.featureButton} onPress={handleSOS}>
          <View style={styles.sosButton}>
            <AlertTriangle size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton}>
          <View
            style={[styles.featureIcon, { backgroundColor: colors.secondary }]}
          >
            <Bell size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton}>
          <View
            style={[styles.featureIcon, { backgroundColor: colors.primary }]}
          >
            <Phone size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Call</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={sosPanelVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSosPanelVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Emergency SOS</Text>
              <TouchableOpacity onPress={() => setSosPanelVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sosMessage}>
              Activating SOS will alert emergency services and share your
              current location. Use only in case of emergency.
            </Text>

            <View style={styles.sosActions}>
              <Button
                title="Call Emergency Services"
                variant="danger"
                onPress={() => {
                  // In a real app, this would initiate a call
                  setSosPanelVisible(false);
                }}
                style={styles.sosButtonInModal}
                leftIcon={<Phone size={20} color={colors.white} />}
                fullWidth
              />

              <Button
                title="Share Location with Contacts"
                onPress={() => {
                  // In a real app, this would share location
                  setSosPanelVisible(false);
                }}
                style={styles.sosButtonInModal}
                leftIcon={<MapPin size={20} color={colors.white} />}
                fullWidth
              />

              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setSosPanelVisible(false)}
                style={styles.sosButtonInModal}
                textStyle={{ color: colors.white, fontWeight: "800" }}
                leftIcon={
                  <X
                    size={20}
                    color={colors.white}
                    style={{ alignContent: "center" }}
                  />
                }
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  safetyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  featureButton: {
    alignItems: "center",
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  sosButtonInModal: {
    width: 300,
    height: 60,
    borderRadius: 30,
    display: "flex",
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 8,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
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
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  sosMessage: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    lineHeight: 24,
  },
  sosActions: {
    gap: 12,
  },
});
