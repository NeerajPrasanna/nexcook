import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Ionicons } from "@expo/vector-icons";
const firebaseConfig = {
  apiKey: "AIzaSyCnNvHUEllFKgsNgo3_uFU9LRelKGdDxCw",
  authDomain: "nexcook-ab40a.firebaseapp.com",
  projectId: "nexcook-ab40a",
  storageBucket: "nexcook-ab40a.firebasestorage.app",
  messagingSenderId: "55101686719",
  appId: "1:55101686719:web:b49bbc253499c65244570a",
  measurementId: "G-VZVJYHM8GK",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const RecipeSelect = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("All Recipes");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = ["All Recipes", "Lentil Recipes", "Soups"];

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

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://firestore.googleapis.com/v1/projects/nexcook-ab40a/databases/(default)/documents/recipes/"
      );
      const data = await response.json();
      if (data.documents) {
        const formattedRecipes = data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            id: fields.id.stringValue,
            name: fields.name.stringValue,
            cookingTime: parseInt(fields.cookingTime.integerValue),
            description: fields.description.stringValue,
            category: fields.category.stringValue,
            rating: parseFloat(fields.rating.doubleValue),
            imageUrl:
              imageMap[fields.id.stringValue] ||
              "https://via.placeholder.com/300",
            timesCooked: parseInt(fields.timesCooked.integerValue),
          };
        });
        setRecipes(formattedRecipes);
      } else {
        setError("No recipes found");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes =
    activeTab === "All Recipes"
      ? recipes
      : recipes.filter((recipe) => recipe.category === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#c084fc" />
        </TouchableOpacity>
        <Text style={styles.header}>Recipe Selection</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchRecipes}
        disabled={loading}
      >
        <Text style={styles.refreshButtonText}>
          {loading ? "Loading..." : "Refresh Recipes"}
        </Text>
      </TouchableOpacity>
      <View style={styles.soupType}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.soupCards}
        contentContainerStyle={styles.soupCardsContent}
      >
        {filteredRecipes.map((recipe) => (
          <View key={recipe.id} style={styles.soupCard}>
            <Image
              source={{ uri: recipe.imageUrl }}
              style={styles.soupCardImage}
            />
            <View style={styles.soupFeaturesContainer}>
              <Text style={styles.soupFeatures}>
                🕗 {recipe.cookingTime} min
              </Text>
              <Text style={styles.soupFeatures}>⭐ {recipe.rating}</Text>
              <Text
                style={[
                  styles.soupFeatures,
                  {
                    backgroundColor: "#c084fc",
                    shadowColor: "#c084fc",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                  },
                ]}
              >
                ✅ {recipe.timesCooked}
              </Text>
            </View>
            <Text style={styles.soupCardHeading}>{recipe.name}</Text>
            <Text style={styles.soupCardType}>{recipe.category}</Text>
            <Text style={styles.soupCardDesc}>{recipe.description}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                if (recipe.id) {
                  console.log("Navigating with soupId:", recipe.id);
                  navigation.navigate("RecipeDetails", { soupId: recipe.id });
                } else {
                  console.error("Invalid soupId:", recipe.id);
                }
              }}
            >
              <Text style={styles.selectButtonText}>Select Recipe</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: "#c084fc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  soupType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "#c084fc",
  },
  tabText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  soupCards: {
    width: "100%",
  },
  soupCardsContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  soupCard: {
    backgroundColor: "#0f0f0f",
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    paddingBottom: 10,
  },
  soupCardImage: {
    width: "100%",
    height: "50%",
    borderRadius: 10,
    opacity: 0.85,
  },
  soupFeaturesContainer: {
    position: "absolute",
    bottom: 160,
    marginHorizontal: "1%",
    flexDirection: "row",
  },
  soupFeatures: {
    backgroundColor: "#0f0f0f",
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  soupCardHeading: {
    color: "white",
    fontWeight: "600",
    fontSize: 24,
    marginLeft: "2%",
    marginTop: "1%",
  },
  soupCardType: {
    color: "#c084fc",
    marginLeft: "2%",
    fontWeight: "500",
    fontSize: 13,
  },
  soupCardDesc: {
    color: "#EFEFEF",
    flexWrap: "wrap",
    marginLeft: "2%",
    marginRight: "2%",
    fontSize: 14,
  },
  selectButton: {
    backgroundColor: "#c084fc",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "flex-end",
    marginRight: "5%",
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});

export default RecipeSelect;
