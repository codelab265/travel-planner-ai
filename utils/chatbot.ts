import { TravelPreferences } from "@/types/chat";
import { classifyIntent } from "./tensorflow";
import { generateTravelPlan } from "./planGenerator";

interface ChatbotResponse {
  message: string;
  updatedPreferences: TravelPreferences;
  showDetailedPlan?: boolean;
}

const QUESTIONS = {
  INITIAL:
    "Hi! I'm your travel planning assistant. Where would you like to go?",
  DURATION: "Great choice! How many days are you planning to stay?",
  BUDGET: "What's your budget range? (Low/Medium/High)",
  TRAVEL_TYPE:
    "What type of travel experience are you looking for? (Adventure/Relaxation/Culture/Shopping)",
  INTERESTS:
    "What are your main interests or activities you'd like to do during your trip?",
};

export async function processChatMessage(
  message: string,
  currentPreferences: TravelPreferences
): Promise<ChatbotResponse> {
  const intent = await classifyIntent(message);
  const updatedPreferences = { ...currentPreferences };
  let response = "";
  let showDetailedPlan = false;

  // Handle "yes" for detailed plan
  if (currentPreferences.interests && message.toLowerCase() === "yes") {
    const plan = generateTravelPlan(currentPreferences);
    if (plan) {
      showDetailedPlan = true;
      response = "Here's your detailed itinerary:";
    }
    return { message: response, updatedPreferences, showDetailedPlan };
  }

  // Normal conversation flow
  switch (true) {
    case !currentPreferences.destination:
      updatedPreferences.destination = message;
      response = QUESTIONS.DURATION;
      break;

    case !currentPreferences.duration:
      const days = parseInt(message);
      if (isNaN(days)) {
        response = "Please enter a valid number of days.";
      } else {
        updatedPreferences.duration = days;
        response = QUESTIONS.BUDGET;
      }
      break;

    case !currentPreferences.budget:
      const budget = message.toLowerCase();
      if (["low", "medium", "high"].includes(budget)) {
        updatedPreferences.budget = budget;
        response = QUESTIONS.TRAVEL_TYPE;
      } else {
        response = "Please specify Low, Medium, or High for your budget.";
      }
      break;

    case !currentPreferences.travelType:
      updatedPreferences.travelType = message.toLowerCase();
      response = QUESTIONS.INTERESTS;
      break;

    case !currentPreferences.interests:
      updatedPreferences.interests = message.split(",").map((i) => i.trim());
      const plan = generateTravelPlan(updatedPreferences);
      if (plan) {
        response =
          `Here's your travel plan for ${plan.destination}:\n\n` +
          `Duration: ${plan.duration.days} days\n` +
          `Budget: ${plan.budget} (${plan.totalBudgetEstimate.min}-${plan.totalBudgetEstimate.max} ${plan.totalBudgetEstimate.currency})\n\n` +
          `Would you like to see the detailed itinerary?`;
      } else {
        response =
          "I'm sorry, I couldn't generate a travel plan for your preferences.";
      }
      break;

    default:
      response =
        "I'm not sure how to help with that. Let's start over. Where would you like to go?";
      return { message: response, updatedPreferences: {} };
  }

  return {
    message: response,
    updatedPreferences,
    showDetailedPlan,
  };
}
