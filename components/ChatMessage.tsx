import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Message } from "@/types/chat";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const colorScheme = useColorScheme();
  const isBot = message.sender === "bot";

  return (
    <ThemedView
      style={[
        styles.container,
        isBot ? styles.botContainer : styles.userContainer,
      ]}
      lightColor={isBot ? Colors.light.background : Colors.light.tint}
      darkColor={isBot ? Colors.dark.background : Colors.dark.tint}
    >
      <ThemedText
        style={styles.text}
        lightColor={isBot ? Colors.light.text : "#fff"}
        darkColor={isBot ? Colors.dark.text : "#fff"}
      >
        {message.text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  botContainer: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  text: {
    fontSize: 16,
  },
});
