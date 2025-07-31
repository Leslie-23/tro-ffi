import { Minus, Plus, Users } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/Colors";

interface PassengerCounterProps {
  label: string;
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
  error?: string;
}

export const PassengerCounter: React.FC<PassengerCounterProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  error,
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <Users size={20} color={colors.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.button, value <= min && styles.buttonDisabled]}
              onPress={handleDecrement}
              disabled={value <= min}
            >
              <Minus
                size={16}
                color={value <= min ? colors.inactive : colors.text}
              />
            </TouchableOpacity>

            <Text style={styles.value}>{value}</Text>

            <TouchableOpacity
              style={[styles.button, value >= max && styles.buttonDisabled]}
              onPress={handleIncrement}
              disabled={value >= max}
            >
              <Plus
                size={16}
                color={value >= max ? colors.inactive : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
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
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 16,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
