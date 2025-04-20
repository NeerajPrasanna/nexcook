import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ModuleHealth({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://firestore.googleapis.com/v1/projects/nexcook-ab40a/databases/(default)/documents/modules/"
      );
      const data = await response.json();
      if (data.documents && Array.isArray(data.documents)) {
        const formattedModules = data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            id: fields.id?.stringValue || `unknown-${Math.random()}`,
            name: fields.name?.stringValue || "Unknown Module",
            currentLevel: parseInt(fields.currentLevel?.integerValue) || 0,
            maxLevel: parseInt(fields.maxLevel?.integerValue) || 100,
            unit: fields.unit?.stringValue || "",
            status: fields.status?.stringValue || "normal",
            icon: fields.icon?.stringValue || "help",
            threshold: parseInt(fields.threshold?.integerValue) || 0,
          };
        });
        setModules(formattedModules);
      } else {
        setError("No modules found");
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    Flame: "flame",
    Soup: "fast-food",
    CoffeeIcon: "cafe",
    Utensils: "restaurant",
    Droplets: "water",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "#4ade80";
      case "warning":
        return "#f59e0b";
      case "critical":
        return "#ef4444";
      default:
        return "#4ade80";
    }
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
        <Text style={styles.headerText}>Module Health</Text>
      </View>
      <TouchableOpacity
        style={[styles.refreshButton, loading && styles.disabledButton]}
        onPress={fetchModules}
        disabled={loading}
      >
        <Text style={styles.refreshButtonText}>
          {loading ? "Loading..." : "Refresh Modules"}
        </Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c084fc" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : modules.length === 0 ? (
          <Text style={styles.placeholderText}>No modules available</Text>
        ) : (
          modules.map((module) => (
            <View key={module.id} style={styles.moduleItem}>
              <View style={styles.moduleHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={iconMap[module.icon] || "help"}
                    size={20}
                    color="#c084fc"
                  />
                </View>
                <Text style={styles.moduleName}>{module.name}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        (module.currentLevel / module.maxLevel) * 100
                      }%`,
                      backgroundColor:
                        module.currentLevel <= module.threshold
                          ? "#ef4444"
                          : "#c084fc",
                    },
                  ]}
                />
              </View>
              <View style={styles.moduleDetailsRow}>
                <Text style={styles.moduleDetails}>
                  {module.currentLevel} / {module.maxLevel} {module.unit}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(module.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.moduleStatus,
                      { color: getStatusColor(module.status) },
                    ]}
                  >
                    {module.status.charAt(0).toUpperCase() +
                      module.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 16,
    paddingTop: 50,
    marginBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 20,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#a066d9",
    opacity: 0.7,
  },
  refreshButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  moduleItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#334155",
    borderRadius: 12,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  moduleName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#475569",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  moduleDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moduleDetails: {
    color: "#e2e8f0",
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  moduleStatus: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  placeholderText: {
    color: "#d1d1d1",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
