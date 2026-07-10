import { Heart } from "lucide-react";
import { MossyAvatar } from "../MossyAvatar.jsx";
import { getMossyDashboardCoach } from "../../utils/dashboard.js";

// MossyCard is the dashboard coach card. It combines progress, risk, and garden
// data to choose one supportive message plus one practical recommendation.
export function MossyCard({
  completedCount,
  completedTaskIds,
  focusAssignment,
  gardenCoins,
  nextGardenStage,
  todayCompletedCount,
  todayPlan,
  todayTaskCount,
}) {
  const coach = getMossyDashboardCoach({
    completedCount,
    completedTaskIds,
    focusAssignment,
    gardenCoins,
    nextGardenStage,
    todayCompletedCount,
    todayPlan,
    todayTaskCount,
  });

  return (
    <aside className="card dashboard-card mossy-dashboard-card" aria-label="Mossy">
      <div className="mossy-card-top">
        <MossyAvatar size="small" />

        <div>
          <p className="companion-name">
            <Heart size={16} />
            <span>Mossy</span>
          </p>
          <span className={`companion-status ${coach.mood.toLowerCase()}`}>
            {coach.mood}
          </span>
        </div>
      </div>

      <p className="mossy-dashboard-message">{coach.message}</p>

      <div className="mossy-recommendation">
        <span>Recommendation</span>
        <strong>{coach.recommendation}</strong>
      </div>
    </aside>
  );
}
