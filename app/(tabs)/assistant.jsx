import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { GiftedChat, Message } from "react-native-gifted-chat";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { Instructions } from "@/data/data";
import { useTravelPlans } from "@/contexts/TravelPlansContext";
import { useLocalSearchParams, useRouter } from "expo-router";

const Assistant = () => {
  const [messages, setMessages] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const apiKey = `${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`;
  const { chatId } = useLocalSearchParams();
  const { addChat, updateChat, getChatById } = useTravelPlans();
  const router = useRouter();
  const currentChatId = useRef(chatId);
  const saveTimeout = useRef(null);

  const initChat = useCallback(async () => {
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: Instructions,
      });

      const generationConfig = {
        temperature: 1.45,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      };

      const newChatSession = model.startChat({
        generationConfig,
        history: [],
      });

      setChatSession(newChatSession);
    } catch (error) {
      console.error("Error initializing chat:", error);
      Alert.alert("Error", "Failed to initialize chat. Please try again.");
    }
  }, []);

  useEffect(() => {
    currentChatId.current = chatId;
    loadExistingChat();
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [chatId]);

  const loadExistingChat = async () => {
    try {
      if (chatId) {
        const existingChat = getChatById(chatId);
        if (existingChat) {
          setMessages(existingChat.messages || []);
        }
      }
      await initChat();
    } catch (error) {
      console.error("Error loading chat:", error);
      Alert.alert("Error", "Failed to load chat history. Please try again.");
    }
  };

  const saveChat = async (newMessages, userMessage, assistantMessage) => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      saveTimeout.current = setTimeout(async () => {
        if (currentChatId.current) {
          await updateChat(currentChatId.current, newMessages);
        } else {
          const newChatId = await addChat({
            title: userMessage.text,
            lastMessage: assistantMessage.text,
            messages: newMessages,
          });
          if (newChatId) {
            currentChatId.current = newChatId;
            router.setParams({ chatId: newChatId });
          }
        }
      }, 500);
    } catch (error) {
      console.error("Error saving chat:", error);
      Alert.alert("Error", "Failed to save chat. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSend = useCallback(
    async (newMessages = []) => {
      const userMessage = newMessages[0];
      if (!userMessage?.text?.trim()) return;

      try {
        const updatedMessages = GiftedChat.append(messages, newMessages);
        setMessages(updatedMessages);

        if (chatSession) {
          setIsTyping(true);
          const result = await chatSession.sendMessage(userMessage.text);
          const response = await result.response.text();
          console.log("Response:", response);

          const assistantMessage = {
            _id: Date.now().toString(),
            text: response,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Assistant",
              avatar: "https://placehold.co/100x100/png",
            },
          };

          const newUpdatedMessages = GiftedChat.append(updatedMessages, [
            assistantMessage,
          ]);
          setMessages(newUpdatedMessages);

          await saveChat(newUpdatedMessages, userMessage, assistantMessage);
        }
      } catch (error) {
        console.error("Error in chat:", error);
        Alert.alert("Error", "Failed to send message. Please try again.");
      } finally {
        setIsTyping(false);
      }
    },
    [chatSession, messages]
  );

  const startNewConversation = async () => {
    try {
      setMessages([]);
      currentChatId.current = null;
      router.setParams({ chatId: null });
      await initChat();
    } catch (error) {
      console.error("Error starting new conversation:", error);
      Alert.alert(
        "Error",
        "Failed to start new conversation. Please try again."
      );
    }
  };

  const processMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "$1");
  };

  const handleLinkPress = async (url) => {
    try {
      // Clean and validate the URL
      if (!url) {
        console.error("Invalid URL:", url);
        Alert.alert("Error", "Invalid link format");
        return;
      }

      // Ensure the URL is properly encoded
      const encodedUrl = encodeURI(url);
      const supported = await Linking.canOpenURL(encodedUrl);

      if (supported) {
        await Linking.openURL(encodedUrl);
      } else {
        // Try opening in Google Maps app with a different format
        const coordinates = url.match(/query=([-\d.]+),([-\d.]+)/);
        if (coordinates) {
          const [_, lat, lng] = coordinates;
          const mapsUrl = `google.navigation:q=${lat},${lng}`;
          const canOpenMaps = await Linking.canOpenURL(mapsUrl);

          if (canOpenMaps) {
            await Linking.openURL(mapsUrl);
          } else {
            // Fallback to browser
            await Linking.openURL(encodedUrl);
          }
        } else {
          Alert.alert("Error", "Cannot open this link");
        }
      }
    } catch (error) {
      console.error("Error opening link:", error);
      Alert.alert("Error", "Failed to open link");
    }
  };

  const renderMessageText = (text) => {
    // Updated regex to better handle Google Maps links
    const linkRegex =
      /\[([^\]]+)\]\((https:\/\/(?:www\.)?google\.com\/maps\/[^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Process text before the link with bold formatting
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(
          <Text key={`text-${lastIndex}`}>
            {beforeText.split("**").map((part, index) => (
              <Text
                key={index}
                style={index % 2 === 1 ? styles.boldText : null}
              >
                {part}
              </Text>
            ))}
          </Text>
        );
      }

      // Add the link with proper URL extraction
      const [fullMatch, linkText, url] = match;
      if (url) {
        parts.push(
          <Text
            key={`link-${match.index}`}
            style={styles.link}
            onPress={() => handleLinkPress(url)}
          >
            {linkText}
          </Text>
        );
      }

      lastIndex = match.index + fullMatch.length;
    }

    // Process remaining text with bold formatting
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(
        <Text key={`text-${lastIndex}`}>
          {remainingText.split("**").map((part, index) => (
            <Text key={index} style={index % 2 === 1 ? styles.boldText : null}>
              {part}
            </Text>
          ))}
        </Text>
      );
    }

    return parts;
  };

  const renderMessage = useCallback((props) => {
    const message = props.currentMessage;
    if (!message) return null;

    if (message.user._id === 2) {
      return (
        <View style={styles.messageBubbleContainer}>
          <View style={styles.assistantBubble}>
            <Text style={styles.messageText}>
              {renderMessageText(message.text)}
            </Text>
          </View>
        </View>
      );
    }
    return <Message {...props} />;
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={startNewConversation}
      >
        <Text style={styles.buttonText}>New Conversation</Text>
      </TouchableOpacity>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        isTyping={isTyping}
        renderAvatar={null}
        placeholder="Type your message here..."
        renderMessage={renderMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  newChatButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  messageBubbleContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  assistantBubble: {
    backgroundColor: "#E8EAF7",
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
    color: "#007AFF",
    fontSize: 18,
  },
  link: {
    color: "red",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});

export default Assistant;
