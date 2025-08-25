import { Link } from "react-router-dom";
import Styles from "../../Pages/Styles/PageNotFound.module.css";

export function PageNotFound() {
  return (
    <main className={Styles.wrap} aria-labelledby="pnf-title">
      <section className={Styles.card}>
        {/* Minimal B&W sketch */}
        <svg
          className={Styles.sketch}
          viewBox="0 0 240 160"
          role="img"
          aria-label="Magnifying glass searching for page"
        >
          {/* Frame */}
          <rect x="16" y="16" width="140" height="96" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Search bar */}
          <rect x="24" y="28" width="124" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Lines */}
          <line x1="24" y1="52" x2="144" y2="52" stroke="currentColor" strokeWidth="1" />
          <line x1="24" y1="64" x2="144" y2="64" stroke="currentColor" strokeWidth="1" />
          <line x1="24" y1="76" x2="114" y2="76" stroke="currentColor" strokeWidth="1" />
          {/* Magnifying glass */}
          <circle cx="170" cy="84" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="184" y1="98" x2="204" y2="118" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* 404 hint */}
          <text x="86" y="108" textAnchor="middle" fontSize="16" fill="currentColor" opacity="0.6" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">404</text>
        </svg>

        <h1 id="pnf-title" className={Styles.title}>Page not found</h1>
        <p className={Styles.subtitle}>
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className={Styles.actions}>
          <Link className={`${Styles.btn} ${Styles.primary}`} to="/">Go home</Link>
          <button className={Styles.btn} onClick={() => window.history.back()}>Go back</button>
        </div>

        <code className={Styles.hint}>Error code: 404</code>
      </section>
    </main>
  );
}
