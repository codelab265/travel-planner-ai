export interface Location {
  latitude: number;
  longitude: number;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

export interface TravelPreferences {
  destination?: string;
  duration?: number;
  budget?: "low" | "medium" | "high";
  travelType?: string;
  interests?: string[];
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: string;
  transportFare?: {
    [key: string]: string;
  };
  location?: Location;
  type: string[];
  image?: string;
}

export interface Accommodation {
  name: string;
  description: string;
  priceRange: string;
  rating: number;
  location: Location;
  amenities: string[];
}

export interface Weather {
  high: string;
  low: string;
  rainySeason: string;
}

export interface BudgetEstimate {
  min: number;
  max: number;
  currency: string;
}

export interface Duration {
  days: number;
  nights?: number;
}

interface DailyActivity {
  time: string;
  activity: string;
  location: string;
  duration: string;
  cost: string;
}

interface DayItinerary {
  day: number;
  activities: DailyActivity[];
}

interface AccommodationSuggestion {
  name: string;
  type: string;
  priceRange: string;
  location: string;
}

interface RestaurantSuggestion {
  name: string;
  cuisine: string;
  priceRange: string;
}

interface MallSuggestion {
  name: string;
  description: string;
  priceRange: string;
  location: string;
  highlights: string[];
}

interface BeachSuggestion {
  name: string;
  description: string;
  activities: string[];
  bestTime: string;
  entranceFee: string;
  location: string;
}

interface TransportationTip {
  type: string;
  description: string;
  estimatedCost: string;
}

export interface TravelPlan {
  id?: string;
  createdAt?: string;
  destination: string;
  duration: {
    days: number;
    nights: number;
  };
  budget: string;
  travelType: string;
  dailyItinerary: DayItinerary[];
  accommodationSuggestions: AccommodationSuggestion[];
  restaurantSuggestions: RestaurantSuggestion[];
  mallSuggestions: MallSuggestion[];
  beachSuggestions: BeachSuggestion[];
  transportationTips: TransportationTip[];
  totalBudgetEstimate: {
    min: number;
    max: number;
    currency: string;
  };
}
