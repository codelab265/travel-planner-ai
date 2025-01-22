import { TravelPlan } from "@/types/chat";

interface Location {
  latitude: number;
  longitude: number;
}

interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: string;
  transportFare?: {
    [key: string]: string; // e.g., jeepney, bus, ferry, boat, etc.
  };
  type: string[];
  location?: Location;
  image?: string;
}

interface Accommodation {
  name: string;
  location: Location;
  description: string;
  priceRange: string;
  rating: number;
  amenities: string[];
}

interface Destination {
  name: string;
  description: string;
  activities: {
    adventure: Activity[];
    culture: Activity[];
    relaxation: Activity[];
    shopping: Activity[];
  };
  accommodations: {
    low: Accommodation[];
    medium: Accommodation[];
    high: Accommodation[];
  };
  attractions: {
    tourist_spots: Activity[];
    beaches: Activity[];
    malls: Activity[];
    restaurants: Activity[];
  };
  budgetRanges: {
    low: { min: number; max: number; currency: string };
    medium: { min: number; max: number; currency: string };
    high: { min: number; max: number; currency: string };
  };
  bestTimeToVisit: string;
  localTransport: string[];
  weather: {
    high: string;
    low: string;
    rainySeason: string;
  };
}

export const destinations: { [key: string]: Destination } = {
  Davao: {
    name: "Davao",
    description:
      "Davao is a city in the Philippines known for its beautiful beaches, vibrant culture, and delicious food.",
    activities: {
      adventure: [
        {
          name: "Mount Apo Trekking",
          description: "Challenging hikes to the Philippines' highest peak.",
          duration: "8 hours",
          cost: "₱3,000",
          type: ["Adventure", "Nature"],
          location: {
            latitude: 7.067109102852828,
            longitude: 125.60621129351102,
          },
          image: "assets/mount_apo.jpg",
        },
        {
          name: "Eden Nature Park Activities",
          description:
            "Activities like ziplining, fishing, and horseback riding.",
          duration: "4 hours",
          cost: "₱1,000",
          type: ["Adventure", "Nature"],
          location: { latitude: 7.0292, longitude: 125.3993 },
          image: "assets/eden_nature_park.jpg",
        },
      ],
      culture: [
        {
          name: "Museo Dabawenyo",
          description:
            "Showcasing Davao's cultural heritage, history, and local art.",
          duration: "2 hours",
          cost: "₱50",
          type: ["Culture", "History"],
          location: { latitude: 7.0702, longitude: 125.6128 },
          image: "assets/museo_dabawenyo.jpg",
        },
        {
          name: "San Pedro Cathedral",
          description:
            "A historical Spanish-era church offering a glimpse into Davao's history.",
          duration: "1 hour",
          cost: "Free",
          type: ["Culture", "History"],
          location: { latitude: 7.065, longitude: 125.6092 },
          image: "assets/san_pedro_cathedral.jpg",
        },
      ],
      relaxation: [
        {
          name: "Pearl Farm Beach Resort Day Tour",
          description: "Luxury beach resort experience with spa treatments.",
          duration: "6 hours",
          cost: "₱4,000",
          type: ["Relaxation", "Beach"],
          location: { latitude: 7.0345, longitude: 125.7194 },
          image: "assets/pearl_farm_beach_resort.jpg",
        },
        {
          name: "Samal Island Beach Day",
          description: "Relaxing beach day with water activities.",
          duration: "8 hours",
          cost: "₱1,500",
          type: ["Relaxation", "Beach"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/samal_island.jpg",
        },
      ],
      shopping: [
        {
          name: "Abreeza Mall Shopping",
          description: "Modern shopping experience with international brands.",
          duration: "3 hours",
          cost: "Varies",
          type: ["Shopping", "Entertainment"],
          location: { latitude: 7.052909999999999, longitude: 125.36409 },
          image: "assets/abreeza_mall.jpg",
        },
        {
          name: "Local Market Tour",
          description: "Experience local products and fresh fruits.",
          duration: "2 hours",
          cost: "₱500",
          type: ["Shopping", "Culture"],
          location: {
            latitude: 7.049828965653219,
            longitude: 125.59082285488422,
          },
          image: "assets/local_market.jpg",
        },
      ],
    },
    accommodations: {
      low: [
        {
          name: "DayLight Inn",
          location: {
            latitude: 7.067109102852828,
            longitude: 125.60621129351102,
          },
          description:
            "Budget-friendly accommodation in Poblacion offering modern rooms for two travelers.",
          priceRange: "₱1,000 - ₱2,000",
          rating: 3.5,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
        {
          name: "Big Ben's Apartelle",
          location: {
            latitude: 7.088211908159698,
            longitude: 125.61560515118272,
          },
          description:
            "Convenient location in Poblacion with spacious, affordable rooms.",
          priceRange: "₱1,000 - ₱1,500",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
        {
          name: "Villa Viva Belgica",
          location: {
            latitude: 7.072546759355747,
            longitude: 125.58409872419777,
          },
          description:
            "Free car parking and Wi-Fi, located near Ma-a with easy access to attractions.",
          priceRange: "₱1,000 - ₱1,500",
          rating: 4,
          amenities: ["Free Wi-Fi", "Free Parking", "Air-conditioned Rooms"],
        },
        {
          name: "GV Hotel Davao",
          location: {
            latitude: 7.0663459819030106,
            longitude: 125.60465512604858,
          },
          description:
            "Affordable 1-star hotel with air-conditioned rooms, private bathrooms, and free Wi-Fi.",
          priceRange: "₱500 - ₱1,000",
          rating: 3,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
        {
          name: "Triple V",
          location: {
            latitude: 7.06629304818332,
            longitude: 125.61001797255354,
          },
          description:
            "Comfortable and budget-friendly in the heart of Rizal Street, Davao City.",
          priceRange: "₱1,000 - ₱1,500",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
      ],
      medium: [
        {
          name: "Sumo Asia Hotel",
          location: {
            latitude: 7.104559429267521,
            longitude: 125.6325618828057,
          },
          description:
            "Luxurious stay in Lanang with 24-hour check-in, AC rooms, and invigorating showers.",
          priceRange: "₱2,000 - ₱3,000",
          rating: 4.5,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
          ],
        },
        {
          name: "Apo View Hotel",
          location: {
            latitude: 7.069667985594482,
            longitude: 125.60803528742228,
          },
          description:
            "Features a spa, restaurant, and nightclub for a lively stay in Davao City.",
          priceRange: "₱2,000 - ₱3,000",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
            "Nightclub",
          ],
        },
        {
          name: "Blue Lotus Hotel",
          location: {
            latitude: 7.057094250333169,
            longitude: 125.60036651303034,
          },
          description:
            "Steps from Ecoland's shopping centers and Mt. Apo, ideal for two travelers.",
          priceRange: "₱1,500 - ₱2,000",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
        {
          name: "Hari Royale Suites",
          location: {
            latitude: 7.076794869755373,
            longitude: 125.61693116652613,
          },
          description:
            "Strategically situated near Poblacion's attractions with free Wi-Fi in all rooms.",
          priceRange: "₱2,000 - ₱3,000",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
        {
          name: "Home Crest Hotel",
          location: {
            latitude: 7.049828965653219,
            longitude: 125.59082285488422,
          },
          description:
            "Modern hotel offering comfort and value near Davao City's center.",
          priceRange: "₱1,500 - ₱2,000",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
          ],
        },
      ],
      high: [
        {
          name: "Acacia Hotel Davao",
          location: {
            latitude: 7.099946620562636,
            longitude: 125.62846310016512,
          },
          description:
            "Exceptional dining and convenient access to Davao's landmarks.",
          priceRange: "₱3,000 - ₱5,000",
          rating: 5,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
            "Pool",
            "Gym",
          ],
        },
        {
          name: "Grand Regal Hotel",
          location: {
            latitude: 7.1037080436527535,
            longitude: 125.64102169536218,
          },
          description: "Offers a casino, sauna, pool, and karaoke in Lanang.",
          priceRange: "₱3,000 - ₱5,000",
          rating: 4.5,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
            "Pool",
            "Gym",
            "Casino",
            "Sauna",
            "Karaoke",
          ],
        },
        {
          name: "Dusit Thani Residence",
          location: {
            latitude: 7.1089609055804805,
            longitude: 125.65077102419822,
          },
          description:
            "Luxury residence with restaurants, spa, gym, and outdoor pool.",
          priceRange: "₱4,000 - ₱6,000",
          rating: 5,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
            "Pool",
            "Gym",
            "Outdoor Pool",
          ],
        },
        {
          name: "Microtel by Wyndham Davao",
          location: {
            latitude: 7.102680923038357,
            longitude: 125.63270213954144,
          },
          description:
            "Modern hotel offering excellent staff and spacious accommodations.",
          priceRange: "₱2,000 - ₱3,000",
          rating: 4.5,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
            "Pool",
            "Gym",
          ],
        },
        {
          name: "Seda Hotel",
          location: {
            latitude: 7.0895962546163505,
            longitude: 125.61013820700349,
          },
          description:
            "Opposite Abreeza Mall with a fitness center, pool, and modern amenities.",
          priceRange: "₱2,000 - ₱3,000",
          rating: 4,
          amenities: [
            "Free Wi-Fi",
            "Private Bathroom",
            "Air-conditioned Rooms",
            "Spa",
            "Restaurant",
            "Pool",
            "Gym",
          ],
        },
      ],
    },
    attractions: {
      tourist_spots: [
        {
          name: "People's Park",
          description:
            "A serene public park with sculptures, perfect for leisurely walks or picnics.",
          duration: "2 hours",
          cost: "Free",
          type: ["Tourist Spot"],
          location: { latitude: 7.0705, longitude: 125.6085 },
          image: "assets/peoples_park.jpg",
        },
        {
          name: "Davao Crocodile Park",
          description:
            "Home to reptiles and birds, offering interactive educational tours.",
          duration: "1 hour",
          cost: "₱150 - ₱250",
          type: ["Tourist Spot"],
          location: { latitude: 7.0971, longitude: 125.5993 },
          image: "assets/davao_crocodile_park.jpg",
        },
        {
          name: "Museo Dabawenyo",
          description:
            "Showcasing Davao's cultural heritage, history, and local art.",
          duration: "2 hours",
          cost: "₱50 - ₱100",
          type: ["Tourist Spot"],
          location: { latitude: 7.0702, longitude: 125.6128 },
          image: "assets/museo_dabawenyo.jpg",
        },
        {
          name: "San Pedro Cathedral",
          description:
            "A historical Spanish-era church offering a glimpse into Davao's history.",
          duration: "1 hour",
          cost: "Free",
          type: ["Tourist Spot"],
          location: { latitude: 7.065, longitude: 125.6092 },
          image: "assets/san_pedro_cathedral.jpg",
        },
        {
          name: "Eden Nature Park (Day Pass)",
          description:
            "Eco-tourism park with hiking trails and natural beauty.",
          duration: "1 hour",
          cost: "₱100 - ₱150",
          type: ["Tourist Spot"],
          location: { latitude: 7.0292, longitude: 125.3993 },
          image: "assets/eden_nature_park.jpg",
        },
      ],
      beaches: [
        {
          name: "Dahican Beach",
          description:
            "This crescent-shaped beach is famous for its crystal-clear waters and white sand. It's a paradise for surfers and skimboarders.",
          duration: "2 hours",
          cost: "₱100",
          transportFare: {
            jeepney: "₱50",
            bus: "₱150",
            van: "₱200",
            habal: "₱100",
          },
          type: ["Beach"],
          location: { latitude: 7.0705, longitude: 125.6085 },
          image: "assets/dahican_beach.jpg",
        },
        {
          name: "Samal Island",
          description:
            "Known for its pristine beaches, clear waters, and vibrant marine life. Popular activities include snorkeling, diving, and beach camping.",
          duration: "8 hours",
          cost: "₱1,500",
          transportFare: {
            ferry: "₱100",
            boat: "₱800",
            private: "₱2,000",
          },
          type: ["Beach"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/samal_island.jpg",
        },
        {
          name: "Gumasa Beach",
          description:
            "Dubbed as the 'Small Boracay of the South,' it boasts powdery white sand and calm turquoise waters.",
          duration: "2 hours",
          cost: "₱100",
          transportFare: {
            bus: "₱200",
            van: "₱250",
            private: "₱2,500",
          },
          type: ["Beach"],
          location: { latitude: 5.49574, longitude: 125.12298 },
          image: "assets/gumasa_beach.jpg",
        },
        {
          name: "Talikud Island",
          description:
            "A hidden gem with secluded beaches and excellent dive sites. It's a peaceful retreat from the city's hustle.",
          duration: "2 hours",
          cost: "₱100",
          transportFare: {
            ferry: "₱150",
            boat: "₱1,000",
            private: "₱2,500",
          },
          type: ["Beach"],
          location: { latitude: 6.55294, longitude: 125.41186 },
          image: "assets/talikud_island.jpg",
        },
        {
          name: "GEMCrystal Water Resort",
          description:
            "A beautiful water resort with crystal clear waters and modern amenities.",
          duration: "Full day",
          cost: "₱100",
          transportFare: {
            regular: "₱100",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/gemcrystal_resort.jpg",
        },
        {
          name: "Caliclic Beach Resort",
          description:
            "Affordable beach resort with basic amenities and peaceful atmosphere.",
          duration: "Full day",
          cost: "₱50",
          transportFare: {
            regular: "₱50",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/caliclic_beach.jpg",
        },
        {
          name: "Zariel Private Island Resort",
          description:
            "Exclusive private island resort offering a unique beach experience.",
          duration: "Full day",
          cost: "₱200",
          transportFare: {
            regular: "₱150-200",
          },
          type: ["Beach", "Resort", "Private"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/zariel_island.jpg",
        },
        {
          name: "Muni Muni Beach Resort",
          description:
            "Relaxing beach resort perfect for unwinding and beach activities.",
          duration: "Full day",
          cost: "₱100",
          transportFare: {
            regular: "₱100",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/munimuni_beach.jpg",
        },
        {
          name: "Pearl Farm Beach Resort",
          description:
            "Luxury beach resort with world-class amenities and stunning views.",
          duration: "Full day",
          cost: "₱4000",
          transportFare: {
            regular: "₱150",
          },
          type: ["Beach", "Resort", "Luxury"],
          location: { latitude: 7.0345, longitude: 125.7194 },
          image: "assets/pearl_farm_beach.jpg",
        },
        {
          name: "Island Buenavista",
          description:
            "Scenic island resort offering panoramic ocean views and water activities.",
          duration: "Full day",
          cost: "₱500",
          transportFare: {
            regular: "₱300",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/island_buenavista.jpg",
        },
        {
          name: "Maxima Beach House",
          description:
            "Cozy beach house with homey atmosphere and direct beach access.",
          duration: "Full day",
          cost: "₱150",
          transportFare: {
            regular: "₱100",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/maxima_beach.jpg",
        },
        {
          name: "Linden Beach Resort",
          description:
            "Family-friendly beach resort with various recreational facilities.",
          duration: "Full day",
          cost: "₱200",
          transportFare: {
            regular: "₱150",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/linden_beach.jpg",
        },
        {
          name: "Mansud Shores",
          description:
            "Peaceful shoreline resort offering water sports and beach activities.",
          duration: "Full day",
          cost: "₱200",
          transportFare: {
            regular: "₱150",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/mansud_shores.jpg",
        },
        {
          name: "Hayahay Beach Resort",
          description:
            "Laid-back beach resort perfect for relaxation and swimming.",
          duration: "Full day",
          cost: "₱200",
          transportFare: {
            regular: "₱150",
          },
          type: ["Beach", "Resort"],
          location: { latitude: 7.0485, longitude: 125.7355 },
          image: "assets/hayahay_beach.jpg",
        },
      ],
      malls: [
        {
          name: "Abreeza Mall",
          description:
            "This upscale mall is located in the heart of the city and offers a wide range of shops, restaurants, and entertainment options.",
          duration: "3 hours",
          cost: "Varies",
          type: ["Mall"],
          location: { latitude: 7.052909999999999, longitude: 125.36409 },
          image: "assets/abreeza_mall.jpg",
        },
        {
          name: "SM Lanang Premier",
          description:
            "A large mall in the Lanang district known for its modern design and wide variety of stores.",
          duration: "2 hours",
          cost: "₱100",
          type: ["Mall"],
          location: { latitude: 7.05571, longitude: 125.37517 },
          image: "assets/sm_lanang_premier.jpg",
        },
        {
          name: "Gaisano Mall of Davao",
          description:
            "A popular choice for budget-conscious shoppers with a good selection of shops and restaurants.",
          duration: "2 hours",
          cost: "₱100",
          type: ["Mall"],
          location: { latitude: 7.04408, longitude: 125.36491 },
          image: "assets/gaisano_mall.jpg",
        },
        {
          name: "SM City Davao",
          description:
            "Located in the Matina district, it's a popular spot for shopping and dining.",
          duration: "2 hours",
          cost: "₱100",
          type: ["Mall"],
          location: { latitude: 7.02596, longitude: 125.35178 },
          image: "assets/sm_city_davao.jpg",
        },
        {
          name: "Victoria Plaza",
          description:
            "A convenient location with easy access to public transportation, ideal for a day out with family and friends.",
          duration: "2 hours",
          cost: "₱100",
          type: ["Mall"],
          location: { latitude: 7.05097, longitude: 125.36412 },
          image: "assets/victoria_plaza.jpg",
        },
      ],
      restaurants: [
        {
          name: "Bondi & Bourke",
          description:
            "A fine dining restaurant known for its upscale ambiance and high-quality Western dishes.",
          duration: "2 hours",
          cost: "₱1,000",
          type: ["Restaurant"],
          location: { latitude: 7.0405, longitude: 125.36221 },
          image: "assets/bondi_bourke.jpg",
        },
        {
          name: "Blue Posts Boiling Crabs and Shrimp",
          description:
            "Perfect for seafood lovers, offering crab and shrimp meals served in large portions.",
          duration: "2 hours",
          cost: "₱1,000",
          type: ["Restaurant"],
          location: { latitude: 7.05585, longitude: 125.37343 },
          image: "assets/blue_posts.jpg",
        },
        {
          name: "Madayaw Café at Dusit D2 Davao",
          description:
            "Features an all-day dining menu with Pan-Asian and Western specialties.",
          duration: "2 hours",
          cost: "₱1,000",
          type: ["Restaurant"],
          location: { latitude: 7.0634, longitude: 125.39019 },
          image: "assets/madayaw_cafe.jpg",
        },
        {
          name: "The Fat Cow",
          description:
            "A cozy spot for creative, gourmet meals with fresh ingredients and artful plating.",
          duration: "2 hours",
          cost: "₱1,000",
          type: ["Restaurant"],
          location: { latitude: 7.04343, longitude: 125.3626 },
          image: "assets/the_fat_cow.jpg",
        },
        {
          name: "Garden Bay Restaurant & Resort",
          description:
            "A vibrant ambiance with dishes like Binagoongang Baboy and live entertainment.",
          duration: "2 hours",
          cost: "₱1,000",
          type: ["Restaurant"],
          location: { latitude: 7.06301, longitude: 125.3906 },
          image: "assets/garden_bay.jpg",
        },
      ],
    },
    budgetRanges: {
      low: { min: 1000, max: 3000, currency: "₱" },
      medium: { min: 3000, max: 7000, currency: "₱" },
      high: { min: 7000, max: 15000, currency: "₱" },
    },
    bestTimeToVisit: "November to May",
    localTransport: ["Jeepney", "Tricycle", "Taxi"],
    weather: {
      high: "30°C",
      low: "22°C",
      rainySeason: "June to November",
    },
  },
};
