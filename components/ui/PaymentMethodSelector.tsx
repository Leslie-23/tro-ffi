import { colors } from "@/constants/colors";
import { mockPaymentMethods } from "@/mocks/data";
import { PaymentMethod } from "@/types";
import { Check, CreditCard, DollarSign, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "./Button";

interface PaymentMethodSelectorProps {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  error?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handleSelectMethod = (method: PaymentMethod) => {
    onChange(method);
    setModalVisible(false);
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "mobile_money":
        return <DollarSign size={20} color={colors.primary} />;
      case "cash":
        return <DollarSign size={20} color={colors.primary} />;
      default:
        return <CreditCard size={20} color={colors.primary} />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method.type) {
      case "mobile_money":
        return `${method.provider} (${method.accountNumber})`;
      case "card":
        return `${method.provider} ${method.accountNumber}`;
      case "cash":
        return "Cash on Pickup";
      default:
        return "Unknown Payment Method";
    }
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={styles.methodItem}
      onPress={() => handleSelectMethod(item)}
    >
      <View style={styles.methodInfo}>
        {getPaymentIcon(item.type)}
        <View style={styles.methodDetails}>
          <Text style={styles.methodName}>{getPaymentMethodName(item)}</Text>
          <Text style={styles.methodType}>{item.type.replace("_", " ")}</Text>
        </View>
      </View>

      {value?.id === item.id && <Check size={20} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error ? styles.inputError : null]}
        onPress={() => setModalVisible(true)}
      >
        {value ? (
          getPaymentIcon(value.type)
        ) : (
          <CreditCard size={20} color={colors.primary} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={value ? styles.value : styles.placeholder}>
            {value ? getPaymentMethodName(value) : "Select payment method"}
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
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={paymentMethods}
              renderItem={renderPaymentMethod}
              keyExtractor={(item) => item.id}
              style={styles.methodsList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No payment methods available
                </Text>
              }
            />

            <Button
              title="Add New Payment Method"
              variant="outline"
              onPress={() => {
                // In a real app, this would navigate to add payment method screen
                setModalVisible(false);
              }}
              style={styles.addButton}
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
  textContainer: {
    flex: 1,
    marginLeft: 12,
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
  methodsList: {
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  methodDetails: {
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  methodType: {
    fontSize: 14,
    color: colors.inactive,
    marginTop: 2,
    textTransform: "capitalize",
  },
  emptyText: {
    textAlign: "center",
    color: colors.inactive,
    marginTop: 20,
  },
  addButton: {
    marginTop: 8,
  },
});
