import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  CreditCard,
  HelpCircle,
  Languages,
  LogOut,
  Settings,
  Shield,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          logout();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please login to view your profile</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              user.profileImage ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
          }}
          style={styles.profileImage}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profilePhone}>{user.phone}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
            <Text style={styles.tripsText}>• {user.rideCount} trips</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/payment-methods")}
        >
          <View style={styles.menuItemLeft}>
            <CreditCard size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Payment Methods</Text>
          </View>
          <ChevronRight size={20} color={colors.inactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/saved-locations")}
        >
          <View style={styles.menuItemLeft}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Saved Locations</Text>
          </View>
          <ChevronRight size={20} color={colors.inactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/language-settings")}
        >
          <View style={styles.menuItemLeft}>
            <Languages size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Language</Text>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={styles.menuItemValue}>
              {user.preferredLanguage === "en"
                ? "English"
                : user.preferredLanguage === "fr"
                ? "French"
                : "Swahili"}
            </Text>
            <ChevronRight size={20} color={colors.inactive} />
          </View>
        </TouchableOpacity>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Wifi size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Offline Mode</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={offlineMode ? colors.primary : colors.inactive}
          />
        </View>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Bell size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={notifications ? colors.primary : colors.inactive}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/help-center")}
        >
          <View style={styles.menuItemLeft}>
            <HelpCircle size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Help Center</Text>
          </View>
          <ChevronRight size={20} color={colors.inactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/safety-center")}
        >
          <View style={styles.menuItemLeft}>
            <Shield size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Safety Center</Text>
          </View>
          <ChevronRight size={20} color={colors.inactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/settings")}
        >
          <View style={styles.menuItemLeft}>
            <Settings size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
          <ChevronRight size={20} color={colors.inactive} />
        </TouchableOpacity>
      </Card>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

import { Bell, MapPin, Wifi } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.inactive,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
    marginRight: 4,
  },
  tripsText: {
    fontSize: 14,
    color: colors.inactive,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.card,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  menuItemValue: {
    fontSize: 14,
    color: colors.inactive,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: "500",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.inactive,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
