import { GardenScene } from "./GardenScene.jsx";
import { MossyAvatar } from "./MossyAvatar.jsx";
import { NavigationTabs } from "./NavigationTabs.jsx";

// AppSidebar creates the persistent garden-home feeling. It wraps the existing
// tab navigation, so the app still changes screens through React state only.
export function AppSidebar({
  activeTab,
  completedCount,
  onTabChange,
  totalTaskCount,
}) {
  return (
    <aside className="app-sidebar" aria-label="StudySprout navigation">
      <div className="brand-lockup">
        <span className="brand-mark">S</span>
        <div>
          <p className="brand-name">StudySprout</p>
          <span>quiet study garden</span>
        </div>
      </div>

      <section className="sidebar-mossy-card" aria-label="Mossy profile">
        <MossyAvatar size="large" />
        <div>
          <h2>Mossy</h2>
          <p>Small steps, peaceful mind.</p>
        </div>
        <div className="sidebar-progress">
          <span>{completedCount} steps grown</span>
          <div className="mini-progress-track" aria-hidden="true">
            <span
              style={{
                width: `${
                  totalTaskCount === 0
                    ? 0
                    : Math.round((completedCount / totalTaskCount) * 100)
                }%`,
              }}
            />
          </div>
        </div>
      </section>

      <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />

      <section className="sidebar-garden-card" aria-label="Mini garden scene">
        <GardenScene compact completedCount={completedCount} totalTasks={totalTaskCount} />
        <p>Take breaks like bamboo sways: gently and often.</p>
      </section>
    </aside>
  );
}
