// localStorage is a tiny browser storage area for one device and one browser.
// It is useful for this stage because it keeps data after refreshes without
// needing accounts, a backend, or a database yet.
import { normalizeOnboardingAnswers } from "./onboarding.js";
import { emptyStudyGuide, normalizeStudyGuide } from "./studyGuide.js";

export const STORAGE_KEYS = {
  addedAssignments: "studysprout.addedAssignments",
  assignmentNotes: "studysprout.assignmentNotes",
  completedTaskIds: "studysprout.completedTaskIds",
  gardenCoins: "studysprout.gardenCoins",
  gardenStageId: "studysprout.gardenStageId",
  onboardingAnswers: "studysprout.onboardingAnswers",
  studyGuideDraft: "studysprout.studyGuideDraft",
};

const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

function canUseLocalStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function readJson(key, fallbackValue) {
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  try {
    const savedValue = window.localStorage.getItem(key);

    if (savedValue === null) {
      return fallbackValue;
    }

    return JSON.parse(savedValue);
  } catch {
    // If saved data ever becomes unreadable, StudySprout falls back gracefully
    // instead of showing a blank screen.
    return fallbackValue;
  }
}

function writeJson(key, value) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    // localStorage can only store strings, so arrays and objects are converted
    // into JSON text before saving.
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing or if the browser is full. The app
    // should still work for the current session even if saving fails.
  }
}

export function loadAddedAssignments() {
  const savedAssignments = readJson(STORAGE_KEYS.addedAssignments, []);

  if (!Array.isArray(savedAssignments)) {
    return [];
  }

  // Saved data can outlive code changes while you are building the app. This
  // normalizes user-created assignments so older localStorage data cannot crash
  // the dashboard, planner, or risk predictor.
  return savedAssignments
    .map((assignment, index) => normalizeSavedAssignment(assignment, index))
    .filter(Boolean);
}

export function saveAddedAssignments(assignments) {
  writeJson(STORAGE_KEYS.addedAssignments, assignments);
}

export function loadCompletedTaskIds(fallbackTaskIds) {
  const savedTaskIds = readJson(STORAGE_KEYS.completedTaskIds, fallbackTaskIds);

  if (!Array.isArray(savedTaskIds)) {
    return fallbackTaskIds;
  }

  return savedTaskIds.filter((taskId) => typeof taskId === "string");
}

export function saveCompletedTaskIds(taskIds) {
  writeJson(STORAGE_KEYS.completedTaskIds, taskIds);
}

export function loadGardenCoins(fallbackCoins = 0) {
  const savedCoins = readJson(STORAGE_KEYS.gardenCoins, fallbackCoins);

  return Number.isFinite(savedCoins) && savedCoins >= 0
    ? Math.floor(savedCoins)
    : fallbackCoins;
}

export function saveGardenCoins(coins) {
  const safeCoins = Number.isFinite(coins) ? coins : 0;

  // Coins are saved as a number. Math.max keeps the saved value from going
  // below zero if a task is unchecked.
  writeJson(STORAGE_KEYS.gardenCoins, Math.max(Math.floor(safeCoins), 0));
}

export function loadGardenStageId(fallbackStageId = "stage-1") {
  const savedStageId = readJson(STORAGE_KEYS.gardenStageId, fallbackStageId);

  return typeof savedStageId === "string" ? savedStageId : fallbackStageId;
}

export function saveGardenStageId(stageId) {
  writeJson(STORAGE_KEYS.gardenStageId, stageId);
}

export function loadOnboardingAnswers() {
  return normalizeOnboardingAnswers(readJson(STORAGE_KEYS.onboardingAnswers, {}));
}

export function saveOnboardingAnswers(answers) {
  writeJson(STORAGE_KEYS.onboardingAnswers, normalizeOnboardingAnswers(answers));
}

export function loadStudyGuideDraft() {
  const fallbackDraft = {
    notes: "",
    studyGuide: emptyStudyGuide,
  };
  const savedDraft = readJson(STORAGE_KEYS.studyGuideDraft, {
    notes: "",
    studyGuide: emptyStudyGuide,
  });

  if (!savedDraft || typeof savedDraft !== "object") {
    return fallbackDraft;
  }

  return {
    notes: typeof savedDraft.notes === "string" ? savedDraft.notes : "",
    studyGuide: normalizeStudyGuide(savedDraft.studyGuide),
  };
}

export function saveStudyGuideDraft(draft) {
  // This keeps the saved shape predictable: one notes string plus one generated
  // guide object. Predictable localStorage data is easier to debug while
  // learning.
  writeJson(STORAGE_KEYS.studyGuideDraft, {
    notes: typeof draft.notes === "string" ? draft.notes : "",
    studyGuide: normalizeStudyGuide(draft.studyGuide),
  });
}

export function loadAssignmentNote(assignmentId) {
  const savedNotes = readJson(STORAGE_KEYS.assignmentNotes, {});

  if (!savedNotes || typeof savedNotes !== "object") {
    return "";
  }

  return typeof savedNotes[assignmentId] === "string"
    ? savedNotes[assignmentId]
    : "";
}

export function saveAssignmentNote(assignmentId, note) {
  const savedNotes = readJson(STORAGE_KEYS.assignmentNotes, {});
  const safeNotes =
    savedNotes && typeof savedNotes === "object" ? savedNotes : {};

  // Notes are stored separately from assignments so a future database can keep
  // assignment fields and student reflections as separate pieces of data.
  writeJson(STORAGE_KEYS.assignmentNotes, {
    ...safeNotes,
    [assignmentId]: note,
  });
}

export function clearStudySproutStorage() {
  if (!canUseLocalStorage()) {
    return;
  }

  // The reset button removes only StudySprout's own keys so other sites and
  // browser data are left alone.
  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

function normalizeSavedAssignment(assignment, index) {
  if (!assignment || typeof assignment !== "object") {
    return null;
  }

  const id =
    typeof assignment.id === "string" && assignment.id.trim()
      ? assignment.id
      : `saved-assignment-${index + 1}`;
  const rawTasks = Array.isArray(assignment.tasks) ? assignment.tasks : [];
  const tasks = rawTasks
    .map((task, taskIndex) => normalizeSavedTask(task, taskIndex, id))
    .filter(Boolean);
  const safeTasks =
    tasks.length > 0
      ? tasks
      : [
          {
            id: `${id}-task-1`,
            label: "Open the assignment and choose one tiny first step.",
            minutes: 10,
          },
        ];
  const estimatedHours = getSafeNumber(
    assignment.estimatedHours,
    Math.max(
      0.5,
      safeTasks.reduce((sum, task) => sum + task.minutes, 0) / 60,
    ),
  );
  const difficulty = VALID_DIFFICULTIES.includes(assignment.difficulty)
    ? assignment.difficulty
    : "medium";

  return {
    ...assignment,
    id,
    course:
      typeof assignment.course === "string" && assignment.course.trim()
        ? assignment.course.trim()
        : "Study",
    title:
      typeof assignment.title === "string" && assignment.title.trim()
        ? assignment.title.trim()
        : "Untitled assignment",
    dueDate: typeof assignment.dueDate === "string" ? assignment.dueDate : "",
    dueInDays: Math.max(Math.floor(getSafeNumber(assignment.dueInDays, 0)), 0),
    difficulty,
    estimatedHours,
    completedHours: getSafeNumber(assignment.completedHours, 0),
    availableHoursThisWeek: Math.max(
      1,
      Math.floor(getSafeNumber(assignment.availableHoursThisWeek, estimatedHours)),
    ),
    recentFocusScore: Math.max(
      0,
      Math.min(Math.floor(getSafeNumber(assignment.recentFocusScore, 70)), 100),
    ),
    startHere:
      typeof assignment.startHere === "string" && assignment.startHere.trim()
        ? assignment.startHere.trim()
        : safeTasks[0].label,
    tasks: safeTasks,
  };
}

function normalizeSavedTask(task, index, assignmentId) {
  if (!task || typeof task !== "object") {
    return null;
  }

  const label =
    typeof task.label === "string" && task.label.trim()
      ? task.label.trim()
      : `Study step ${index + 1}`;

  return {
    id:
      typeof task.id === "string" && task.id.trim()
        ? task.id
        : `${assignmentId}-task-${index + 1}`,
    label,
    minutes: Math.max(5, Math.round(getSafeNumber(task.minutes, 10))),
  };
}

function getSafeNumber(value, fallbackValue) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallbackValue;
}
