// QuickStat is a small reusable summary pill for the hero area.
// The icon is passed in as a component so App can choose which icon to show.
export function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className="quick-stat">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
