import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

// Polyfill react-native-fs with expo-file-system
(global as any).readFileAssets = async (filepath: string) => {
  const content = await FileSystem.readAsStringAsync(filepath);
  return content;
};

export async function initializeTensorFlow() {
  try {
    console.log("Starting TensorFlow initialization...");

    // Wait for tf to be ready
    await tf.ready();
    console.log("TF Ready completed");

    // Force the backend to CPU for better compatibility
    if (Platform.OS !== "web") {
      console.log("Setting backend to CPU...");
      await tf.setBackend("cpu");
      console.log("Backend set successfully");
    }

    const backend = tf.getBackend();
    console.log("Current backend:", backend);

    // Test tensor creation
    const testTensor = tf.tensor([1, 2, 3]);
    console.log("Test tensor created:", testTensor.shape);
    testTensor.dispose();

    return true;
  } catch (error) {
    console.error("TensorFlow initialization failed:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}
