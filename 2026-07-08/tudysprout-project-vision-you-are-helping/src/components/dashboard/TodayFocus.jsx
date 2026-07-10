import { PlayCircle } from "lucide-react";
import {
  getDueStatusLabel,
  getTodayMinutesForAssignment,
} from "../../utils/dashboard.js";

// TodayFocus highlights the assignment StudySprout thinks matters most.
// Right now, "most important" means the assignment with the highest risk score.
export function TodayFocus({
  assignment,
  completedTaskIds,
  onSelectAssignment,
  onStartFocus,
  todayPlan,
}) {
  if (!assignment) {
    return (
      <section className="card dashboard-card today-focus-card">
        <p className="eyebrow">Today's focus</p>
        <h2>No assignments yet</h2>
        <p className="dashboard-muted">Add an assignment to grow your first plan.</p>
      </section>
    );
  }

  const todayMinutes = getTodayMinutesForAssignment(todayPlan, assignment.id);
  const remainingTaskCount = assignment.tasks.filter(
    (task) => !completedTaskIds.has(task.id),
  ).length;
  const focusTask =
    todayPlan.find(
      (task) =>
        task.assignmentId === assignment.id && !completedTaskIds.has(task.id),
    ) ??
    assignment.tasks.find((task) => !completedTaskIds.has(task.id)) ??
    assignment.tasks[0];

  return (
    <section className="card dashboard-card today-focus-card">
      <div className="today-focus-content">
        <div>
          <p className="eyebrow">Today's focus</p>
          <h2>{assignment.title}</h2>
          <p className="dashboard-muted">
            {assignment.course} · {getDueStatusLabel(assignment)}
          </p>
        </div>

        <span className={`risk-badge ${assignment.risk.tone}`}>
          {assignment.risk.label}
        </span>
      </div>

      <div className="focus-detail-grid">
        <FocusDetail label="Study today" value={`${todayMinutes || 10} min`} />
        <FocusDetail label="Steps left" value={remainingTaskCount} />
      </div>

      <p className="focus-start-step">Start here: {assignment.startHere}</p>

      <div className="focus-actions">
        <button
          className="focus-start-button"
          onClick={() => onStartFocus(assignment.id, focusTask.id)}
          type="button"
        >
          <PlayCircle size={18} />
          <span>Start Studying</span>
        </button>
        <button
          className="secondary-button"
          onClick={() => onSelectAssignment(assignment.id)}
          type="button"
        >
          View details
        </button>
      </div>
    </section>
  );
}

function FocusDetail({ label, value }) {
  return (
    <div className="focus-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
