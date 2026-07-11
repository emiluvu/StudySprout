import { CalendarCheck2, Clock3, Sprout } from "lucide-react";

// WeeklyPlan receives already-generated planning data from App.
// This keeps the component focused on display instead of date math.
export function WeeklyPlan({ onSelectAssignment, plan }) {
  const totalMinutes = plan.reduce(
    (sum, assignmentPlan) => sum + assignmentPlan.totalMinutes,
    0,
  );
  const hasAssignments = plan.length > 0;

  return (
    <section className="card weekly-card" aria-labelledby="weekly-plan-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Weekly plan</p>
          <h2 id="weekly-plan-heading">Day-by-day sprouts</h2>
        </div>
        <div className="time-pill" aria-label={`${totalMinutes} minutes planned`}>
          <Clock3 size={18} />
          <span>{totalMinutes} min</span>
        </div>
      </div>

      <div className="weekly-list">
        {!hasAssignments ? (
          <div className="friendly-empty-state">
            <strong>No assignments to plan yet.</strong>
            <p>
              Add your first assignment and StudySprout will split it into
              day-by-day study steps.
            </p>
          </div>
        ) : null}

        {plan.map((assignmentPlan) => (
          <article className="weekly-assignment" key={assignmentPlan.assignmentId}>
            <div className="weekly-assignment-heading">
              <div>
                <p className="assignment-course">{assignmentPlan.course}</p>
                <h3>
                  <button
                    className="assignment-title-button"
                    onClick={() => onSelectAssignment?.(assignmentPlan.assignmentId)}
                    type="button"
                  >
                    {assignmentPlan.title}
                  </button>
                </h3>
              </div>
              <span className="due-pill">
                <CalendarCheck2 size={16} />
                {assignmentPlan.dueLabel}
              </span>
            </div>

            <p className="start-step weekly-start">
              <Sprout size={16} />
              <span>Start here: {assignmentPlan.startHere}</span>
            </p>

            <div className="daily-plan-list">
              {assignmentPlan.days.map((day) => (
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
          </article>
        ))}
      </div>
    </section>
  );
}
