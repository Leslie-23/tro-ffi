import { colors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   // const [loaded, error] = useFonts({
//   //   ...FontAwesome.font,
//   // });

//   // useEffect(() => {
//   //   if (error) {
//   //     console.error(error);
//   //     throw error;
//   //   }
//   // }, [error]);

//   // useEffect(() => {
//   //   if (loaded) {
//   //     SplashScreen.hideAsync();
//   //   }
//   // }, [loaded]);

//   // if (!loaded) {
//   //   return null;
//   //}
//   const [loaded, error] = useFonts({
//     ...FontAwesome.font,
//   });

//   useEffect(() => {
//     if (error) {
//       console.error(error);
//       throw error;
//     }
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return <SplashScreen1 />;
//   }
//   return (
//     <ErrorBoundary>
//       <RootLayoutNav />
//     </ErrorBoundary>
//   );
// }

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Load any other resources here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
      // Keep our custom splash visible a bit longer
      setTimeout(() => setSplashVisible(false), 3000);
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <RootLayoutNav />
      </ErrorBoundary>

      {splashVisible && (
        <View style={[StyleSheet.absoluteFill, styles.splashContainer]}>
          <Text style={styles.splashText}>ABC, African Bus Connect</Text>
          <Text style={styles.splashSubText}>Standardizing efficiency</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#32bb78",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  splashText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  splashSubText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
});

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="route-details/[id]"
        options={{ headerTitle: "Route Details" }}
      />
      <Stack.Screen
        name="booking-confirmation"
        options={{ headerTitle: "Confirm Booking" }}
      />
      <Stack.Screen
        name="booking-success/[id]"
        options={{ headerTitle: "Booking Confirmed", headerBackVisible: false }}
      />
      <Stack.Screen
        name="booking-details/[id]"
        options={{ headerTitle: "Booking Details" }}
      />
    </Stack>
  );
}
