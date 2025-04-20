import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Home from "./Home";
import RecipeSelect from "./recipeSelect";
import RecipeDetails from "./RecipeDetails";
import ModuleHealth from "./ModuleHealth";
import Cart from "./Cart";
import CookingScreen from "./CookingScreen";
import RatingScreen from "./RatingScreen";
import PaymentScreen from "./PaymentScreen";
import { CartProvider } from "./CartContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Home");
  const navigationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener("state", () => {
      const currentRouteName =
        navigationRef.current?.getCurrentRoute()?.name || "Home";
      setCurrentScreen(currentRouteName);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleNavigation = (screenName) => {
    navigationRef.current?.navigate(screenName);
  };

  return (
    <CartProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0a0a0a" },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SoupConfig" component={RecipeSelect} />
          <Stack.Screen
            name="RecipeDetails"
            component={RecipeDetails}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="ModuleHealth" component={ModuleHealth} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="CookingScreen" component={CookingScreen} />
          <Stack.Screen name="RatingScreen" component={RatingScreen} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        </Stack.Navigator>

        {currentScreen !== "Home" &&
          currentScreen !== "RecipeDetails" &&
          currentScreen !== "CookingScreen" &&
          currentScreen !== "RatingScreen" &&
          currentScreen !== "PaymentScreen" && (
            <View style={styles.dock}>
              <TouchableOpacity
                style={[
                  styles.dockButton,
                  currentScreen === "SoupConfig" && styles.activeDockButton,
                ]}
                onPress={() => handleNavigation("SoupConfig")}
              >
                <Ionicons
                  name="restaurant"
                  size={24}
                  color={currentScreen === "SoupConfig" ? "#ffffff" : "#c084fc"}
                />
                <Text
                  style={[
                    styles.dockText,
                    currentScreen === "SoupConfig" && styles.activeDockText,
                  ]}
                >
                  Recipes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dockButton,
                  currentScreen === "ModuleHealth" && styles.activeDockButton,
                ]}
                onPress={() => handleNavigation("ModuleHealth")}
              >
                <Ionicons
                  name="hardware-chip"
                  size={24}
                  color={
                    currentScreen === "ModuleHealth" ? "#ffffff" : "#c084fc"
                  }
                />
                <Text
                  style={[
                    styles.dockText,
                    currentScreen === "ModuleHealth" && styles.activeDockText,
                  ]}
                >
                  Health
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dockButton,
                  currentScreen === "Cart" && styles.activeDockButton,
                ]}
                onPress={() => handleNavigation("Cart")}
              >
                <Ionicons
                  name="cart"
                  size={24}
                  color={currentScreen === "Cart" ? "#ffffff" : "#c084fc"}
                />
                <Text
                  style={[
                    styles.dockText,
                    currentScreen === "Cart" && styles.activeDockText,
                  ]}
                >
                  Cart
                </Text>
              </TouchableOpacity>
            </View>
          )}
        <StatusBar style="light" />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  dock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  dockButton: {
    alignItems: "center",
    padding: 10,
  },
  activeDockButton: {
    backgroundColor: "#c084fc",
    borderRadius: 10,
  },
  dockText: {
    color: "#c084fc",
    fontSize: 12,
    marginTop: 5,
  },
  activeDockText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
