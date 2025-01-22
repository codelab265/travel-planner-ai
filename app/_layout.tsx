import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TravelPlansProvider } from "@/contexts/TravelPlansContext";
import { TensorFlowProvider } from "@/contexts/TensorFlowContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TravelPlansProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="plan/[id]"
            options={({ navigation }) => ({
              title: "Plan Details",
              headerBackTitle: "Plans",
            })}
          />
          <Stack.Screen name="not-found" options={{ title: "Oops!" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TravelPlansProvider>
  );
}
