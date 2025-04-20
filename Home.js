import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";

export default function Home({ navigation = {}, setCurrentScreen = () => {} }) {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    setCurrentScreen("Home");
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [setCurrentScreen]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.heading}>
          Nex<Text style={styles.highlight}>Cook</Text>
        </Text>
        <Text style={styles.subtext}>
          A new dimension of culinary experience with our state-of-the-art smart
          cooking technology.
        </Text>
        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => {
            setCurrentScreen("SoupConfig");
            navigation?.navigate?.("SoupConfig");
          }}
        >
          <Text style={styles.outlinedButtonText}>Start Cooking</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    color: "#ffffff",
    fontSize: 56,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  highlight: {
    color: "#c084fc",
  },
  subtext: {
    color: "#d1d1d1",
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  outlinedButton: {
    backgroundColor: "transparent",
    borderColor: "#c084fc",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    elevation: 2,
  },
  outlinedButtonText: {
    color: "#c084fc",
    fontSize: 16,
    fontWeight: "700",
  },
});
