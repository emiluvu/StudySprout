import windChime from "../../assets/illustrations/wind-chime.webp";
import {
  getDashboardDateLabel,
  getGreetingText,
  getMossySubtitle,
} from "../../utils/dashboard.js";

// GreetingHeader answers "where am I today?" before showing detailed cards.
// It uses the current browser time for the greeting and date.
export function GreetingHeader({
  highestRiskAssignment,
  todayCompletedCount,
  todayTaskCount,
}) {
  const now = new Date();

  return (
    <section className="dashboard-greeting" aria-labelledby="dashboard-heading">
      <div className="dashboard-greeting-copy">
        <p className="eyebrow">{getDashboardDateLabel(now)}</p>
        <h1 id="dashboard-heading">{getGreetingText(now)}, sprout.</h1>
        <p className="dashboard-subtitle">
          {getMossySubtitle({
            highestRiskAssignment,
            todayCompletedCount,
            todayTaskCount,
          })}
        </p>
      </div>

      {/* This decorative image gives the welcome card the peaceful wind-chime
          feeling from the inspiration without changing any app behavior. */}
      <div className="dashboard-greeting-art" aria-hidden="true">
        <img src={windChime} alt="" />
      </div>
    </section>
  );
}
