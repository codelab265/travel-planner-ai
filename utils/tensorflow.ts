import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { createModel, trainModel } from "./tensorflow/model";
import { generateTrainingData, INTENTS } from "./tensorflow/trainingData";
import { loadTokenizer, tokenize } from "./tensorflow/tokenizer";
import {
  saveModel,
  loadSavedModel,
  saveTokenizer,
  loadSavedTokenizer,
} from "./tensorflow/storage";
import { initializeTensorFlow } from "./tensorflow/init";

let model: tf.LayersModel | null = null;
let tokenizer: Awaited<ReturnType<typeof loadTokenizer>> | null = null;

export async function loadModel() {
  try {
    console.log("Starting model loading process...");

    // Initialize TensorFlow first
    await initializeTensorFlow();
    console.log("TensorFlow.js initialized successfully");

    // Try to load saved model and tokenizer
    console.log("Attempting to load saved model and tokenizer...");
    const savedModel = await loadSavedModel();
    const savedTokenizer = await loadSavedTokenizer();

    if (savedModel && savedTokenizer) {
      console.log("Found existing model and tokenizer");
      model = savedModel;
      tokenizer = savedTokenizer;
      return true;
    }

    // If no saved model exists, create and train a new one
    console.log("No saved model found, creating new model...");
    model = await createModel();
    tokenizer = await loadTokenizer();

    // Save tokenizer immediately after creation
    await saveTokenizer(tokenizer);
    console.log("Tokenizer initialized and saved");

    // Train model with minimal epochs for faster startup
    const trainingData = generateTrainingData();
    await trainModel(
      model,
      trainingData.map((example) => example.text),
      trainingData.map((example) => example.intent)
    );

    // Save the trained model
    await saveModel(model);
    console.log("Model saved successfully");

    return true;
  } catch (error) {
    console.error("Error in loadModel:", error);
    return false;
  }
}

export async function classifyIntent(text: string): Promise<string> {
  if (!model || !tokenizer) {
    throw new Error("Model not initialized");
  }

  try {
    const sequence = await tokenize(text, tokenizer, 20);
    const input = tf.tensor2d([sequence]);
    const prediction = model.predict(input) as tf.Tensor;

    // Get confidence scores before disposing
    const scores = await prediction.data();
    const maxScore = Math.max(...Array.from(scores));

    // Get intent index before disposing
    const intentIndex = (await prediction.argMax(1).data())[0];

    // Clean up tensors
    input.dispose();
    prediction.dispose();

    // If confidence is too low, use fallback keyword matching
    if (maxScore < 0.5) {
      return fallbackIntentClassification(text);
    }

    switch (intentIndex) {
      case INTENTS.DESTINATION:
        return "destination";
      case INTENTS.DURATION:
        return "duration";
      case INTENTS.BUDGET:
        return "budget";
      case INTENTS.ACTIVITY:
        return "activity";
      default:
        return "unknown";
    }
  } catch (error) {
    console.error("Error classifying intent:", error);
    // Use fallback mechanism if AI classification fails
    return fallbackIntentClassification(text);
  }
}

// Fallback keyword-based intent classification
function fallbackIntentClassification(text: string): string {
  const lowercaseText = text.toLowerCase();

  if (
    lowercaseText.includes("go to") ||
    lowercaseText.includes("visit") ||
    lowercaseText.includes("travel to")
  ) {
    return "destination";
  }

  if (
    lowercaseText.includes("day") ||
    lowercaseText.includes("week") ||
    lowercaseText.includes("month")
  ) {
    return "duration";
  }

  if (
    lowercaseText.includes("budget") ||
    lowercaseText.includes("cost") ||
    lowercaseText.includes("price") ||
    lowercaseText.includes("expensive") ||
    lowercaseText.includes("cheap")
  ) {
    return "budget";
  }

  if (
    lowercaseText.includes("activity") ||
    lowercaseText.includes("do") ||
    lowercaseText.includes("experience") ||
    lowercaseText.includes("see")
  ) {
    return "activity";
  }

  return "unknown";
}
