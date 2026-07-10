// These starter assignments let us build the UI before we connect a database.
// Later, this file can be replaced with data from Firebase, Supabase, or Canvas.
export const sampleAssignments = [
  {
    id: "history-essay",
    course: "History",
    title: "Civil Rights Essay",
    dueInDays: 2,
    estimatedHours: 5,
    completedHours: 1.5,
    availableHoursThisWeek: 4,
    recentFocusScore: 62,
    startHere: "Open the essay prompt and choose one source to quote.",
    tasks: [
      {
        id: "history-prompt",
        label: "Read the prompt and underline the question",
        minutes: 20,
      },
      {
        id: "history-outline",
        label: "Make a 3-part outline",
        minutes: 35,
      },
      {
        id: "history-source",
        label: "Find one strong quote",
        minutes: 30,
      },
    ],
  },
  {
    id: "biology-quiz",
    course: "Biology",
    title: "Cell Structure Quiz",
    dueInDays: 4,
    estimatedHours: 3,
    completedHours: 1,
    availableHoursThisWeek: 5,
    recentFocusScore: 78,
    startHere: "Review the organelle diagram for five quiet minutes.",
    tasks: [
      {
        id: "bio-diagram",
        label: "Label a blank cell diagram",
        minutes: 25,
      },
      {
        id: "bio-flashcards",
        label: "Review 12 organelle flashcards",
        minutes: 20,
      },
      {
        id: "bio-practice",
        label: "Answer 8 practice questions",
        minutes: 30,
      },
    ],
  },
  {
    id: "math-set",
    course: "Algebra",
    title: "Quadratics Problem Set",
    dueInDays: 1,
    estimatedHours: 2,
    completedHours: 0.5,
    availableHoursThisWeek: 1,
    recentFocusScore: 55,
    startHere: "Solve the first problem with notes open.",
    tasks: [
      {
        id: "math-example",
        label: "Redo one class example",
        minutes: 15,
      },
      {
        id: "math-first-five",
        label: "Finish problems 1 through 5",
        minutes: 35,
      },
      {
        id: "math-check",
        label: "Check answers and mark confusing steps",
        minutes: 20,
      },
    ],
  },
];
