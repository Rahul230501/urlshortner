import { Link, useLocation } from "react-router-dom";
import HealthBadge from "./HealthBadge.jsx";

export default function Layout({ children }) {
  const location = useLocation();

  const isStatsPage = location.pathname.startsWith("/code/");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/40">
              <span className="text-emerald-400 text-xl font-semibold">↧</span>
            </div>
            <div>
              <Link to="/" className="font-semibold text-slate-50">
                URL Shortener
              </Link>
              <p className="text-xs text-slate-400">
                Clean dashboard for your links
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-3 text-sm text-slate-300">
              <Link
                to="/"
                className={`hover:text-emerald-400 transition ${
                  !isStatsPage ? "text-emerald-400" : ""
                }`}
              >
                Dashboard
              </Link>
              <span className="text-slate-600">/</span>
              <span
                className={isStatsPage ? "text-emerald-400" : "text-slate-500"}
              >
                Stats
              </span>
            </nav>
            <HealthBadge />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <span>© {new Date().getFullYear()} URL Shortener</span>
          <span className="hidden sm:inline">Built with React & Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
