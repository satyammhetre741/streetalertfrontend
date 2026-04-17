import { impacts, sectors } from "@/app/types/domain";

export function NewsFeedFilters({ sector, impact, onChange }) {
  return (
    <div className="card filters">
      <label className="label">
        <span>Sector</span>
        <select value={sector ?? ""} onChange={(event) => onChange({ sector: event.target.value || undefined, impact })}>
          <option value="">All sectors</option>
          {sectors.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="label">
        <span>Impact</span>
        <select value={impact ?? ""} onChange={(event) => onChange({ sector, impact: event.target.value || undefined })}>
          <option value="">All impact levels</option>
          {impacts.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
