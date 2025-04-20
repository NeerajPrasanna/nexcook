import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CookingScreen = ({ navigation, route }) => {
  const { recipes = [], quantities = {} } = route.params || {};
  const steps = recipes.length > 0 ? recipes[0].steps || [] : [];
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(
    Math.max(...Object.values(quantities)) * 10
  ); // Use max quantity for timer
  const slideAnim = useRef(new Animated.Value(100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (steps.length === 0 || Object.keys(quantities).length === 0) return;

    // Timer interval
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    // Step interval
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          return prev;
        }

        slideAnim.setValue(100);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(progressAnim, {
          toValue: ((next + 1) / steps.length) * 100,
          duration: 300,
          useNativeDriver: false,
        }).start();

        return next;
      });
    }, (Math.max(...Object.values(quantities)) * 10 * 1000) / steps.length);

    return () => {
      clearInterval(timerInterval);
      clearInterval(stepInterval);
    };
  }, [steps, quantities, slideAnim, progressAnim]);

  useEffect(() => {
    // Initial animations for first step
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(progressAnim, {
      toValue: steps.length > 0 ? (1 / steps.length) * 100 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [slideAnim, progressAnim, steps.length]);

  useEffect(() => {
    if (timer <= 0) {
      console.log("Navigating to RatingScreen");
      navigation.replace("RatingScreen", {
        recipe: recipes[0],
        quantity: quantities[recipes[0]?.id],
      });
    }
  }, [timer, navigation, recipes, quantities]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#c084fc" />
        </TouchableOpacity>
        <Text style={styles.title}>Cooking in Progress</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Soups Being Prepared</Text>
        {recipes.length === 0 ? (
          <Text style={styles.emptyText}>No soups selected</Text>
        ) : (
          recipes.map((recipe) => (
            <View key={recipe.id} style={styles.soupCard}>
              <Image
                source={{ uri: recipe.imageUrl }}
                style={styles.soupImage}
              />
              <View style={styles.soupDetails}>
                <Text style={styles.soupName}>{recipe.name}</Text>
                <Text style={styles.soupQuantity}>
                  Quantity: {quantities[recipe.id] || 1}
                </Text>
                <Text style={styles.soupCategory}>{recipe.category}</Text>
                <Text style={styles.sectionSubtitle}>Ingredients</Text>
                {recipe.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {ingredient.name}:{" "}
                    {ingredient.quantity * (quantities[recipe.id] || 1)}{" "}
                    {ingredient.unit}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}
        <Text style={styles.sectionTitle}>Cooking Steps</Text>
        <Text style={styles.timer}>Time Remaining: {timer}s</Text>
        <Text style={styles.stepTitle}>
          Step {currentStep + 1} of {steps.length}
        </Text>
        <Animated.View
          style={[
            styles.stepContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.stepText}>
            {steps[currentStep] || "No steps available"}
          </Text>
        </Animated.View>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  sectionSubtitle: {
    color: "#c084fc",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyText: {
    color: "#d1d1d1",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  soupCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
  },
  soupImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  soupDetails: {
    flex: 1,
  },
  soupName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  soupQuantity: {
    color: "#d1d1d1",
    fontSize: 14,
    marginBottom: 5,
  },
  soupCategory: {
    color: "#c084fc",
    fontSize: 14,
    marginBottom: 10,
  },
  listItem: {
    color: "#d1d1d1",
    fontSize: 14,
    marginBottom: 5,
  },
  timer: {
    color: "#c084fc",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  stepTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  stepContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: 20,
  },
  stepText: {
    color: "#d1d1d1",
    fontSize: 16,
    lineHeight: 24,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#c084fc",
    borderRadius: 5,
  },
});

export default CookingScreen;
