import { CheckCircle2, Clock3 } from "lucide-react";

// TodayPlan is the main checklist card. It receives tasks and completion state
// from App, then calls onToggleTask when a student checks something off.
export function TodayPlan({ tasks, completedTaskIds, onToggleTask, totalMinutes }) {
  const hasTasks = tasks.length > 0;

  return (
    <section className="card today-card" aria-labelledby="plan-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Today</p>
          <h2 id="plan-heading">Your next study steps</h2>
        </div>
        <div className="time-pill" aria-label={`${totalMinutes} minutes planned`}>
          <Clock3 size={18} />
          <span>{totalMinutes} min</span>
        </div>
      </div>

      <div className="task-list">
        {!hasTasks ? (
          <div className="friendly-empty-state">
            <strong>No study steps yet.</strong>
            <p>Add an assignment and StudySprout will suggest where to begin.</p>
          </div>
        ) : null}

        {tasks.map((task) => {
          const isComplete = completedTaskIds.has(task.id);

          return (
            <label
              className={`task-row ${isComplete ? "is-complete" : ""}`}
              key={task.id}
            >
              <input
                checked={isComplete}
                onChange={() => onToggleTask(task.id)}
                type="checkbox"
              />
              <span className="custom-check" aria-hidden="true">
                <CheckCircle2 size={20} />
              </span>
              <span className="task-copy">
                <span className="task-title">{task.label}</span>
                <span className="task-meta">
                  {task.course} · {task.assignmentTitle} · {task.minutes} min
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
