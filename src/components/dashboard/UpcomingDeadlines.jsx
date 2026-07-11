import { CalendarClock } from "lucide-react";
import {
  getAssignmentProgress,
  getDueDateLabel,
  getDueStatusLabel,
  getUpcomingAssignments,
} from "../../utils/dashboard.js";

// UpcomingDeadlines shows the next three assignments by due date. Progress is
// calculated from completed task ids, the same source used by the checklist.
export function UpcomingDeadlines({
  assignments,
  completedTaskIds,
  onSelectAssignment,
}) {
  const upcomingAssignments = getUpcomingAssignments(assignments);
  const hasAssignments = upcomingAssignments.length > 0;

  return (
    <section className="card dashboard-card upcoming-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="eyebrow">Upcoming</p>
          <h2>Next deadlines</h2>
        </div>
        <CalendarClock size={22} />
      </div>

      <div className="deadline-list">
        {!hasAssignments ? (
          <div className="friendly-empty-state">
            <strong>No deadlines yet.</strong>
            <p>Add an assignment to see your next three due dates here.</p>
          </div>
        ) : null}

        {upcomingAssignments.map((assignment) => {
          const progress = getAssignmentProgress(assignment, completedTaskIds);

          return (
            <article className="deadline-card" key={assignment.id}>
              <div>
                <p className="assignment-course">{assignment.course}</p>
                <h3>
                  <button
                    className="assignment-title-button"
                    onClick={() => onSelectAssignment(assignment.id)}
                    type="button"
                  >
                    {assignment.title}
                  </button>
                </h3>
                <p className="dashboard-muted">
                  {getDueDateLabel(assignment)} · {getDueStatusLabel(assignment)}
                </p>
              </div>

              <div className="deadline-card-footer">
                <span className={`mini-risk ${assignment.risk.tone}`}>
                  {assignment.risk.label}
                </span>
                <span>{progress.percent}%</span>
              </div>

              <div className="mini-progress-track" aria-hidden="true">
                <span style={{ width: `${progress.percent}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
