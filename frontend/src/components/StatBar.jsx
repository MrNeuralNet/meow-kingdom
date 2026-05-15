import "./StatBar.css";

const MILESTONES = [50, 150, 300];

export default function StatBar({ stature, label }) {
  const pct = Math.min(100, (stature / 1000) * 100);
  let colorClass = "green";
  if (stature >= 700) colorClass = "purple";
  else if (stature >= 300) colorClass = "gold";

  return (
    <div className="stat-bar">
      {label && <span className="stat-bar__label">{label}</span>}
      <div className="stat-bar__track">
        <div className={`stat-bar__fill stat-bar__fill--${colorClass}`} style={{ width: `${pct}%` }} />
        {MILESTONES.map((m) => (
          <div
            key={m}
            className="stat-bar__marker"
            style={{ left: `${(m / 1000) * 100}%` }}
            title={`Unlock at ${m}`}
          />
        ))}
      </div>
      <span className="stat-bar__value">{stature}</span>
    </div>
  );
}
