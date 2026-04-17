import { Link } from "react-router-dom";

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  submitLabel,
  footerText,
  footerLinkText,
  footerLinkTo,
  children,
  isSubmitting = false,
}) {
  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        <div className="form-grid">{children}</div>
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
        <p className="muted">
          {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
        </p>
      </form>
    </div>
  );
}
