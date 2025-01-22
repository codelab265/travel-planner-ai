export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

export interface TravelPreferences {
  destination?: string;
  duration?: number;
  budget?: string;
  travelType?: string;
  interests?: string[];
}

export interface TravelPlan {
  destination: string;
  duration: {
    days: number;
    nights: number;
  };
  budget: string;
  travelType: string;
  dailyItinerary: Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      duration: string;
      cost: string;
    }>;
  }>;
  accommodationSuggestions: Array<{
    name: string;
    type: string;
    priceRange: string;
    location: string;
  }>;
  totalBudgetEstimate: {
    min: number;
    max: number;
    currency: string;
  };
}
