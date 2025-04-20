import React, { useContext } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";
import Counter from "./Counter";

export default function Cart({ navigation }) {
  const { cartItems, updateQuantity, removeItem, clearCart } =
    useContext(CartContext);

  const handlePayNow = () => {
    const recipes = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      category: item.category || "Unknown",
      ingredients: item.ingredients || [],
      steps: item.steps || [],
    }));
    const quantities = cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});
    navigation.navigate("PaymentScreen", { recipes, quantities });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SoupConfig")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#c084fc" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
      </View>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <TouchableOpacity
            style={[
              styles.clearButton,
              cartItems.length === 0 && styles.disabledButton,
            ]}
            onPress={clearCart}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
          <ScrollView style={styles.cartList}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemActions}>
                    <Counter
                      onCountChange={(count) => updateQuantity(item.id, count)}
                      initialCount={item.quantity}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.payButton,
              cartItems.length === 0 && styles.disabledButton,
            ]}
            onPress={handlePayNow}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#d1d1d1",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: "#4ade80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#a066d9",
    opacity: 0.7,
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
});
