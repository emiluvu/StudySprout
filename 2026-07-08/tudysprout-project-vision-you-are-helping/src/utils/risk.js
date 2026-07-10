// Risk helpers are kept separate from components so the prediction logic can
// grow over time without making the UI files harder to read.
import {
  defaultOnboardingAnswers,
  isDifficultSubject,
  normalizeOnboardingAnswers,
} from "./onboarding.js";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const RISK_SCORE_LIMITS = {
  low: 0,
  medium: 40,
  high: 70,
  max: 100,
};

const DEADLINE_PRESSURE = {
  dueToday: 32,
  dueTomorrow: 26,
  dueInThreeDays: 20,
  dueThisWeek: 12,
  dueLater: 6,
};

const ESTIMATED_HOURS_PRESSURE = {
  pointsPerHour: 2,
  max: 18,
  largeAssignmentHours: 4,
};

const TASK_PROGRESS_PRESSURE = {
  maxRemainingStepsPressure: 28,
  maxCompletedStepsRelief: 18,
  severalStepsThreshold: 3,
};

const TODAY_PLAN_PRESSURE = {
  unfinishedPlannedWork: 14,
};

const ONBOARDING_RISK_PRESSURE = {
  difficultSubject: 10,
  lastMinuteEarlyWarning: 8,
  lastMinuteWarningWindowDays: 5,
  underestimatesOften: 7,
  underestimatesSometimes: 3,
};

const DIFFICULTY_PRESSURE = {
  easy: 0,
  medium: 5,
  hard: 10,
};

// This small helper keeps numbers in a safe range for progress and risk scores.
function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function getTodayStart() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function getDaysUntilDue(assignment) {
  if (assignment.dueDate) {
    const todayStart = getTodayStart();
    const dueDate = new Date(`${assignment.dueDate}T00:00:00`);
    const dayDifference = Math.ceil(
      (dueDate.getTime() - todayStart.getTime()) / MILLISECONDS_PER_DAY,
    );

    return Math.max(0, dayDifference);
  }

  return Math.max(0, assignment.dueInDays ?? 0);
}

function getDeadlinePressure(daysUntilDue) {
  if (daysUntilDue === 0) {
    return DEADLINE_PRESSURE.dueToday;
  }

  if (daysUntilDue === 1) {
    return DEADLINE_PRESSURE.dueTomorrow;
  }

  if (daysUntilDue <= 3) {
    return DEADLINE_PRESSURE.dueInThreeDays;
  }

  if (daysUntilDue <= 7) {
    return DEADLINE_PRESSURE.dueThisWeek;
  }

  return DEADLINE_PRESSURE.dueLater;
}

function getRiskLabel(score) {
  if (score >= RISK_SCORE_LIMITS.high) {
    return {
      label: "High Risk",
      tone: "high",
    };
  }

  if (score >= RISK_SCORE_LIMITS.medium) {
    return {
      label: "Medium Risk",
      tone: "medium",
    };
  }

  return {
    label: "Low Risk",
    tone: "low",
  };
}

function buildRiskReasons({
  completedTaskCount,
  daysUntilDue,
  estimatedHours,
  isHardSubject,
  isLastMinuteWarning,
  remainingTaskCount,
  todayPlannedWorkUnfinished,
  underestimatesTime,
}) {
  const reasons = [];

  if (daysUntilDue <= 1) {
    reasons.push("this is due soon");
  } else if (daysUntilDue <= 3) {
    reasons.push("the due date is close");
  }

  if (remainingTaskCount >= TASK_PROGRESS_PRESSURE.severalStepsThreshold) {
    reasons.push("several steps are unfinished");
  } else if (remainingTaskCount > 0) {
    reasons.push("there are still steps to finish");
  }

  if (todayPlannedWorkUnfinished) {
    reasons.push("today's planned work is still unfinished");
  }

  if (isLastMinuteWarning) {
    reasons.push("you usually start closer to deadlines");
  }

  if (isHardSubject) {
    reasons.push("this subject tends to feel harder");
  }

  if (estimatedHours >= ESTIMATED_HOURS_PRESSURE.largeAssignmentHours) {
    reasons.push("it needs a larger time block");
  }

  if (underestimatesTime === "often") {
    reasons.push("assignment time is often underestimated");
  }

  if (reasons.length === 0 && completedTaskCount > 0) {
    reasons.push("progress has already started");
  }

  return reasons;
}

function buildRiskMessage(label, reasons) {
  const [riskLevel] = label.split(" ");
  const sentenceLabel = `${riskLevel} risk`;

  if (label === "Low Risk") {
    return reasons.length > 0
      ? `${sentenceLabel} because ${reasons[0]} and the remaining work looks manageable.`
      : "Low risk because there is still time to work steadily.";
  }

  const explanation = reasons.slice(0, 2).join(" and ");

  return `${sentenceLabel} because ${explanation}.`;
}

// This risk predictor uses plain numbers so it is easy to learn from.
// It looks at timing, assignment size, task progress, and today's unfinished plan.
export function calculateRisk(
  assignment,
  {
    completedTaskIds = new Set(),
    onboardingAnswers = defaultOnboardingAnswers,
    todayTaskIds = [],
  } = {},
) {
  const normalizedOnboarding = normalizeOnboardingAnswers(onboardingAnswers);
  const assignmentTaskIds = assignment.tasks.map((task) => task.id);
  const totalTaskCount = assignmentTaskIds.length;
  const completedTaskCount = assignmentTaskIds.filter((taskId) =>
    completedTaskIds.has(taskId),
  ).length;
  const remainingTaskCount = Math.max(totalTaskCount - completedTaskCount, 0);
  const completionRatio =
    totalTaskCount === 0 ? 1 : completedTaskCount / totalTaskCount;
  const remainingTaskRatio =
    totalTaskCount === 0 ? 0 : remainingTaskCount / totalTaskCount;
  const daysUntilDue = getDaysUntilDue(assignment);
  const estimatedHours = Number(assignment.estimatedHours) || 0;
  const todayPlannedWorkUnfinished = todayTaskIds.some(
    (taskId) =>
      assignmentTaskIds.includes(taskId) && !completedTaskIds.has(taskId),
  );
  const isHardSubject = isDifficultSubject(
    assignment.course,
    normalizedOnboarding,
  );
  const isLastMinuteWarning =
    normalizedOnboarding.startStyle === "last-minute" &&
    daysUntilDue <= ONBOARDING_RISK_PRESSURE.lastMinuteWarningWindowDays;
  const underestimatesPressure =
    normalizedOnboarding.underestimatesTime === "often"
      ? ONBOARDING_RISK_PRESSURE.underestimatesOften
      : normalizedOnboarding.underestimatesTime === "sometimes"
        ? ONBOARDING_RISK_PRESSURE.underestimatesSometimes
        : RISK_SCORE_LIMITS.low;

  if (remainingTaskCount === 0) {
    return {
      score: RISK_SCORE_LIMITS.low,
      label: "Low Risk",
      tone: "low",
      message: "Low risk because every task step is complete.",
    };
  }

  const deadlinePressure = getDeadlinePressure(daysUntilDue);
  const estimatedHoursPressure = clamp(
    estimatedHours * ESTIMATED_HOURS_PRESSURE.pointsPerHour,
    RISK_SCORE_LIMITS.low,
    ESTIMATED_HOURS_PRESSURE.max,
  );
  const remainingStepsPressure =
    remainingTaskRatio * TASK_PROGRESS_PRESSURE.maxRemainingStepsPressure;
  const completedStepsRelief =
    completionRatio * TASK_PROGRESS_PRESSURE.maxCompletedStepsRelief;
  const todayUnfinishedPressure = todayPlannedWorkUnfinished
    ? TODAY_PLAN_PRESSURE.unfinishedPlannedWork
    : RISK_SCORE_LIMITS.low;
  const lastMinutePressure = isLastMinuteWarning
    ? ONBOARDING_RISK_PRESSURE.lastMinuteEarlyWarning
    : RISK_SCORE_LIMITS.low;
  const hardSubjectPressure = isHardSubject
    ? ONBOARDING_RISK_PRESSURE.difficultSubject
    : RISK_SCORE_LIMITS.low;
  const assignmentDifficultyPressure =
    DIFFICULTY_PRESSURE[assignment.difficulty] ?? DIFFICULTY_PRESSURE.easy;
  const score = clamp(
    Math.round(
      deadlinePressure +
        estimatedHoursPressure +
        remainingStepsPressure +
        todayUnfinishedPressure +
        lastMinutePressure +
        hardSubjectPressure +
        underestimatesPressure +
        assignmentDifficultyPressure -
        completedStepsRelief,
    ),
    RISK_SCORE_LIMITS.low,
    RISK_SCORE_LIMITS.max,
  );
  const { label, tone } = getRiskLabel(score);
  const reasons = buildRiskReasons({
    completedTaskCount,
    daysUntilDue,
    estimatedHours,
    isHardSubject,
    isLastMinuteWarning,
    remainingTaskCount,
    todayPlannedWorkUnfinished,
    underestimatesTime: normalizedOnboarding.underestimatesTime,
  });

  return {
    score,
    label,
    tone,
    message: buildRiskMessage(label, reasons),
  };
}

// Sorting by risk in one helper keeps the dashboard and future views consistent.
export function sortAssignmentsByRisk(assignments) {
  return [...assignments].sort(
    (firstAssignment, secondAssignment) =>
      secondAssignment.risk.score - firstAssignment.risk.score,
  );
}
