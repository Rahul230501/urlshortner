import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function StatsPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/code/${code}`);
        if (!isMounted) return;
        setLink(res.data);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        if (err.response?.status === 404) {
          setError("This short code does not exist.");
        } else {
          setError("Failed to load stats. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [code]);

  async function handleCopy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
      alert("Could not copy to clipboard.");
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/40">
        <p className="text-sm text-slate-300">Loading stats…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/40 space-y-3">
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm rounded-lg border border-blue-500/60 px-4 py-2 text-blue-300 bg-blue-500/10 hover:border-blue-400 hover:text-blue-200 hover:bg-blue-500/20 active:scale-95 transition-all font-medium"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const shortUrl =
    link.shortUrl ||
    `${window.location.origin.replace(/\/$/, "")}/${link.shortId}`;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-500 tracking-tight">
            Stats for <span className="font-mono text-emerald-300">{code}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detailed view of a single short link.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-sm rounded-lg border border-blue-500/60 px-4 py-2 text-blue-300 bg-blue-500/10 hover:border-blue-400 hover:text-blue-200 hover:bg-blue-500/20 active:scale-95 transition-all font-medium"
        >
          Back
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/40 space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
            Short URL
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <code className="px-2 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-xs text-emerald-300">
              {shortUrl}
            </code>
            <button
              onClick={() => handleCopy(shortUrl)}
              className={`text-sm rounded-lg border px-3 py-1.5 active:scale-95 transition-all font-medium ${
                copied
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/20"
                  : "border-blue-500/60 text-blue-300 bg-blue-500/10 hover:border-blue-400 hover:text-blue-200 hover:bg-blue-500/20"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm rounded-lg border border-purple-500/60 px-3 py-1.5 text-purple-300 bg-purple-500/10 hover:border-purple-400 hover:text-purple-200 hover:bg-purple-500/20 active:scale-95 transition-all font-medium"
            >
              Open
            </a>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
            Target URL
          </h2>
          <p className="text-sm text-slate-100 break-all">{link.originalUrl}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <StatCard label="Total clicks" value={link.clicks ?? 0} />
          <StatCard
            label="Last clicked"
            value={
              link.lastClickedAt
                ? new Date(link.lastClickedAt).toLocaleString()
                : "Never"
            }
          />
          <StatCard
            label="Created at"
            value={new Date(link.createdAt).toLocaleString()}
          />
          <StatCard
            label="Updated at"
            value={new Date(link.updatedAt).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm text-slate-50 wrap-break-word">{value}</p>
    </div>
  );
}
