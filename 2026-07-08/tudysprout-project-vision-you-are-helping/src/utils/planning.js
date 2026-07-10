import { calculateRisk } from "./risk.js";
import {
  defaultOnboardingAnswers,
  getPreferredFocusMinutes,
  normalizeOnboardingAnswers,
  prefersShortTasks,
} from "./onboarding.js";

// Planning helpers are plain JavaScript functions. Keeping them outside React
// makes them easier to test and easier to reuse in future features.

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const MINIMUM_FOCUS_CHUNK_MINUTES = 10;
const LONG_SESSION_MULTIPLIER = 1.5;

function getTodayStart() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function addDays(date, numberOfDays) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + numberOfDays);

  return nextDate;
}

function getDueDate(assignment, todayStart) {
  if (assignment.dueDate) {
    return new Date(`${assignment.dueDate}T00:00:00`);
  }

  return addDays(todayStart, assignment.dueInDays ?? 0);
}

function getDaysUntilDue(assignment, todayStart) {
  const dueDate = getDueDate(assignment, todayStart);
  const dayDifference = Math.ceil(
    (dueDate.getTime() - todayStart.getTime()) / millisecondsPerDay,
  );

  // The plan includes today, so an assignment due today still gets one day.
  return Math.max(1, dayDifference + 1);
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatDayLabel(index) {
  if (index === 0) {
    return "Today";
  }

  if (index === 1) {
    return "Tomorrow";
  }

  return `Day ${index + 1}`;
}

function formatDueLabel(daysUntilDue) {
  if (daysUntilDue === 1) {
    return "Due today";
  }

  if (daysUntilDue === 2) {
    return "Due tomorrow";
  }

  return `Due in ${daysUntilDue - 1} days`;
}

function splitTasksAcrossDays(tasks, numberOfDays) {
  return Array.from({ length: numberOfDays }, (_, dayIndex) =>
    tasks.filter((_, taskIndex) => taskIndex % numberOfDays === dayIndex),
  );
}

function getPlanningChunkMinutes(onboardingAnswers) {
  const preferredFocusMinutes = getPreferredFocusMinutes(onboardingAnswers);

  if (prefersShortTasks(onboardingAnswers)) {
    return preferredFocusMinutes;
  }

  return Math.round(preferredFocusMinutes * LONG_SESSION_MULTIPLIER);
}

function splitTaskForFocus(task, onboardingAnswers) {
  const maxChunkMinutes = Math.max(
    MINIMUM_FOCUS_CHUNK_MINUTES,
    getPlanningChunkMinutes(onboardingAnswers),
  );

  if (task.minutes <= maxChunkMinutes) {
    return [task];
  }

  const chunkCount = Math.ceil(task.minutes / maxChunkMinutes);
  const baseMinutesPerChunk = Math.floor(task.minutes / chunkCount);
  const extraMinutesToDistribute = task.minutes % chunkCount;

  return Array.from({ length: chunkCount }, (_, chunkIndex) => ({
    ...task,
    id: `${task.id}-focus-${chunkIndex + 1}`,
    label: `${task.label} (part ${chunkIndex + 1} of ${chunkCount})`,
    minutes:
      baseMinutesPerChunk + (chunkIndex < extraMinutesToDistribute ? 1 : 0),
  }));
}

function splitTasksForFocus(tasks, onboardingAnswers) {
  return tasks.flatMap((task) => splitTaskForFocus(task, onboardingAnswers));
}

// The daily plan chooses one manageable task from each assignment.
// This matches the StudySprout idea of answering "What should I work on today?"
export function buildTodayPlan(
  assignments,
  completedTaskIds,
  onboardingAnswers = defaultOnboardingAnswers,
) {
  const tasks = assignments.map((assignment) => {
    const nextTask =
      assignment.tasks.find((task) => !completedTaskIds.has(task.id)) ??
      assignment.tasks[assignment.tasks.length - 1];

    return {
      ...nextTask,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      course: assignment.course,
      risk: calculateRisk(assignment, { completedTaskIds, onboardingAnswers }),
    };
  });

  return sortTasksByRisk(tasks);
}

// Once today's tasks are chosen, this keeps the checklist stable while the user
// checks things off. Later, a "refresh plan" button could choose the next tasks.
export function buildPinnedTodayPlan(
  assignments,
  todayTaskIds,
  completedTaskIds = new Set(),
  onboardingAnswers = defaultOnboardingAnswers,
) {
  const taskDetailsById = new Map();

  assignments.forEach((assignment) => {
    assignment.tasks.forEach((task) => {
      taskDetailsById.set(task.id, {
        ...task,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        course: assignment.course,
        risk: calculateRisk(assignment, {
          completedTaskIds,
          onboardingAnswers,
          todayTaskIds,
        }),
      });
    });
  });

  return todayTaskIds
    .map((taskId) => taskDetailsById.get(taskId))
    .filter(Boolean);
}

// Sorting today tasks in a helper keeps new and sample assignments ordered the
// same way whenever the dashboard plan is rebuilt.
export function sortTasksByRisk(tasks) {
  return [...tasks].sort(
    (firstTask, secondTask) => secondTask.risk.score - firstTask.risk.score,
  );
}

// The weekly plan turns every assignment into a small schedule from today to
// its due date. Each assignment keeps its own Start Here step and daily minutes.
export function buildWeeklyPlan(
  assignments,
  onboardingAnswers = defaultOnboardingAnswers,
) {
  const todayStart = getTodayStart();
  const normalizedOnboarding = normalizeOnboardingAnswers(onboardingAnswers);

  return assignments.map((assignment) => {
    const daysUntilDue = getDaysUntilDue(assignment, todayStart);
    const focusSizedTasks = splitTasksForFocus(
      assignment.tasks,
      normalizedOnboarding,
    );
    const tasksByDay = splitTasksAcrossDays(focusSizedTasks, daysUntilDue);
    const totalMinutes = focusSizedTasks.reduce(
      (sum, task) => sum + task.minutes,
      0,
    );

    return {
      assignmentId: assignment.id,
      course: assignment.course,
      title: assignment.title,
      startHere: assignment.startHere,
      dueLabel: formatDueLabel(daysUntilDue),
      totalMinutes,
      days: tasksByDay.map((dayTasks, dayIndex) => {
        const date = addDays(todayStart, dayIndex);
        const steps =
          dayTasks.length > 0
            ? dayTasks
            : [
                {
                  id: `${assignment.id}-buffer-${dayIndex}`,
                  label: "Review progress and adjust tomorrow's tiny step",
                  minutes: 10,
                },
              ];

        return {
          dateKey: `${assignment.id}-${formatDateKey(date)}`,
          dayLabel: formatDayLabel(dayIndex),
          dateLabel: formatDateLabel(date),
          minutes: steps.reduce((sum, step) => sum + step.minutes, 0),
          steps,
        };
      }),
    };
  });
}
