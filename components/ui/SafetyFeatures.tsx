import {
  AlertTriangle,
  Bell,
  MapPin,
  Phone,
  Shield,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/Colors";
import { Button } from "./Button";

export const SafetyFeatures: React.FC = () => {
  const [sosPanelVisible, setSosPanelVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [callVisible, setCallVisible] = useState(false);

  const emergencyContact = "+254712345678"; // Mock from onboarding
  const [callNumber, setCallNumber] = useState("");

  const handleCall = (number: string) => {
    // Place phone call here
    console.log("Calling", number);
    setCallVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.safetyHeader}>
        <Shield size={20} color={colors.primary} />
        <Text style={styles.safetyTitle}>Safety Features</Text>
      </View>

      <View style={styles.featuresContainer}>
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => setSosPanelVisible(true)}
        >
          <View style={styles.sosButton}>
            <AlertTriangle size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => setAlertVisible(true)}
        >
          <View
            style={[styles.featureIcon, { backgroundColor: colors.warning }]}
          >
            <Bell size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => setCallVisible(true)}
        >
          <View
            style={[styles.featureIcon, { backgroundColor: colors.primary }]}
          >
            <Phone size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* SOS Modal */}
      <Modal
        visible={sosPanelVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSosPanelVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalHeader
              title="Emergency SOS"
              onClose={() => setSosPanelVisible(false)}
            />
            <Text style={styles.sosMessage}>
              Activating SOS will alert emergency services and share your
              current location. Use only in case of emergency.
            </Text>
            <View style={styles.sosActions}>
              <Button
                title="Call Emergency Services"
                variant="danger"
                onPress={() => setSosPanelVisible(false)}
                style={styles.sosButtonInModal}
                leftIcon={<Phone size={20} color={colors.white} />}
                fullWidth
              />
              <Button
                title="Share Location with Contacts"
                onPress={() => setSosPanelVisible(false)}
                style={styles.sosButtonInModal}
                leftIcon={<MapPin size={20} color={colors.white} />}
                fullWidth
              />
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setSosPanelVisible(false)}
                style={styles.sosButtonInModal}
                textStyle={{ color: colors.white }}
                leftIcon={<X size={20} color={colors.white} />}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <Modal
        visible={alertVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalHeader
              title="Alert Contact"
              onClose={() => setAlertVisible(false)}
            />
            <Text style={styles.sosMessage}>
              This will call your emergency contact: {emergencyContact}
            </Text>
            <Button
              title="Call Emergency Contact"
              variant="danger"
              onPress={() => {
                handleCall(emergencyContact);
                setAlertVisible(false);
              }}
              style={styles.sosButtonInModal}
              leftIcon={<Phone size={20} color={colors.white} />}
              fullWidth
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setAlertVisible(false)}
              style={styles.sosButtonInModal}
              textStyle={{ color: colors.white }}
              leftIcon={<X size={20} color={colors.white} />}
              fullWidth
            />
          </View>
        </View>
      </Modal>

      {/* Call Modal */}
      <Modal
        visible={callVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCallVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalHeader
              title="Make a Call"
              onClose={() => setCallVisible(false)}
            />
            <TextInput
              placeholder="Enter phone number"
              value={callNumber}
              onChangeText={setCallNumber}
              placeholderTextColor={colors.inactive}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                padding: 12,
                fontSize: 16,
                marginBottom: 16,
                color: colors.text,
              }}
              keyboardType="phone-pad"
            />
            <Button
              title={`Call ${callNumber || "number"}`}
              variant="danger"
              onPress={() => handleCall(callNumber)}
              style={styles.callButtonInModal}
              leftIcon={<Phone size={20} color={colors.white} />}
              fullWidth
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setCallVisible(false)}
              style={styles.callButtonInModal}
              textStyle={{ color: colors.white }}
              leftIcon={<X size={20} color={colors.white} />}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Header component reused across modals
const ModalHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <View style={styles.modalHeader}>
    <Text style={styles.modalTitle}>{title}</Text>
    <TouchableOpacity onPress={onClose}>
      <X size={24} color={colors.text} />
    </TouchableOpacity>
  </View>
);

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
    paddingVertical: 1,
    paddingHorizontal: 1,
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
  callButtonInModal: {
    width: 300,
    height: 60,
    borderRadius: 30,
    display: "flex",
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 8,
  },
});
