import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const WELCOME_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function WelcomeScreen() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkPreviousLogin();
  }, []);

  const checkPreviousLogin = async () => {
    try {
      const lastLoginTime = await AsyncStorage.getItem("lastLoginTime");
      const currentTime = Date.now();

      if (
        lastLoginTime &&
        currentTime - parseInt(lastLoginTime) < WELCOME_TIMEOUT
      ) {
        router.replace("/(tabs)");
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error checking login status:", e);
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (username.trim().length < 2) {
      setError("Please enter a valid name (minimum 2 characters)");
      return;
    }

    try {
      await Promise.all([
        AsyncStorage.setItem("username", username.trim()),
        AsyncStorage.setItem("lastLoginTime", Date.now().toString()),
      ]);
      router.replace("/(tabs)");
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <MaterialIcons name="travel-explore" size={80} color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.primary, "#2E1065"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

      <View style={styles.content}>
        <MaterialIcons name="travel-explore" size={80} color="white" />
        <Text style={styles.title}>Davao Wanderer</Text>
        <Text style={styles.subtitle}>
          Your personal guide to explore the wonders of Davao
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError("");
            }}
            placeholder="Enter your name"
            placeholderTextColor="#rgba(255,255,255,0.5)"
            autoFocus
            autoCorrect={false}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Start Exploring</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 1000,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: width * 0.2,
    left: -width * 0.1,
  },
  circle3: {
    width: width * 0.3,
    height: width * 0.3,
    top: width * 0.5,
    right: width * 0.2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    maxWidth: "80%",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 30,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  errorText: {
    color: "#FFA5A5",
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
