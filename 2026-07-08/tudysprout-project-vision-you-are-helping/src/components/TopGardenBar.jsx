import { Bell } from "lucide-react";
import dashboardIcon from "../assets/nav-icons/dashboard.svg";
import { MossyAvatar } from "./MossyAvatar.jsx";

// TopGardenBar adds the small progress controls from the inspiration layout.
// It shows coins earned from tasks, while the real upgrade logic stays in App.
export function TopGardenBar({ coins }) {
  return (
    <header className="top-garden-bar" aria-label="StudySprout progress summary">
      <div className="leaf-counter" aria-label={`${coins} garden coins`}>
        <img alt="" aria-hidden="true" src={dashboardIcon} />
        <span>{coins}</span>
      </div>

      <button className="top-icon-button" type="button" aria-label="Notifications">
        <Bell size={19} />
      </button>

      <div className="top-avatar" aria-label="Mossy profile">
        <MossyAvatar size="tiny" />
      </div>
    </header>
  );
}
