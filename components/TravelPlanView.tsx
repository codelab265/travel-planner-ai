import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TravelPlan } from "@/types/chat";

const openLocation = (location: string) => {
  const query = encodeURIComponent(location);
  const scheme = Platform.select({
    ios: "maps:0,0?q=",
    android: "geo:0,0?q=",
  });
  const url = Platform.select({
    ios: `maps://app?q=${query}`,
    android: `google.navigation:q=${query}`,
    default: `https://www.google.com/maps/search/?api=1&query=${query}`,
  });

  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      // Fallback to browser if maps app isn't available
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${query}`
      );
    }
  });
};

const LocationButton = ({ location }: { location: string }) => (
  <Pressable
    onPress={() => openLocation(location)}
    style={({ pressed }) => [
      styles.locationButton,
      pressed && styles.locationButtonPressed,
    ]}
  >
    <MaterialIcons name="location-on" size={16} color={Colors.primary} />
    <Text style={styles.locationButtonText}>Open in Maps</Text>
  </Pressable>
);

interface TravelPlanViewProps {
  plan: TravelPlan;
  onBackToChat?: () => void;
}

export function TravelPlanView({ plan, onBackToChat }: TravelPlanViewProps) {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header with Background */}
        <ImageBackground
          source={require("@/assets/images/travel-bg.png")}
          style={styles.header}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          >
            <Text style={styles.headerTitle}>{plan.destination}</Text>
            <Text style={styles.headerSubtitle}>
              {plan.duration.days} Days, {plan.duration.nights} Nights
            </Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {plan.travelType} • {plan.budget}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Daily Itinerary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="event" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Daily Itinerary</Text>
          </View>
          {plan.dailyItinerary?.map((day) => (
            <View key={day.day} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>Day {day.day}</Text>
              {day.activities?.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityName}>{activity.activity}</Text>
                    <View style={styles.locationContainer}>
                      {activity.location && (
                        <LocationButton location={activity.location} />
                      )}
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.detailText}>
                        ⏱ {activity.duration}
                      </Text>
                      <Text style={styles.detailText}>💰 {activity.cost}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Accommodations */}
        {plan.accommodationSuggestions?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="hotel" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Where to Stay</Text>
            </View>
            {plan.accommodationSuggestions?.map((acc, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.itemTitle}>{acc.name}</Text>
                <Text style={styles.itemType}>{acc.type}</Text>
                <Text style={styles.itemPrice}>💰 {acc.priceRange}</Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.itemLocation}>📍 Location:</Text>
                  <LocationButton location={acc.location} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Restaurants */}
        {plan.restaurantSuggestions?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="restaurant"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Where to Eat</Text>
            </View>
            {plan.restaurantSuggestions?.map((rest, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.itemTitle}>{rest.name}</Text>
                <Text style={styles.itemType}>{rest.cuisine} Cuisine</Text>
                <Text style={styles.itemPrice}>💰 {rest.priceRange}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Malls */}
        {plan.mallSuggestions?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="shopping-bag"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Shopping Spots</Text>
            </View>
            {plan.mallSuggestions?.map((mall, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.itemTitle}>{mall.name}</Text>
                <Text style={styles.itemDescription}>{mall.description}</Text>
                <Text style={styles.itemPrice}>💰 {mall.priceRange}</Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.itemLocation}>📍 Location:</Text>
                  <LocationButton location={mall.location} />
                </View>
                <View style={styles.highlightsContainer}>
                  {mall?.highlights?.map((highlight, i) => (
                    <Text key={i} style={styles.highlight}>
                      • {highlight}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Beaches */}
        {plan.beachSuggestions?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="beach-access"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Beach Destinations</Text>
            </View>
            {plan.beachSuggestions?.map((beach, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.itemTitle}>{beach.name}</Text>
                <Text style={styles.itemDescription}>{beach.description}</Text>
                <Text style={styles.itemPrice}>
                  Entrance: {beach.entranceFee}
                </Text>
                <Text style={styles.itemTime}>
                  ⏰ Best time: {beach.bestTime}
                </Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.itemLocation}>📍 Location:</Text>
                  <LocationButton location={beach.location} />
                </View>
                <View style={styles.activitiesContainer}>
                  {beach?.activities?.map((activity, i) => (
                    <Text key={i} style={styles.activity}>
                      • {activity}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Transportation */}
        {plan.transportationTips?.length > 0 && (
          <View style={[styles.card, styles.lastCard]}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="emoji-transportation"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Getting Around</Text>
            </View>
            {plan.transportationTips?.map((tip, index) => (
              <View key={index} style={styles.transportItem}>
                <Text style={styles.transportType}>{tip.type}</Text>
                <Text style={styles.transportDescription}>
                  {tip.description}
                </Text>
                <Text style={styles.transportCost}>💰 {tip.estimatedCost}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Budget Summary */}
        <View style={[styles.card, styles.lastCard]}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.cardTitle}>Total Budget</Text>
          </View>
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetRange}>
              {plan.totalBudgetEstimate.currency}{" "}
              {plan.totalBudgetEstimate.min.toLocaleString()} -{" "}
              {plan.totalBudgetEstimate.currency}{" "}
              {plan.totalBudgetEstimate.max.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {onBackToChat && (
        <Pressable
          style={({ pressed }) => [
            styles.fabButton,
            pressed && styles.fabButtonPressed,
          ]}
          onPress={onBackToChat}
        >
          <MaterialIcons name="chat" size={24} color="white" />
          <Text style={styles.fabText}>Back to Chat</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 250,
    justifyContent: "flex-end",
  },
  gradient: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
    marginTop: 8,
  },
  headerBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  headerBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    margin: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lastCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: Colors.primary,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 8,
  },
  activityItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  activityTime: {
    width: 60,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  activityDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.primary,
  },
  suggestionItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  itemType: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
    marginVertical: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  highlightsContainer: {
    marginTop: 8,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 8,
  },
  highlight: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  activitiesContainer: {
    marginTop: 8,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 8,
  },
  activity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  transportItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  transportType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  transportDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  transportCost: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
  budgetContainer: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  budgetRange: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  locationButtonPressed: {
    opacity: 0.7,
  },
  locationButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
