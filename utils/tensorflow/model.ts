import * as tf from "@tensorflow/tfjs";
import { loadTokenizer, tokenize } from "./tokenizer";
import { SEQUENCE_LENGTH, VOCAB_SIZE, NUM_INTENTS } from "./constants";

export async function createModel(): Promise<tf.LayersModel> {
  try {
    console.log("Starting model creation...");
    console.log("Model parameters:", {
      vocabSize: VOCAB_SIZE,
      sequenceLength: SEQUENCE_LENGTH,
      numIntents: NUM_INTENTS,
    });

    const model = tf.sequential();
    console.log("Sequential model created");

    // Add embedding layer first
    console.log("Adding embedding layer...");
    model.add(
      tf.layers.embedding({
        inputDim: VOCAB_SIZE,
        outputDim: 16,
        inputLength: SEQUENCE_LENGTH,
      })
    );
    console.log("Embedding layer added");

    // Add flatten layer after embedding
    console.log("Adding flatten layer...");
    model.add(tf.layers.flatten());
    console.log("Flatten layer added");

    // Simple dense layers
    console.log("Adding dense layers...");
    model.add(tf.layers.dense({ units: 32, activation: "relu" })); // Reduced from 64
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: NUM_INTENTS, activation: "softmax" }));
    console.log("Dense layers added");

    // Compile model
    console.log("Compiling model...");
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
    console.log("Model compiled successfully");

    return model;
  } catch (error) {
    console.error("Error in createModel:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

export async function trainModel(
  model: tf.LayersModel,
  trainData: string[],
  trainLabels: number[]
): Promise<void> {
  try {
    console.log("Starting model training...");
    console.log("Training data size:", trainData.length);

    const tokenizer = await loadTokenizer();
    console.log("Tokenizer loaded");

    console.log("Tokenizing training data...");
    const sequences = await Promise.all(
      trainData.map((text) => tokenize(text, tokenizer, SEQUENCE_LENGTH))
    );
    console.log("Data tokenization completed");

    console.log("Creating tensors...");
    const xs = tf.tensor2d(sequences);
    const ys = tf.oneHot(tf.tensor1d(trainLabels, "int32"), NUM_INTENTS);
    console.log("Tensors created");

    console.log("Starting model fitting...");
    await model.fit(xs, ys, {
      epochs: 3,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(
            `Epoch ${epoch + 1}: loss = ${logs?.loss}, accuracy = ${
              logs?.accuracy
            }`
          );
        },
      },
    });
    console.log("Model training completed");

    // Clean up tensors
    xs.dispose();
    ys.dispose();
  } catch (error) {
    console.error("Error in trainModel:", error);
    throw error;
  }
}
