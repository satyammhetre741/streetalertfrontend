export function StatusState({ title, description, action }) {
  return (
    <div className="card status-card">
      <h3>{title}</h3>
      {description ? <p className="muted">{description}</p> : null}
      {action}
    </div>
  );
}
