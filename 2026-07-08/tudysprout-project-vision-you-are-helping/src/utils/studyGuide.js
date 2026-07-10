// Study guide generation starts as simple JavaScript text processing.
// Later, this file can be swapped or extended with an AI/API version.

const commonWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "before",
  "between",
  "could",
  "during",
  "example",
  "important",
  "lecture",
  "notes",
  "other",
  "should",
  "their",
  "there",
  "these",
  "thing",
  "things",
  "through",
  "under",
  "using",
  "where",
  "which",
  "while",
  "would",
]);

export const emptyStudyGuide = {
  summary: "",
  keyTerms: [],
  quizQuestions: [],
  actionSteps: [],
};

function getSentences(notes) {
  return notes
    .replace(/\n+/g, ". ")
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function getWords(notes) {
  return notes
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 5 && !commonWords.has(word));
}

function getSummary(sentences) {
  if (sentences.length === 0) {
    return "Paste notes to create a short study summary.";
  }

  return sentences.slice(0, 2).join(". ") + ".";
}

function getKeyTerms(notes) {
  const wordCounts = new Map();

  getWords(notes).forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
  });

  return [...wordCounts.entries()]
    .sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function getQuizQuestions(keyTerms, sentences) {
  const questions = keyTerms.slice(0, 4).map((term) => {
    const readableTerm = term.replace(/-/g, " ");

    return `What does ${readableTerm} mean in these notes?`;
  });

  if (sentences.length > 0) {
    questions.push("What is the main idea of the first section?");
  }

  if (keyTerms.length >= 2) {
    questions.push(
      `How are ${keyTerms[0].replace(/-/g, " ")} and ${keyTerms[1].replace(
        /-/g,
        " ",
      )} connected?`,
    );
  }

  return questions.slice(0, 6);
}

function getActionSteps(keyTerms, quizQuestions) {
  const firstTerm = keyTerms[0]?.replace(/-/g, " ") ?? "the main idea";

  return [
    `Make flashcards for ${keyTerms.length || 1} key term${keyTerms.length === 1 ? "" : "s"}.`,
    `Explain ${firstTerm} out loud in your own words.`,
    `Answer ${Math.max(quizQuestions.length, 1)} quiz question${
      quizQuestions.length === 1 ? "" : "s"
    } without looking at the notes.`,
    "Mark anything confusing and review it again tomorrow.",
  ];
}

export function normalizeStudyGuide(savedGuide) {
  if (!savedGuide || typeof savedGuide !== "object") {
    return emptyStudyGuide;
  }

  const keepTextItems = (items) =>
    Array.isArray(items) ? items.filter((item) => typeof item === "string") : [];

  return {
    summary:
      typeof savedGuide.summary === "string"
        ? savedGuide.summary
        : emptyStudyGuide.summary,
    keyTerms: keepTextItems(savedGuide.keyTerms),
    quizQuestions: keepTextItems(savedGuide.quizQuestions),
    actionSteps: keepTextItems(savedGuide.actionSteps),
  };
}

export function generateStudyGuide(notes) {
  const trimmedNotes = notes.trim();

  if (trimmedNotes.length === 0) {
    return emptyStudyGuide;
  }

  const sentences = getSentences(trimmedNotes);
  const keyTerms = getKeyTerms(trimmedNotes);
  const quizQuestions = getQuizQuestions(keyTerms, sentences);

  return {
    summary: getSummary(sentences),
    keyTerms,
    quizQuestions,
    actionSteps: getActionSteps(keyTerms, quizQuestions),
  };
}
