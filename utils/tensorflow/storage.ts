import * as FileSystem from "expo-file-system";
import * as tf from "@tensorflow/tfjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const MODEL_DIR = `${FileSystem.documentDirectory}model`;
const MODEL_JSON_PATH = `${MODEL_DIR}/model.json`;
const MODEL_WEIGHTS_PATH = `${MODEL_DIR}/weights.bin`;
const TOKENIZER_KEY = "@travel_tokenizer";

interface ModelInfo {
  version: string;
  lastUpdated: string;
}

export async function saveModel(
  model: tf.LayersModel,
  version: string = "1.0.0"
): Promise<void> {
  try {
    console.log("Starting model save...");

    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(MODEL_DIR);
    if (!dirInfo.exists) {
      console.log("Creating model directory...");
      await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
    }

    // Save model using custom IO handler
    console.log("Saving model files...");
    await model.save(
      tf.io.withSaveHandler(async (artifacts) => {
        // Save model topology
        await FileSystem.writeAsStringAsync(
          MODEL_JSON_PATH,
          JSON.stringify({
            modelTopology: artifacts.modelTopology,
            format: "layers-model",
            generatedBy: "TensorFlow.js tfjs-layers",
            convertedBy: null,
            weightsManifest: [
              {
                paths: ["model.weights.bin"],
                weights: artifacts.weightSpecs,
              },
            ],
          })
        );

        // Save weights
        if (artifacts.weightData) {
          const weightsPath = `${MODEL_DIR}/model.weights.bin`;
          const buffer = Buffer.from(artifacts.weightData);
          await FileSystem.writeAsStringAsync(
            weightsPath,
            buffer.toString("base64"),
            { encoding: FileSystem.EncodingType.Base64 }
          );
        }

        return { modelArtifactsInfo: { dateSaved: new Date() } };
      })
    );

    // Save model info
    const modelInfo: ModelInfo = {
      version,
      lastUpdated: new Date().toISOString(),
    };
    await AsyncStorage.setItem("@travel_model_info", JSON.stringify(modelInfo));

    console.log("Model saved successfully");
  } catch (error) {
    console.error("Error saving model:", error);
    throw new Error("Failed to save model");
  }
}

export async function loadSavedModel(): Promise<tf.LayersModel | null> {
  try {
    console.log("Attempting to load saved model...");

    // Check if model files exist
    const jsonInfo = await FileSystem.getInfoAsync(MODEL_JSON_PATH);
    const weightsInfo = await FileSystem.getInfoAsync(
      `${MODEL_JSON_PATH}.weights.bin`
    );

    if (!jsonInfo.exists || !weightsInfo.exists) {
      console.log("No saved model found");
      return null;
    }

    // Load model
    const model = await tf.loadLayersModel(`file://${MODEL_JSON_PATH}`);
    console.log("Model loaded successfully");
    return model;
  } catch (error) {
    console.error("Error loading saved model:", error);
    return null;
  }
}

export async function saveTokenizer(tokenizer: any): Promise<void> {
  try {
    await AsyncStorage.setItem(TOKENIZER_KEY, JSON.stringify(tokenizer));
  } catch (error) {
    console.error("Error saving tokenizer:", error);
    throw new Error("Failed to save tokenizer");
  }
}

export async function loadSavedTokenizer(): Promise<any | null> {
  try {
    const savedTokenizer = await AsyncStorage.getItem(TOKENIZER_KEY);
    return savedTokenizer ? JSON.parse(savedTokenizer) : null;
  } catch (error) {
    console.error("Error loading tokenizer:", error);
    return null;
  }
}

export async function clearSavedModel(): Promise<void> {
  try {
    await FileSystem.deleteAsync(MODEL_DIR, { idempotent: true });
    await AsyncStorage.removeItem("@travel_model_info");
    await AsyncStorage.removeItem(TOKENIZER_KEY);
  } catch (error) {
    console.error("Error clearing saved model:", error);
    throw new Error("Failed to clear saved model");
  }
}
