import dashboardGardenPanel from "../assets/illustrations/dashboard-garden-panel.jpeg";
import sidebarGardenVignette from "../assets/illustrations/sidebar-garden-vignette.webp";

// GardenScene is a reusable illustration panel. The same component can show a
// wide dashboard pond or the taller sidebar vignette by changing the compact prop.
export function GardenScene({
  completedCount = 0,
  compact = false,
  gardenStage = null,
  totalTasks = 0,
}) {
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
  const sceneImage = compact
    ? sidebarGardenVignette
    : gardenStage?.imageSrc ?? dashboardGardenPanel;
  const stageLevel = gardenStage?.level ?? 0;

  return (
    <div
      className={`garden-scene garden-scene-level-${stageLevel} ${
        compact ? "garden-scene-compact" : ""
      }`}
    >
      <img
        alt=""
        aria-hidden="true"
        className="garden-scene-image"
        src={sceneImage}
      />

      {!compact ? (
        <div className="scene-caption">
          <strong>{gardenStage?.name ?? "Today's Intention"}</strong>
          <span>
            {gardenStage?.description ?? "Small steps, peaceful growth."}{" "}
            {progressPercent}% garden glow.
          </span>
        </div>
      ) : null}
    </div>
  );
}
