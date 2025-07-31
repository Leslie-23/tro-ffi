import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import { ChevronRight, Lock, Phone } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/Colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    phone: "",
    password: "",
  });

  const validateForm = () => {
    const errors = {
      phone: "",
      password: "",
    };

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return !errors.phone && !errors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(phone, password);
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            }}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
          <Text style={styles.title}>African Bus Connect</Text>
          <Text style={styles.subtitle}>Your journey, our priority</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Phone Number"
            placeholder="+254712345678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.primary} />}
            error={formErrors.phone}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon={<Lock size={20} color={colors.primary} />}
            error={formErrors.password}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            // onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            // onPress={() => router.push("/register")}
          >
            <Text style={styles.registerText}>Create an Account</Text>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ussdButton}
            onPress={() => {
              /* Handle USSD login */
            }}
          >
            <Text style={styles.ussdText}>Login via USSD</Text>
            <Text style={styles.ussdCode}>*123#</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 200,
    justifyContent: "flex-end",
    padding: 16,
    position: "relative",
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: colors.error + "20",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: colors.inactive,
    fontSize: 14,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 16,
  },
  registerText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  ussdButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  ussdText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  ussdCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});
