import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Lightbulb,
  NotebookPen,
} from "lucide-react";
import {
  getAssignmentProgress,
  getDueDateLabel,
  getDueStatusLabel,
} from "../utils/dashboard.js";
import {
  loadAssignmentNote,
  saveAssignmentNote,
} from "../utils/storage.js";

// AssignmentDetails is a state-driven detail view. App chooses the assignment,
// then this component shows all of its tasks, risk, plan, and saved notes.
export function AssignmentDetails({
  assignment,
  completedTaskIds,
  onBack,
  onStartFocus,
  onToggleTask,
  plan,
}) {
  const progress = getAssignmentProgress(assignment, completedTaskIds);
  const [notesDraft, setNotesDraft] = useState(() => ({
    assignmentId: assignment.id,
    text: loadAssignmentNote(assignment.id),
  }));
  const riskSuggestion = getRiskSuggestion(assignment, completedTaskIds);

  // When the selected assignment changes, load that assignment's saved note.
  useEffect(() => {
    setNotesDraft({
      assignmentId: assignment.id,
      text: loadAssignmentNote(assignment.id),
    });
  }, [assignment.id]);

  // localStorage saves strings in the browser. This keeps the latest notes after
  // refresh without needing a database yet.
  useEffect(() => {
    if (notesDraft.assignmentId === assignment.id) {
      saveAssignmentNote(assignment.id, notesDraft.text);
    }
  }, [assignment.id, notesDraft]);

  return (
    <section className="assignment-detail-view" aria-labelledby="assignment-detail-heading">
      <button className="secondary-button detail-back-button" onClick={onBack} type="button">
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <section className="assignment-detail-hero">
        <div>
          <p className="eyebrow">{assignment.course}</p>
          <h1 id="assignment-detail-heading">{assignment.title}</h1>
          <p className="dashboard-subtitle">
            {getDueDateLabel(assignment)} · {getDueStatusLabel(assignment)}
          </p>
        </div>

        <div className="assignment-detail-stats" aria-label="Assignment status">
          <span className={`risk-badge ${assignment.risk.tone}`}>
            {assignment.risk.label}
          </span>
          <div className="detail-progress-number">
            <span>Progress</span>
            <strong>{progress.percent}%</strong>
          </div>
        </div>
      </section>

      <div className="assignment-detail-grid">
        <section className="card detail-card detail-task-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="eyebrow">Checklist</p>
              <h2>Assignment steps</h2>
            </div>
            <span className="time-pill">
              {progress.completedTasks}/{progress.totalTasks} done
            </span>
          </div>

          <div className="progress-track detail-progress-track" aria-hidden="true">
            <span style={{ width: `${progress.percent}%` }} />
          </div>

          <div className="detail-task-list">
            {assignment.tasks.map((task) => {
              const isComplete = completedTaskIds.has(task.id);

              return (
                <div
                  className={`dashboard-task-row ${isComplete ? "is-complete" : ""}`}
                  key={task.id}
                >
                  <label className="task-check-label">
                    <input
                      checked={isComplete}
                      onChange={() => onToggleTask(task.id)}
                      type="checkbox"
                    />
                    <span className="custom-check" aria-hidden="true">
                      <CheckCircle2 size={20} />
                    </span>
                    <span className="dashboard-task-main">
                      <span className="task-title">{task.label}</span>
                      <span className="task-meta">Task step</span>
                    </span>
                  </label>
                  <span className="task-minute-pill">{task.minutes ?? 10} min</span>
                  <button
                    className="task-focus-button"
                    onClick={() => onStartFocus(assignment.id, task.id)}
                    type="button"
                  >
                    Focus
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card detail-card risk-explanation-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="eyebrow">Risk</p>
              <h2>Deadline forecast</h2>
            </div>
            <Lightbulb size={22} />
          </div>

          <span className={`risk-badge ${assignment.risk.tone}`}>
            {assignment.risk.label}
          </span>
          <p className="risk-detail-message">{assignment.risk.message}</p>

          <div className="risk-suggestion">
            <span>Try this next</span>
            <strong>{riskSuggestion}</strong>
          </div>
        </section>

        <section className="card detail-card detail-plan-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="eyebrow">Plan</p>
              <h2>Day-by-day steps</h2>
            </div>
            <div className="time-pill">
              <Clock3 size={18} />
              <span>{plan?.totalMinutes ?? 0} min</span>
            </div>
          </div>

          <p className="focus-start-step">Start here: {assignment.startHere}</p>

          <div className="daily-plan-list detail-daily-list">
            {plan?.days.map((day) => (
              <div className="daily-plan-row" key={day.dateKey}>
                <div className="daily-plan-date">
                  <span>{day.dayLabel}</span>
                  <strong>{day.dateLabel}</strong>
                </div>

                <div className="daily-plan-steps">
                  {day.steps.map((step) => (
                    <span className="daily-step" key={step.id}>
                      {step.label}
                    </span>
                  ))}
                </div>

                <div className="daily-minutes">{day.minutes} min</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card detail-card assignment-notes-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="eyebrow">Notes</p>
              <h2>Assignment notes</h2>
            </div>
            <NotebookPen size={22} />
          </div>

          <label className="form-field">
            <span>Private notes for this assignment</span>
            <textarea
              onChange={(event) =>
                setNotesDraft({
                  assignmentId: assignment.id,
                  text: event.target.value,
                })
              }
              placeholder="Add reminders, teacher feedback, links, or what to ask for help with..."
              rows="7"
              value={
                notesDraft.assignmentId === assignment.id ? notesDraft.text : ""
              }
            />
          </label>
        </section>
      </div>
    </section>
  );
}

function getRiskSuggestion(assignment, completedTaskIds) {
  const firstUnfinishedTask = assignment.tasks.find(
    (task) => !completedTaskIds.has(task.id),
  );

  if (!firstUnfinishedTask) {
    return "Everything is complete. Review lightly before the due date.";
  }

  if (assignment.risk.tone === "high") {
    return `Finish "${firstUnfinishedTask.label}" today to lower deadline pressure.`;
  }

  if (assignment.risk.tone === "medium") {
    return `Spend ${firstUnfinishedTask.minutes ?? 10} minutes on "${firstUnfinishedTask.label}".`;
  }

  return `Keep momentum with "${firstUnfinishedTask.label}" when you have a calm study window.`;
}
