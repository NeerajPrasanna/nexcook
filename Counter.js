import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Counter = ({ onCountChange, initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  const handleCountChange = (newCount) => {
    if (newCount >= 0) {
      setCount(newCount);
      onCountChange(newCount);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleCountChange(count - 1)}
        style={styles.button}
        disabled={count === 0}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.count}>{count}</Text>
      <TouchableOpacity
        onPress={() => handleCountChange(count + 1)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 5,
    flexShrink: 1,
  },
  button: {
    backgroundColor: "transparent",
    borderColor: "#c084fc",
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#c084fc",
    fontSize: 16,
    fontWeight: "bold",
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c084fc",
    marginHorizontal: 10,
  },
});

export default Counter;
