interface TrainingExample {
  text: string;
  intent: number;
}

// Intent mapping
export const INTENTS = {
  UNKNOWN: 0,
  DESTINATION: 1,
  DURATION: 2,
  BUDGET: 3,
  ACTIVITY: 4,
} as const;

export function generateTrainingData(): TrainingExample[] {
  return [
    // Destination intent examples
    { text: "I want to go to Tokyo", intent: INTENTS.DESTINATION },
    { text: "I'd like to visit Paris", intent: INTENTS.DESTINATION },
    { text: "Planning a trip to Bali", intent: INTENTS.DESTINATION },
    { text: "Thinking about visiting New York", intent: INTENTS.DESTINATION },
    { text: "Can I travel to London", intent: INTENTS.DESTINATION },
    { text: "Show me options for Rome", intent: INTENTS.DESTINATION },
    {
      text: "Interested in traveling to Singapore",
      intent: INTENTS.DESTINATION,
    },
    { text: "Looking at destinations like Dubai", intent: INTENTS.DESTINATION },
    { text: "Want to explore Bangkok", intent: INTENTS.DESTINATION },
    { text: "Considering a trip to Sydney", intent: INTENTS.DESTINATION },

    // Duration intent examples
    { text: "For 5 days", intent: INTENTS.DURATION },
    { text: "About a week", intent: INTENTS.DURATION },
    { text: "Planning to stay 3 days", intent: INTENTS.DURATION },
    { text: "Two weeks vacation", intent: INTENTS.DURATION },
    { text: "10 day trip", intent: INTENTS.DURATION },
    { text: "Staying for a month", intent: INTENTS.DURATION },
    { text: "Just a weekend getaway", intent: INTENTS.DURATION },
    { text: "Four nights stay", intent: INTENTS.DURATION },
    { text: "Planning a 6-day visit", intent: INTENTS.DURATION },
    { text: "Three weeks holiday", intent: INTENTS.DURATION },

    // Budget intent examples
    { text: "Low budget trip", intent: INTENTS.BUDGET },
    { text: "Luxury vacation", intent: INTENTS.BUDGET },
    { text: "Medium budget range", intent: INTENTS.BUDGET },
    { text: "Affordable options", intent: INTENTS.BUDGET },
    { text: "High end travel", intent: INTENTS.BUDGET },
    { text: "Looking for budget-friendly options", intent: INTENTS.BUDGET },
    { text: "Premium travel experience", intent: INTENTS.BUDGET },
    { text: "Cheap travel options", intent: INTENTS.BUDGET },
    { text: "Cost-effective vacation", intent: INTENTS.BUDGET },
    { text: "Expensive luxury trip", intent: INTENTS.BUDGET },

    // Activity intent examples
    { text: "Want to go hiking", intent: INTENTS.ACTIVITY },
    { text: "Interested in museums", intent: INTENTS.ACTIVITY },
    { text: "Looking for beach activities", intent: INTENTS.ACTIVITY },
    { text: "Cultural experiences", intent: INTENTS.ACTIVITY },
    { text: "Adventure sports", intent: INTENTS.ACTIVITY },
    { text: "Sightseeing opportunities", intent: INTENTS.ACTIVITY },
    { text: "Food and dining experiences", intent: INTENTS.ACTIVITY },
    { text: "Shopping destinations", intent: INTENTS.ACTIVITY },
    { text: "Historical tours", intent: INTENTS.ACTIVITY },
    { text: "Water sports activities", intent: INTENTS.ACTIVITY },
    { text: "Local market exploration", intent: INTENTS.ACTIVITY },
    { text: "Nature photography", intent: INTENTS.ACTIVITY },
    { text: "Spa and wellness", intent: INTENTS.ACTIVITY },
    { text: "Nightlife and entertainment", intent: INTENTS.ACTIVITY },
    { text: "Art galleries and exhibitions", intent: INTENTS.ACTIVITY },
  ];
}
