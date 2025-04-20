import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PaymentScreen = ({ navigation, route }) => {
  const { recipes = [], quantities = {} } = route.params || {};
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateUpiId = (id) => {
    const upiRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(id);
  };

  const handlePay = () => {
    setShowUpiModal(true);
    setUpiId("");
    setUpiError("");
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleUpiPay = () => {
    if (!upiId) {
      setUpiError("Please enter a UPI ID");
      return;
    }
    if (!validateUpiId(upiId)) {
      setUpiError("Invalid UPI ID format (e.g., user@upi)");
      return;
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowUpiModal(false);
      navigation.navigate("CookingScreen", { recipes, quantities });
    });
  };

  const handleCloseUpiModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowUpiModal(false);
      setUpiId("");
      setUpiError("");
    });
  };

  const totalAmount = Object.values(quantities).reduce(
    (sum, qty) => sum + qty * 100,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#c084fc" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {recipes.length === 0 ? (
          <Text style={styles.emptyText}>No items to pay for</Text>
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
                <Text style={styles.soupAmount}>
                  Amount: ₹{(quantities[recipe.id] || 1) * 100}
                </Text>
              </View>
            </View>
          ))
        )}
        <Text style={styles.totalAmount}>Total: ₹{totalAmount}</Text>
        <TouchableOpacity
          style={[
            styles.payButton,
            recipes.length === 0 && styles.disabledButton,
          ]}
          onPress={handlePay}
          disabled={recipes.length === 0}
        >
          <Text style={styles.payButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </ScrollView>
      {showUpiModal && (
        <View style={styles.blurOverlay}>
          <Animated.View style={[styles.upiModal, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.upiCloseButton}
              onPress={handleCloseUpiModal}
            >
              <Ionicons name="close" size={24} color="#c084fc" />
            </TouchableOpacity>
            <Image
              source={{
                uri: "https://www.pngall.com/wp-content/uploads/5/UPI-Logo-PNG.png",
              }}
              style={styles.upiImage}
            />
            <Text style={styles.upiTitle}>UPI Payment</Text>
            <TextInput
              style={[styles.upiInput, upiError && styles.upiInputError]}
              placeholder="Enter UPI ID (e.g., user@upi)"
              placeholderTextColor="#d1d1d1"
              value={upiId}
              onChangeText={(text) => {
                setUpiId(text);
                setUpiError("");
              }}
            />
            {upiError && <Text style={styles.upiErrorText}>{upiError}</Text>}
            <Text style={styles.upiAmount}>Amount: ₹{totalAmount}</Text>
            <TouchableOpacity
              style={styles.upiPayButton}
              onPress={handleUpiPay}
            >
              <Text style={styles.upiPayText}>Pay</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
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
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
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
    width: 80,
    height: 80,
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
    marginBottom: 5,
  },
  soupAmount: {
    color: "#4ade80",
    fontSize: 14,
    fontWeight: "600",
  },
  totalAmount: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 20,
    textAlign: "right",
  },
  payButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "#a066d9",
    opacity: 0.7,
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  upiModal: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  upiCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  upiImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 20,
  },
  upiTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  upiInput: {
    backgroundColor: "#334155",
    color: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c084fc",
    width: "100%",
    marginBottom: 12,
    fontSize: 16,
  },
  upiInputError: {
    borderColor: "#ef4444",
  },
  upiErrorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  upiAmount: {
    color: "#c084fc",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  upiPayButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  upiPayText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default PaymentScreen;
