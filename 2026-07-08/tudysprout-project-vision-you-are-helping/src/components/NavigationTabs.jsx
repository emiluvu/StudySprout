import dashboardIcon from "../assets/nav-icons/dashboard.svg";
import gardenIcon from "../assets/nav-icons/garden.svg";
import plannerIcon from "../assets/nav-icons/planner.svg";
import settingsIcon from "../assets/nav-icons/settings.svg";
import studyGuideIcon from "../assets/nav-icons/study-guide.svg";

// The tab list lives in one place so adding, removing, or renaming tabs later is
// a small change instead of hunting through the page markup.
const tabs = [
  { id: "dashboard", label: "Dashboard", iconSrc: dashboardIcon },
  { id: "planner", label: "Planner", iconSrc: plannerIcon },
  { id: "garden", label: "Garden", iconSrc: gardenIcon },
  { id: "study-guide", label: "Study Guide", iconSrc: studyGuideIcon },
  { id: "settings", label: "Settings", iconSrc: settingsIcon },
];

// NavigationTabs is intentionally simple: it receives the active tab from App
// and asks App to change that value when a student clicks a tab.
export function NavigationTabs({ activeTab, onTabChange }) {
  return (
    <nav className="tab-nav" aria-label="StudySprout sections">
      <div className="tab-list">
        {tabs.map(({ iconSrc, id, label }) => {
          const isActive = activeTab === id;

          return (
            <button
              aria-pressed={isActive}
              className={`tab-button ${isActive ? "is-active" : ""}`}
              id={`${id}-tab`}
              key={id}
              onClick={() => onTabChange(id)}
              type="button"
            >
              {/* Custom image icons make the tabs feel like part of the
                  illustrated StudySprout world instead of stock app controls. */}
              <img alt="" aria-hidden="true" className="tab-icon-image" src={iconSrc} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
