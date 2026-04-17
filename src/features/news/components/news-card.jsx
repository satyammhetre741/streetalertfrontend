import { formatDateTime } from "@/shared/utils/format";

export function NewsCard({ article }) {
  return (
    <article className="card news-card">
      <div className="row">
        <span className="pill">{article.sector}</span>
        <span className="pill">{article.impact}</span>
      </div>
      <h3>{article.title}</h3>
      <p className="muted">{article.description}</p>
      <div className="row space-between">
        <small className="muted">
          {article.source} • {formatDateTime(article.publishedAt)}
        </small>
        <a href={article.url} target="_blank" rel="noreferrer">
          Open source
        </a>
      </div>
    </article>
  );
}
