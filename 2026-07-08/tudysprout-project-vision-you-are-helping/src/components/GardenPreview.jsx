import { CheckSquare, Coins, Sparkles, Sprout } from "lucide-react";
import wateringCan from "../assets/illustrations/watering-can.webp";

// GardenPreview is the full Garden tab. It now works like a simple game:
// complete study tasks -> earn coins -> spend coins to upgrade one default garden.
export function GardenPreview({
  coins,
  currentStage,
  nextStage,
  onUpgradeGarden,
}) {
  const isMaxStage = !nextStage;
  const canAffordUpgrade = nextStage ? coins >= nextStage.upgradeCost : false;
  const coinsNeeded = nextStage
    ? Math.max(nextStage.upgradeCost - coins, 0)
    : 0;

  // The button is disabled when there is no next stage or when the student has
  // not earned enough coins yet. This keeps upgrade rules predictable.
  const isUpgradeDisabled = isMaxStage || !canAffordUpgrade;

  return (
    <section className="garden-game-page" aria-labelledby="garden-heading">
      <header className="garden-game-header">
        <div>
          <h1 id="garden-heading">My Garden</h1>
          <p className="garden-game-tagline">Focus, grow, bloom.</p>
          <p className="garden-game-copy">
            Complete tasks to earn coins and upgrade your garden.
          </p>
        </div>

        <div className="garden-coin-wallet" aria-label={`${coins} garden coins`}>
          <span className="garden-coin-icon" aria-hidden="true">
            <Coins size={32} />
          </span>
          <div>
            <strong>{coins}</strong>
            <span>My Coins</span>
          </div>
        </div>
      </header>

      <div className="garden-game-grid">
        <article className="garden-current-card">
          <span className="garden-current-label">Current Garden</span>

          {/* The image comes from the current stage data, so each upgrade
              automatically swaps to the next watercolor garden asset. */}
          <div className="garden-current-image-frame">
            <img src={currentStage.imageSrc} alt={`${currentStage.name} garden stage`} />
          </div>

          <div className="garden-current-details">
            <span className="garden-stage-pill">{currentStage.stageLabel}</span>
            <h2>{currentStage.name}</h2>
            <p>{currentStage.description}</p>
          </div>
        </article>

        <aside className="garden-next-card" aria-label="Next garden upgrade">
          <h2>Next Upgrade</h2>

          <div className="garden-next-preview">
            {nextStage ? (
              <>
                <img
                  src={nextStage.imageSrc}
                  alt={`${nextStage.name} preview`}
                />
                <div>
                  <span>{nextStage.stageLabel}</span>
                  <h3>{nextStage.name}</h3>
                  <p>{nextStage.description}</p>
                </div>
                <footer>
                  <span>Cost</span>
                  <strong>
                    <Coins size={20} />
                    {nextStage.upgradeCost}
                  </strong>
                </footer>
              </>
            ) : (
              <div className="garden-complete-message">
                <Sparkles size={32} />
                <h3>Study Sanctuary Complete</h3>
                <p>Your garden has reached its final peaceful stage.</p>
              </div>
            )}
          </div>

          <div className="garden-upgrade-divider" aria-hidden="true">
            <span>
              <Sprout size={22} />
            </span>
          </div>

          <button
            className="upgrade-garden-button"
            disabled={isUpgradeDisabled}
            onClick={onUpgradeGarden}
            type="button"
          >
            <Sprout size={24} />
            <span>{isMaxStage ? "Garden Fully Upgraded" : "Upgrade Garden"}</span>
          </button>

          <p className="garden-next-note">
            {isMaxStage
              ? "Your garden is fully grown. Keep studying to keep it glowing."
              : canAffordUpgrade
                ? "You have enough coins. Ready to grow?"
                : `Keep going. You need ${coinsNeeded} more coin${
                    coinsNeeded === 1 ? "" : "s"
                  }.`}
          </p>
        </aside>
      </div>

      <section className="garden-help-strip" aria-label="How garden upgrades work">
        <GardenTip
          icon={<Coins size={34} />}
          title="How to Earn Coins"
          text="Complete tasks to earn 10 coins each."
        />
        <GardenTip
          icon={<CheckSquare size={34} />}
          title="Stay Consistent"
          text="Small steps every day grow a beautiful garden."
        />
        <GardenTip
          imageSrc={wateringCan}
          title="Watch It Grow"
          text="Upgrade your garden and unlock new stages."
        />
      </section>
    </section>
  );
}

function GardenTip({ icon, imageSrc, text, title }) {
  return (
    <article className="garden-tip">
      <div className="garden-tip-icon" aria-hidden="true">
        {imageSrc ? <img src={imageSrc} alt="" /> : icon}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
