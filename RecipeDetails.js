import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Counter from "./Counter";
import { CartContext } from "./CartContext";

const imageMap = {
  "masoor-dal":
    "https://cdn.cdnparenting.com/articles/2020/01/05143449/tomato-masoor-dal-soup.webp",
  "spinach-soup":
    "https://www.allrecipes.com/thmb/21Es2ulNx0rEBREbORUaOmSpaIM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/3313704-easy-spinach-soup-France-C-4x3-1-e6cbb4be80b7467e873126a6a2519381.jpg",
  "tomato-soup":
    "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/11/tomato-soup-recipe.jpg",
  "tur-dal":
    "https://www.whiskaffair.com/wp-content/uploads/2020/04/North-Indian-Homestyle-Toor-Dal-2-3.jpg",
};

const RecipeDetails = ({ navigation, route }) => {
  const { soupId } = route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!soupId) {
        setError("No recipe ID provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `https://firestore.googleapis.com/v1/projects/nexcook-ab40a/databases/(default)/documents/recipes/${soupId}`
        );
        const data = await response.json();
        if (data.fields) {
          const fields = data.fields;
          const formattedRecipe = {
            id: fields.id?.stringValue || soupId,
            name: fields.name?.stringValue || "Unknown Recipe",
            category: fields.category?.stringValue || "Unknown",
            cookingTime: parseInt(fields.cookingTime?.integerValue) || 0,
            rating: parseFloat(fields.rating?.doubleValue) || 0,
            timesCooked: parseInt(fields.timesCooked?.integerValue) || 0,
            description: fields.description?.stringValue || "No description",
            imageUrl: imageMap[soupId] || "https://via.placeholder.com/300",
            ingredients:
              fields.ingredients?.arrayValue?.values?.map((item) => ({
                id: item.mapValue.fields.id?.stringValue || "",
                name: item.mapValue.fields.name?.stringValue || "",
                quantity:
                  parseInt(item.mapValue.fields.quantity?.integerValue) || 0,
                unit: item.mapValue.fields.unit?.stringValue || "",
                moduleId: item.mapValue.fields.moduleId?.stringValue || "",
              })) || [],
            steps:
              fields.steps?.arrayValue?.values?.map(
                (step) => step.stringValue || ""
              ) || [],
          };
          setRecipe(formattedRecipe);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [soupId]);

  const handleAddToCart = () => {
    if (quantity > 0 && recipe) {
      addToCart({
        id: recipe.id,
        name: recipe.name,
        imageUrl: recipe.imageUrl,
        quantity,
        category: recipe.category,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigation.goBack();
      }, 2000);
      console.log(`Added ${quantity} of ${recipe.name} to cart`);
    } else {
      console.log("Cannot add to cart: quantity is 0 or recipe not loaded");
    }
  };

  const handlePayNow = () => {
    if (quantity > 0 && recipe) {
      navigation.navigate("PaymentScreen", {
        recipes: [recipe],
        quantities: { [recipe.id]: quantity },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#c084fc" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#c084fc" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          <Text style={styles.recipeCategory}>{recipe.category}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{recipe.cookingTime} min</Text>
            <Text style={styles.infoText}>
              Rating: {recipe.rating.toFixed(1)}
            </Text>
            <Text style={styles.infoText}>Cooked: {recipe.timesCooked}x</Text>
          </View>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.listItem}>
              • {ingredient.name}: {ingredient.quantity} {ingredient.unit}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe.steps.map((step, index) => (
            <Text key={index} style={styles.listItem}>
              {index + 1}. {step}
            </Text>
          ))}
          <View style={styles.actionRow}>
            <Counter
              style={styles.counter}
              onCountChange={(count) => setQuantity(count)}
            />
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
          {quantity >= 1 && (
            <TouchableOpacity
              style={styles.payNowButton}
              onPress={handlePayNow}
            >
              <Text style={styles.payNowText}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
      {showPopup && (
        <View style={styles.popup}>
          <Text style={styles.popupText}>Added to Cart!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    marginHorizontal: 20,
    maxHeight: "80%",
    width: "90%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1000,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  recipeTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  recipeCategory: {
    color: "#c084fc",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoText: {
    color: "#d1d1d1",
    fontSize: 14,
    fontWeight: "600",
  },
  description: {
    color: "#d1d1d1",
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    color: "#d1d1d1",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
    width: "100%",
  },
  counter: {
    flexShrink: 1,
  },
  addToCartButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addToCartText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  payNowButton: {
    backgroundColor: "#4ade80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 20,
  },
  payNowText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  popup: {
    position: "absolute",
    top: "40%",
    backgroundColor: "#c084fc",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  popupText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default RecipeDetails;
