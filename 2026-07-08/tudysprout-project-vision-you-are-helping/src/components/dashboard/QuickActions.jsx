import { BookOpenCheck, CalendarDays, Flower2, PlusCircle } from "lucide-react";

const actions = [
  { label: "Add Assignment", icon: PlusCircle, tab: "planner" },
  { label: "Planner", icon: CalendarDays, tab: "planner" },
  { label: "Garden", icon: Flower2, tab: "garden" },
  { label: "Study Guide", icon: BookOpenCheck, tab: "study-guide" },
];

// QuickActions provides shortcuts to the other tabs without adding React Router.
// Each button simply asks App to change the active tab state.
export function QuickActions({ onNavigate }) {
  return (
    <section className="card dashboard-card quick-actions-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="eyebrow">Quick actions</p>
          <h2>Jump to</h2>
        </div>
      </div>

      <div className="quick-action-grid">
        {actions.map(({ icon: Icon, label, tab }) => (
          <button
            className="quick-action-button"
            key={label}
            onClick={() => onNavigate(tab)}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
