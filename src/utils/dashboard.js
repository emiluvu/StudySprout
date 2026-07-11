// Dashboard helpers keep small calculations out of the React components.
// That makes each dashboard card easier to read while you are learning React.

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getTodayStart() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function addDays(date, numberOfDays) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + numberOfDays);

  return nextDate;
}

export function getGreetingText(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function getDashboardDateLabel(date = new Date()) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function getMossySubtitle({
  highestRiskAssignment,
  todayCompletedCount,
  todayTaskCount,
}) {
  if (todayTaskCount > 0 && todayCompletedCount === todayTaskCount) {
    return "Mossy says the garden already felt your steady care today.";
  }

  if (highestRiskAssignment?.risk.tone === "high") {
    return `Mossy recommends one tiny step for ${highestRiskAssignment.title}.`;
  }

  if (todayCompletedCount > 0) {
    return "Mossy noticed your progress. Keep the next step small and kind.";
  }

  return "Mossy saved a gentle plan so you do not have to start from scratch.";
}

export function getAssignmentDueDate(assignment) {
  if (assignment.dueDate) {
    return new Date(`${assignment.dueDate}T00:00:00`);
  }

  return addDays(getTodayStart(), assignment.dueInDays ?? 0);
}

export function getDueDateLabel(assignment) {
  return getAssignmentDueDate(assignment).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function getDueStatusLabel(assignment) {
  const daysUntilDue = Math.ceil(
    (getAssignmentDueDate(assignment).getTime() - getTodayStart().getTime()) /
      MILLISECONDS_PER_DAY,
  );

  if (daysUntilDue < 0) {
    return "Overdue";
  }

  if (daysUntilDue === 0) {
    return "Due today";
  }

  if (daysUntilDue === 1) {
    return "Due tomorrow";
  }

  return `Due in ${daysUntilDue} days`;
}

export function getAssignmentProgress(assignment, completedTaskIds) {
  const totalTasks = assignment.tasks.length;
  const completedTasks = assignment.tasks.filter((task) =>
    completedTaskIds.has(task.id),
  ).length;
  const percent =
    totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);

  return {
    completedTasks,
    percent,
    totalTasks,
  };
}

export function getUpcomingAssignments(assignments) {
  return [...assignments]
    .sort(
      (firstAssignment, secondAssignment) =>
        getAssignmentDueDate(firstAssignment).getTime() -
        getAssignmentDueDate(secondAssignment).getTime(),
    )
    .slice(0, 3);
}

export function getTodayMinutesForAssignment(todayPlan, assignmentId) {
  return todayPlan
    .filter((task) => task.assignmentId === assignmentId)
    .reduce((sum, task) => sum + task.minutes, 0);
}

export function getMossyDashboardCoach({
  completedCount,
  completedTaskIds,
  focusAssignment,
  gardenCoins = 0,
  nextGardenStage,
  todayCompletedCount,
  todayPlan,
  todayTaskCount,
}) {
  const firstUnfinishedTask = todayPlan.find(
    (task) => !completedTaskIds.has(task.id),
  );

  if (todayTaskCount > 0 && todayCompletedCount === todayTaskCount) {
    return {
      mood: "Proud",
      message: "Today's plan is complete. That is a beautifully calm finish.",
      recommendation: "Check the Planner when you are ready to preview tomorrow.",
    };
  }

  if (focusAssignment?.risk.tone === "high") {
    return {
      mood: "Concerned",
      message:
        "A deadline needs attention, but one focused step can lower the pressure.",
      recommendation: `Start with ${focusAssignment.startHere}`,
    };
  }

  if (firstUnfinishedTask) {
    return {
      mood: todayCompletedCount > 0 ? "Proud" : "Encouraging",
      message:
        todayCompletedCount > 0
          ? "You already started. The next step can stay small."
          : "No need to do everything at once. Begin with the gentlest task.",
      recommendation: `Try ${firstUnfinishedTask.label}`,
    };
  }

  if (nextGardenStage) {
    const remainingCoins = Math.max(nextGardenStage.upgradeCost - gardenCoins, 0);

    return {
      mood: "Excited",
      message: "Your garden is growing through coins now. Tiny tasks still count.",
      recommendation:
        remainingCoins === 0
          ? `You can upgrade to ${nextGardenStage.name}.`
          : `Earn ${remainingCoins} more coin${
              remainingCoins === 1 ? "" : "s"
            } to upgrade to ${nextGardenStage.name}.`,
    };
  }

  return {
    mood: "Calm",
    message: "Everything looks steady right now.",
    recommendation: "Use the Study Guide tab if you want to review notes.",
  };
}
