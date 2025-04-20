import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RatingScreen = ({ navigation, route }) => {
  const { recipe, quantity } = route.params || {};
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const scaleAnims = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(1))
  ).current;

  const handleStarPress = (starIndex) => {
    setRating(starIndex + 1);
    Animated.sequence([
      Animated.spring(scaleAnims[starIndex], {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[starIndex], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    console.log("Rating submitted:", {
      recipeId: recipe?.id || "unknown",
      recipeName: recipe?.name || "Unknown",
      rating,
      feedback,
      quantity: quantity || 0,
    });
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CookingScreen", { recipe, quantity })
          }
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#c084fc" />
        </TouchableOpacity>
        <Text style={styles.title}>Rate {recipe?.name || "Recipe"}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instruction}>
          How was your experience with {recipe?.name || "this recipe"}?
        </Text>
        <View style={styles.starsContainer}>
          {Array(5)
            .fill()
            .map((_, index) => (
              <Animated.View
                key={index}
                style={{ transform: [{ scale: scaleAnims[index] }] }}
              >
                <TouchableOpacity onPress={() => handleStarPress(index)}>
                  <Ionicons
                    name={index < rating ? "star" : "star-outline"}
                    size={40}
                    color="#c084fc"
                    style={styles.star}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
        </View>
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating} Star${rating > 1 ? "s" : ""}` : "No rating"}
        </Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Share your feedback (optional)"
          placeholderTextColor="#d1d1d1"
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          style={[
            styles.submitButton,
            rating === 0 && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingTop: 20,
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
    alignItems: "center",
  },
  instruction: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  ratingText: {
    color: "#c084fc",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  feedbackInput: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default RatingScreen;
