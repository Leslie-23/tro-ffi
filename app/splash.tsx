import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen1() {
  return (
    <View style={styles.container}>
      {/* Add your logo if you have one */}
      {/* <Image source={require('@/assets/images/logo.png')} style={styles.logo} /> */}

      <Text style={styles.title}>ABC, African Bus Connect</Text>
      <Text style={styles.subtitle}>Standardizing efficiency</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#32bb78", // Your green color
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
  },
});
