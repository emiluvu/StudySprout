// StatCard is a reusable dashboard stat block. It accepts an icon component and
// an optional watercolor decoration so the dashboard can feel illustrated while
// the stat layout stays consistent.
export function StatCard({
  accent = "sage",
  decorationSrc,
  icon: Icon,
  label,
  note,
  value,
}) {
  return (
    <article className={`stat-card stat-card-${accent}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
      {Icon ? <Icon size={26} /> : null}
      {decorationSrc ? (
        <img
          alt=""
          aria-hidden="true"
          className="stat-card-decoration"
          src={decorationSrc}
        />
      ) : (
        <span className="stat-card-sprig" aria-hidden="true" />
      )}
    </article>
  );
}
