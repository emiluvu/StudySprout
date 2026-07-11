import { Coins, Sprout } from "lucide-react";
import { getCurrentGardenStage } from "../../utils/rewards.js";

// GardenSnapshot is the dashboard preview of the new garden game system.
// It shows the current stage and coin progress, while upgrades happen in Garden.
export function GardenSnapshot({
  coins,
  completedCount,
  currentStage,
  nextStage,
  totalTaskCount,
}) {
  const safeCoins = Number.isFinite(coins) ? coins : 0;
  const safeCurrentStage = currentStage ?? getCurrentGardenStage();
  const coinsNeeded = nextStage
    ? Math.max(nextStage.upgradeCost - safeCoins, 0)
    : 0;
  const upgradeProgress = nextStage
    ? Math.min(Math.round((safeCoins / nextStage.upgradeCost) * 100), 100)
    : 100;
  const taskProgress =
    totalTaskCount === 0 ? 0 : Math.round((completedCount / totalTaskCount) * 100);

  return (
    <section className="card dashboard-card garden-snapshot-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="eyebrow">Garden</p>
          <h2>{safeCurrentStage.name}</h2>
        </div>
        <Sprout size={22} />
      </div>

      <div className="garden-level-card">
        <Coins size={30} />
        <div>
          <span>Garden coins</span>
          <strong>{safeCoins} coins</strong>
        </div>
      </div>

      <div className="garden-unlock-row">
        <span>Next upgrade</span>
        <strong>{nextStage ? nextStage.name : "Complete"}</strong>
      </div>

      <div className="progress-track garden-progress-track" aria-hidden="true">
        <span style={{ width: `${upgradeProgress}%` }} />
      </div>

      <p className="garden-progress-note">
        {nextStage
          ? coinsNeeded === 0
            ? `Ready to upgrade · ${taskProgress}% of visible tasks done`
            : `${coinsNeeded} more coin${
                coinsNeeded === 1 ? "" : "s"
              } needed · ${taskProgress}% of visible tasks done`
          : `Full sanctuary complete · ${taskProgress}% of visible tasks done`}
      </p>
    </section>
  );
}
