import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Pressable,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTravelPlans } from "@/contexts/TravelPlansContext";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { TravelPlan } from "@/types/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { formatDistanceToNow } from "date-fns";

export default function PlansScreen() {
  const { plans, chats } = useTravelPlans();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [lastChat, setLastChat] = useState<string | null>(null);

  useEffect(() => {
    loadUsername();
    updateGreeting();
    loadLastChat();
  }, []);

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (e) {
      console.error("Error loading username:", e);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  };

  const loadLastChat = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("chatMessages");
      if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        if (messages.length > 0) {
          setLastChat(messages[0].text);
        }
      }
    } catch (error) {
      console.error("Error loading last chat:", error);
    }
  };

  const handlePlanPress = (planId: string) => {
    router.push(`/plan/${planId}`);
  };

  const handleNewPlan = () => {
    router.push("/(tabs)/assistant");
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadUsername();
    updateGreeting();
    setRefreshing(false);
  }, []);

  const renderPlanCard = ({ item: plan }: { item: TravelPlan }) => {
    if (!plan) return null;

    const totalActivities = plan.dailyItinerary?.reduce(
      (total, day) => total + (day.activities?.length || 0),
      0
    );

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handlePlanPress(plan.id!)}
      >
        {/* Header Section */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.destinationContainer}>
              <MaterialIcons name="place" size={24} color={Colors.primary} />
              <Text style={styles.destination}>{plan.destination}</Text>
            </View>
            <View style={styles.dateContainer}>
              <MaterialIcons name="event" size={16} color="#666" />
              <Text style={styles.dateText}>
                {new Date(plan.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.durationBadge}>
            <MaterialIcons name="schedule" size={16} color="white" />
            <Text style={styles.durationText}>
              {plan.duration?.days} Days, {plan.duration?.nights} Nights
            </Text>
          </View>
          <View style={styles.budgetBadge}>
            <Text style={styles.budgetText}>{plan.budget?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.highlightsSection}>
          <Text style={styles.sectionTitle}>Trip Highlights</Text>
          <View style={styles.highlights}>
            <View style={styles.highlightItem}>
              <MaterialIcons name="hotel" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.highlightLabel}>Accommodations</Text>
                <Text style={styles.highlightText}>
                  {plan.accommodationSuggestions?.length || 0} Hotels
                </Text>
              </View>
            </View>
            <View style={styles.highlightItem}>
              <MaterialIcons name="explore" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.highlightLabel}>Activities</Text>
                <Text style={styles.highlightText}>
                  {totalActivities} Places
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Budget Section */}
        <View style={styles.budgetSection}>
          <Text style={styles.sectionTitle}>Estimated Budget</Text>
          <View style={styles.budgetContainer}>
            <MaterialIcons
              name="account-balance-wallet"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.budgetAmount}>
              {plan.totalBudgetEstimate?.currency}{" "}
              {plan.totalBudgetEstimate?.min.toLocaleString()} -{" "}
              {plan.totalBudgetEstimate?.max.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.tagContainer}>
            <MaterialIcons name="label" size={16} color="#666" />
            <Text style={styles.tagText}>{plan.travelType}</Text>
          </View>
          <Pressable style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
            <MaterialIcons
              name="arrow-forward"
              size={16}
              color={Colors.primary}
            />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderChatList = () => {
    if (!chats || chats.length === 0)
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="flight" size={48} color={Colors.primary} />
          <Text style={styles.emptyText}>No travel plans yet</Text>
          <Text style={styles.emptySubtext}>
            Start planning your next adventure!
          </Text>
        </View>
      );

    return (
      <View style={styles.chatListContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Chats</Text>
          <Text style={styles.subtitle}>
            {chats.length} {chats.length === 1 ? "Chat" : "Chats"}
          </Text>
        </View>

        {chats.map((chat) => (
          <Pressable
            key={chat.id}
            style={({ pressed }) => [
              styles.chatCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/assistant",
                params: { chatId: chat.id },
              })
            }
          >
            <View style={styles.chatInfo}>
              <MaterialIcons name="chat" size={24} color={Colors.primary} />
              <View style={styles.chatDetails}>
                <Text style={styles.chatTitle} numberOfLines={1}>
                  {chat.title || "New Chat"}
                </Text>
                <Text style={styles.chatLastMessage} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>
            </View>
            <Text style={styles.chatTime}>
              {formatDistanceToNow(new Date(chat.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Pressable style={styles.newPlanButton} onPress={handleNewPlan}>
            <LinearGradient
              colors={[Colors.primary, "#2E1065"]}
              style={styles.gradientButton}
            >
              <MaterialIcons name="add" size={24} color="white" />
              <Text style={styles.buttonText}>Create New Plan</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {renderChatList()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  destinationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  destination: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  tripDetails: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    paddingTop: 0,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  highlightsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  highlights: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  highlightLabel: {
    fontSize: 12,
    color: "#666",
  },
  highlightText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  budgetSection: {
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tagText: {
    fontSize: 14,
    color: "#666",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  quickActions: {
    padding: 20,
  },
  newPlanButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  plansHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  lastChatCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lastChatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  lastChatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  lastChatText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  chatListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chatCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chatDetails: {
    marginLeft: 12,
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  chatLastMessage: {
    fontSize: 14,
    color: "#666",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
});
