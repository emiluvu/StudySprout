import { CircleAlert } from "lucide-react";

// RiskPanel displays assignments that already have risk data attached.
// App prepares the data, and this component focuses only on showing it.
export function RiskPanel({ assignments, highestRisk }) {
  return (
    <section className="card risk-card" aria-labelledby="risk-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Risk check</p>
          <h2 id="risk-heading">Falling-behind forecast</h2>
        </div>
        <div className={`risk-badge ${highestRisk?.tone ?? "low"}`}>
          <CircleAlert size={18} />
          <span>{highestRisk?.label ?? "Low Risk"}</span>
        </div>
      </div>

      <div className="risk-list">
        {assignments.map((assignment) => (
          <article className="assignment-row" key={assignment.id}>
            <div>
              <p className="assignment-course">{assignment.course}</p>
              <h3>{assignment.title}</h3>
              <p className="start-step">Start here: {assignment.startHere}</p>
              <p className="risk-reason">{assignment.risk.message}</p>
            </div>

            <div className="assignment-stats" aria-label={`${assignment.risk.score}% risk`}>
              <span className={`risk-dot ${assignment.risk.tone}`} />
              <span>{assignment.risk.score}%</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
