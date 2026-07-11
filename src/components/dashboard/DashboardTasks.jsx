import { CheckCircle2, Clock3 } from "lucide-react";

// DashboardTasks is the improved today checklist. It still uses the same
// completedTaskIds state from App, so checking a task updates the whole app.
export function DashboardTasks({
  completedTaskIds,
  onStartFocus,
  onToggleTask,
  tasks,
  todayCompletedCount,
  totalMinutes,
}) {
  const taskCount = tasks.length;
  const progressPercent =
    taskCount === 0 ? 0 : Math.round((todayCompletedCount / taskCount) * 100);
  const hasTasks = taskCount > 0;

  return (
    <section className="card dashboard-card dashboard-tasks-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="eyebrow">Today's tasks</p>
          <h2 id="dashboard-tasks-heading">Small steps checklist</h2>
        </div>
        <div className="time-pill" aria-label={`${totalMinutes} minutes planned`}>
          <Clock3 size={18} />
          <span>{totalMinutes} min</span>
        </div>
      </div>

      <div className="task-progress-summary">
        <span>
          {todayCompletedCount} of {taskCount} complete
        </span>
        <strong>{progressPercent}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="dashboard-task-list">
        {!hasTasks ? (
          <div className="friendly-empty-state">
            <strong>No tasks planned for today.</strong>
            <p>
              Add an assignment in Planner and StudySprout will plant the first
              tiny step here.
            </p>
          </div>
        ) : null}

        {tasks.map((task) => {
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
                  <span className="task-meta">
                    {task.course} · {task.assignmentTitle}
                  </span>
                </span>
              </label>
              <span className="task-minute-pill">{task.minutes} min</span>
              <button
                className="task-focus-button"
                onClick={() => onStartFocus(task.assignmentId, task.id)}
                type="button"
              >
                Focus
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
