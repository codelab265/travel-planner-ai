interface Tokenizer {
  wordIndex: { [key: string]: number };
  indexWord: { [key: string]: string };
}

// Simple preprocessing function
function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

// Create a vocabulary from the training data
export async function createTokenizer(texts: string[]): Promise<Tokenizer> {
  const wordCounts = new Map<string, number>();
  const wordIndex: { [key: string]: number } = { "<PAD>": 0, "<UNK>": 1 };
  const indexWord: { [key: string]: string } = { "0": "<PAD>", "1": "<UNK>" };
  let index = 2;

  // Count word frequencies
  texts.forEach((text) => {
    const words = preprocessText(text).split(/\s+/);
    words.forEach((word) => {
      const count = wordCounts.get(word) || 0;
      wordCounts.set(word, count + 1);
    });
  });

  // Sort by frequency and create word indices
  Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 998) // Keep top words (1000 - 2 special tokens)
    .forEach(([word]) => {
      wordIndex[word] = index;
      indexWord[index.toString()] = word;
      index++;
    });

  return { wordIndex, indexWord };
}

// Convert text to sequence of indices
export async function tokenize(
  text: string,
  tokenizer: Tokenizer,
  maxLength: number
): Promise<number[]> {
  const words = preprocessText(text).split(/\s+/);
  const sequence = words.map(
    (word) => tokenizer.wordIndex[word] || tokenizer.wordIndex["<UNK>"]
  );

  // Pad or truncate to maxLength
  if (sequence.length > maxLength) {
    return sequence.slice(0, maxLength);
  } else {
    return [
      ...sequence,
      ...Array(maxLength - sequence.length).fill(tokenizer.wordIndex["<PAD>"]),
    ];
  }
}

// Load pre-trained tokenizer
export async function loadTokenizer(): Promise<Tokenizer> {
  // In a real app, you would load a pre-trained tokenizer
  // For now, we'll create a simple one with some common travel-related words
  const commonWords = [
    "go",
    "visit",
    "travel",
    "day",
    "days",
    "week",
    "budget",
    "low",
    "medium",
    "high",
    "adventure",
    "culture",
    "relaxation",
    "shopping",
    "food",
    "beach",
    "mountain",
    "city",
    "museum",
    "hotel",
    "flight",
    "train",
    "bus",
    "car",
    "want",
    "like",
    "plan",
    "trip",
    "vacation",
    "holiday",
    "cost",
    "price",
    "expensive",
    "cheap",
    "affordable",
    "luxury",
    "backpack",
    "tour",
    "guide",
    "explore",
    "see",
    "experience",
    "stay",
    "night",
    "morning",
    "evening",
    "afternoon",
    "restaurant",
    "cafe",
    "bar",
    "park",
    "garden",
    "temple",
    "shrine",
  ];

  const wordIndex: { [key: string]: number } = { "<PAD>": 0, "<UNK>": 1 };
  const indexWord: { [key: string]: string } = { "0": "<PAD>", "1": "<UNK>" };

  commonWords.forEach((word, i) => {
    const index = i + 2;
    wordIndex[word] = index;
    indexWord[index.toString()] = word;
  });

  return { wordIndex, indexWord };
}
