import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTravelPlans } from "@/contexts/TravelPlansContext";
import { TravelPlanView } from "@/components/TravelPlanView";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { plans, removePlan } = useTravelPlans();
  const router = useRouter();

  const plan = plans?.find((p) => p.id === id);

  const handleDelete = () => {
    Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete this travel plan?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removePlan(id as string);
            router.back();
          },
        },
      ]
    );
  };

  if (!plan) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Plan not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <TravelPlanView plan={plan} />
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: Colors.primary,
          borderRadius: 30,
          padding: 16,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <MaterialIcons
          name="delete"
          size={24}
          color="white"
          onPress={handleDelete}
        />
      </View>
    </View>
  );
}
