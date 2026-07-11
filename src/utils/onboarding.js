// These defaults let StudySprout work even before the user fills out onboarding.
export const defaultOnboardingAnswers = {
  focusTime: "afternoon",
  startStyle: "mixed",
  focusMinutes: "25",
  hardestSubjects: [],
  sessionPreference: "balanced",
  underestimatesTime: "sometimes",
};

const subjectKeywordMap = {
  math: ["math", "algebra", "geometry", "calculus", "statistics"],
  science: ["science", "biology", "chemistry", "physics", "lab"],
  english: ["english", "literature", "writing", "essay", "reading"],
  history: ["history", "social studies", "government", "civics"],
  languages: ["language", "spanish", "french", "mandarin", "latin"],
  "computer-science": ["computer", "coding", "programming", "software"],
};

export function normalizeOnboardingAnswers(savedAnswers = {}) {
  return {
    ...defaultOnboardingAnswers,
    ...savedAnswers,
    hardestSubjects: Array.isArray(savedAnswers.hardestSubjects)
      ? savedAnswers.hardestSubjects
      : defaultOnboardingAnswers.hardestSubjects,
  };
}

export function getPreferredFocusMinutes(onboardingAnswers) {
  return Number(onboardingAnswers.focusMinutes) || Number(defaultOnboardingAnswers.focusMinutes);
}

export function prefersShortTasks(onboardingAnswers) {
  return (
    onboardingAnswers.sessionPreference === "short" ||
    getPreferredFocusMinutes(onboardingAnswers) <= 25
  );
}

export function isDifficultSubject(courseName, onboardingAnswers) {
  const normalizedCourseName = courseName.toLowerCase();

  return onboardingAnswers.hardestSubjects.some((subject) => {
    const keywords = subjectKeywordMap[subject] ?? [subject];

    return keywords.some((keyword) => normalizedCourseName.includes(keyword));
  });
}
