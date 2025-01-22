import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  return (
    <ThemedView style={styles.container}>
      <IconSymbol
        name="exclamationmark.triangle.fill"
        size={48}
        color={tintColor}
      />
      <ThemedText style={styles.message}>{message}</ThemedText>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { borderColor: tintColor }]}
          onPress={onRetry}
        >
          <ThemedText style={[styles.retryText, { color: tintColor }]}>
            Try Again
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 16,
  },
});
