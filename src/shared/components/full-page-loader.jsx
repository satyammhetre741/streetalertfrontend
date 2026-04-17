export function FullPageLoader({ label = "Loading..." }) {
  return (
    <div className="center-state">
      <div className="spinner" aria-hidden />
      <p>{label}</p>
    </div>
  );
}
