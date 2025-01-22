import { TravelPlan, TravelPreferences } from "@/types/chat";
import { destinations } from "@/data/travelData";

// Helper function to generate time slots
function generateTimeSlot(
  startHour: number,
  duration: string
): {
  startTime: string;
  endTime: string;
} {
  const durationInHours = parseInt(duration.split(" ")[0]);
  const start = new Date();
  start.setHours(startHour, 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + durationInHours);

  return {
    startTime: start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    endTime: end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

// Helper to create a daily schedule
function createDailySchedule(activities: any[], dayNumber: number) {
  let currentHour = 9; // Start day at 9 AM
  const LUNCH_HOUR = 12;
  const DINNER_HOUR = 19;
  const schedule = [];

  for (const activity of activities) {
    // Skip if we're past 9 PM
    if (currentHour >= 21) break;

    // Add lunch break
    if (
      currentHour <= LUNCH_HOUR &&
      currentHour + parseInt(activity.duration.split(" ")[0]) > LUNCH_HOUR
    ) {
      const { startTime, endTime } = generateTimeSlot(LUNCH_HOUR, "1 hour");
      schedule.push({
        time: startTime,
        activity: "Lunch Break",
        location: "Local Restaurant",
        duration: "1 hour",
        cost: "₱300-500",
      });
      currentHour = LUNCH_HOUR + 1;
    }

    // Add dinner break
    if (
      currentHour <= DINNER_HOUR &&
      currentHour + parseInt(activity.duration.split(" ")[0]) > DINNER_HOUR
    ) {
      const { startTime, endTime } = generateTimeSlot(DINNER_HOUR, "1 hour");
      schedule.push({
        time: startTime,
        activity: "Dinner Break",
        location: "Local Restaurant",
        duration: "1 hour",
        cost: "₱300-500",
      });
      currentHour = DINNER_HOUR + 1;
    }

    // Add activity with proper time slot
    const { startTime, endTime } = generateTimeSlot(
      currentHour,
      activity.duration
    );
    schedule.push({
      time: startTime,
      activity: activity.name,
      location: activity.location
        ? `${activity.location.latitude}, ${activity.location.longitude}`
        : "Location TBD",
      duration: activity.duration,
      cost: activity.cost,
    });

    currentHour += parseInt(activity.duration.split(" ")[0]);

    // Add travel/rest time between activities
    currentHour += 0.5; // 30 minutes buffer
  }

  return schedule;
}

export function generateTravelPlan(
  preferences: TravelPreferences
): TravelPlan | null {
  try {
    const destination = destinations[preferences.destination];
    if (!destination) return null;

    const days = preferences.duration || 3;
    const budget = preferences.budget?.toLowerCase() || "medium";
    const travelType = preferences.travelType?.toLowerCase() || "leisure";

    // Generate daily itinerary with proper scheduling
    const dailyItinerary = Array.from({ length: days }, (_, i) => {
      let dayActivities;

      // Mix activities based on travel type and day
      if (travelType === "adventure") {
        dayActivities = [
          ...destination.activities.adventure.slice(0, 2),
          ...destination.activities.culture.slice(0, 1),
        ];
      } else if (travelType === "culture") {
        dayActivities = [
          ...destination.activities.culture.slice(0, 2),
          ...destination.activities.relaxation.slice(0, 1),
        ];
      } else {
        // Balanced/leisure itinerary
        dayActivities = [
          ...destination.activities.culture.slice(0, 1),
          ...destination.activities.relaxation.slice(0, 1),
          ...destination.activities.shopping.slice(0, 1),
        ];
      }

      // Shuffle activities for variety
      dayActivities.sort(() => Math.random() - 0.5);

      return {
        day: i + 1,
        activities: createDailySchedule(dayActivities, i + 1),
      };
    });

    // Map accommodations to the new structure
    const accommodationSuggestions = destination.accommodations[budget]
      ?.slice(0, 3)
      .map((acc) => ({
        name: acc.name,
        type: "Hotel", // You might want to add this to your data
        priceRange: acc.priceRange,
        location: `${acc.location.latitude}, ${acc.location.longitude}`,
      }));

    // Map restaurants from your data
    const restaurantSuggestions = destination.attractions.restaurants
      ?.slice(0, 3)
      .map((rest) => ({
        name: rest.name,
        cuisine: "Local", // You might want to add this to your data
        priceRange: rest.cost,
      }));

    // Map malls from your data
    const mallSuggestions = destination.attractions.malls
      ?.slice(0, 3)
      .map((mall) => ({
        name: mall.name,
        description: mall.description,
        priceRange: mall.cost,
        location: mall.location
          ? `${mall.location.latitude}, ${mall.location.longitude}`
          : "Location TBD",
        highlights: mall.type,
      }));

    // Map beaches from your data
    const beachSuggestions = destination.attractions.beaches
      ?.slice(0, 3)
      .map((beach) => ({
        name: beach.name,
        description: beach.description,
        activities: beach.type,
        bestTime: "Early morning or late afternoon",
        entranceFee: beach.cost,
        location: beach.location
          ? `${beach.location.latitude}, ${beach.location.longitude}`
          : "Location TBD",
      }));

    // Generate transportation tips
    const transportationTips = destination.localTransport.map((transport) => ({
      type: transport,
      description: `Local ${transport.toLowerCase()} services`,
      estimatedCost: "Varies by distance",
    }));

    // Calculate budget estimates
    const budgetRange = destination.budgetRanges[budget];

    return {
      destination: destination.name,
      duration: {
        days,
        nights: days - 1,
      },
      budget: budget.charAt(0).toUpperCase() + budget.slice(1),
      travelType: preferences.travelType || "Leisure",
      dailyItinerary,
      accommodationSuggestions: accommodationSuggestions || [],
      restaurantSuggestions: restaurantSuggestions || [],
      mallSuggestions: mallSuggestions || [],
      beachSuggestions: beachSuggestions || [],
      transportationTips,
      totalBudgetEstimate: {
        min: budgetRange.min,
        max: budgetRange.max,
        currency: budgetRange.currency,
      },
    };
  } catch (error) {
    console.error("Error generating travel plan:", error);
    return null;
  }
}
