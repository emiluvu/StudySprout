// Assignment helpers turn form data into the same shape as the sample data.
// This keeps the dashboard components simple because every assignment looks alike.

const difficultySettings = {
  easy: {
    availableHoursMultiplier: 1.4,
    recentFocusScore: 82,
  },
  medium: {
    availableHoursMultiplier: 1,
    recentFocusScore: 70,
  },
  hard: {
    availableHoursMultiplier: 0.75,
    recentFocusScore: 58,
  },
};

function createSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function calculateDueInDays(dueDateValue) {
  const today = new Date();
  const dueDate = new Date(`${dueDateValue}T00:00:00`);
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.max(
    0,
    Math.ceil((dueDate.getTime() - todayStart.getTime()) / millisecondsPerDay),
  );
}

function getTaskLabels(taskSteps) {
  return taskSteps
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean);
}

// This is the one place where form fields become dashboard-ready assignment data.
export function createAssignmentFromForm(formData) {
  const taskLabels = getTaskLabels(formData.taskSteps);
  const safeTaskLabels =
    taskLabels.length > 0
      ? taskLabels
      : ["Open the assignment and choose one tiny first step."];
  const estimatedHours = Number(formData.estimatedHours);
  const difficulty = formData.difficulty || "medium";
  const settings = difficultySettings[difficulty] ?? difficultySettings.medium;
  const assignmentId = `${createSlug(formData.course)}-${createSlug(
    formData.title,
  )}-${Date.now()}`;
  const minutesPerTask = Math.max(
    10,
    Math.round((estimatedHours * 60) / safeTaskLabels.length),
  );

  return {
    id: assignmentId,
    course: formData.course.trim(),
    title: formData.title.trim(),
    dueDate: formData.dueDate,
    dueInDays: calculateDueInDays(formData.dueDate),
    difficulty,
    estimatedHours,
    completedHours: 0,
    availableHoursThisWeek: Math.max(
      1,
      Math.round(estimatedHours * settings.availableHoursMultiplier),
    ),
    recentFocusScore: settings.recentFocusScore,
    startHere: safeTaskLabels[0],
    tasks: safeTaskLabels.map((label, index) => ({
      id: `${assignmentId}-task-${index + 1}`,
      label,
      minutes: minutesPerTask,
    })),
  };
}
