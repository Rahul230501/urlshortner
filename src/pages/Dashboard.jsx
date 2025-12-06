import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import FormField from "../components/FormField.jsx";

function sortLinks(links, sortBy, direction) {
  const sorted = [...links].sort((a, b) => {
    if (sortBy === "clicks") {
      return (a.clicks ?? 0) - (b.clicks ?? 0);
    }
    if (sortBy === "lastClickedAt") {
      const da = a.lastClickedAt ? new Date(a.lastClickedAt) : 0;
      const db = b.lastClickedAt ? new Date(b.lastClickedAt) : 0;
      return da - db;
    }
    // default: shortId
    return a.shortId.localeCompare(b.shortId);
  });
  if (direction === "desc") sorted.reverse();
  return sorted;
}

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [linksError, setLinksError] = useState(null);

  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null); // success | error | null
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("shortId");
  const [sortDir, setSortDir] = useState("asc");
  const [copiedId, setCopiedId] = useState(null);

  // Load links from backend
  async function fetchLinks(searchTerm = "") {
    try {
      setLoadingLinks(true);
      setLinksError(null);
      const res = await api.get("/api/links", {
        params: searchTerm ? { search: searchTerm } : {},
      });
      setLinks(res.data || []);
    } catch (err) {
      console.error(err);
      setLinksError("Failed to load links. Please try again.");
    } finally {
      setLoadingLinks(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  // Search with small delay (debounce-ish)
  useEffect(() => {
    const handle = setTimeout(() => {
      fetchLinks(search);
    }, 300);
    return () => clearTimeout(handle);
  }, [search]);

  const sortedLinks = useMemo(
    () => sortLinks(links, sortBy, sortDir),
    [links, sortBy, sortDir]
  );

  function toggleSort(column) {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  }

  function validateForm() {
    const errors = {};
    if (!originalUrl.trim()) {
      errors.originalUrl = "Please enter a URL.";
    } else {
      try {
        // simple URL validation
        new URL(originalUrl.trim());
      } catch {
        errors.originalUrl = "That doesn’t look like a valid URL.";
      }
    }

    if (customCode && !/^[a-zA-Z0-9_-]+$/.test(customCode)) {
      errors.customCode = "Use only letters, numbers, - or _";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormStatus(null);
    setFormMessage("");

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        originalUrl: originalUrl.trim(),
        ...(customCode.trim() && { customCode: customCode.trim() }),
      };

      const res = await api.post("/shorten", payload);
      setFormStatus("success");
      setFormMessage("Link created successfully.");
      setOriginalUrl("");
      setCustomCode("");
      setFormErrors({});

      // Insert new link at top without full reload
      setLinks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error || "Could not create link. Please try again.";
      setFormStatus("error");
      setFormMessage(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(shortId) {
    if (!window.confirm(`Delete short code "${shortId}"?`)) return;
    try {
      await api.delete(`/api/links/${shortId}`);
      setLinks((prev) => prev.filter((l) => l.shortId !== shortId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    }
  }

  async function handleCopy(text, linkId) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(linkId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
      alert("Could not copy to clipboard.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Top section: form */}
      <section className="bg-linear-to-br from-slate-900 to-slate-800/90 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-emerald-500/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Shorten a new URL
            </h1>
            <p className="text-base text-slate-300 mt-1.5">
              Paste a long URL and optionally choose a custom short code.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 md:space-y-0 md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_auto] md:gap-4 items-end"
        >
          <FormField
            label="Target URL"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/very/long/path"
            error={formErrors.originalUrl}
          />

          <FormField
            label="Custom code (optional)"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-custom-code"
            error={formErrors.customCode}
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/50 disabled:bg-emerald-500/60 disabled:cursor-not-allowed transition-all duration-200 w-full md:w-auto"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin mr-2" />
                Creating…
              </>
            ) : (
              "Create short link"
            )}
          </button>
        </form>

        {formStatus && (
          <div
            className={`mt-4 text-base rounded-xl px-4 py-3 border font-medium ${
              formStatus === "success"
                ? "bg-emerald-500/20 border-emerald-500/70 text-emerald-200"
                : "bg-red-500/20 border-red-500/70 text-red-200"
            }`}
          >
            {formMessage}
          </div>
        )}
      </section>

      {/* Links table section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">All links</h2>
            <p className="text-base text-slate-300 mt-1">
              Manage your short codes, view clicks, and open stats.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code or URL…"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-linear-to-b from-slate-900 to-slate-900/80 shadow-xl">
          {/* States: loading / error / empty */}
          {loadingLinks ? (
            <div className="p-8 text-base text-slate-300">Loading links…</div>
          ) : linksError ? (
            <div className="p-8 text-base text-red-300 flex items-center justify-between">
              <span>{linksError}</span>
              <button
                onClick={() => fetchLinks(search)}
                className="text-sm rounded-lg border border-red-500/60 px-3 py-2 hover:bg-red-500/10 font-medium"
              >
                Retry
              </button>
            </div>
          ) : sortedLinks.length === 0 ? (
            <div className="p-8 text-base text-slate-300">
              <p className="font-semibold text-white text-lg mb-2">
                No links yet.
              </p>
              <p>Use the form above to create your first short link.</p>
            </div>
          ) : (
            <table className="min-w-full text-base">
              <thead className="bg-slate-900/90">
                <tr className="text-left text-slate-300 border-b border-slate-700">
                  <HeaderCell
                    label="Short code"
                    column="shortId"
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                  <th className="px-5 py-4 font-semibold">Short URL</th>
                  <th className="px-5 py-4 font-semibold">Target URL</th>
                  <HeaderCell
                    label="Clicks"
                    column="clicks"
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onClick={toggleSort}
                    align="right"
                  />
                  <HeaderCell
                    label="Last clicked"
                    column="lastClickedAt"
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLinks.map((link) => {
                  const base = import.meta.env.VITE_API_BASE.replace(/\/$/, "");
                  const shortUrl = link.shortUrl || `${base}/${link.shortId}`;
                  return (
                    <tr
                      key={link.shortId}
                      className="border-b border-slate-800/80 hover:bg-slate-800/50 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-mono text-sm md:text-base text-white font-medium">
                        {link.shortId}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(shortUrl, link.shortId)}
                            className={`text-sm rounded-lg border px-3 py-1.5 transition-all font-medium ${
                              copiedId === link.shortId
                                ? "border-emerald-500 text-emerald-400 bg-emerald-500/20"
                                : "border-blue-500/60 text-blue-300 bg-blue-500/10 hover:border-blue-400 hover:text-blue-200 hover:bg-blue-500/20"
                            }`}
                          >
                            {copiedId === link.shortId ? "Copied!" : "Copy"}
                          </button>
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate max-w-[140px] md:max-w-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                          >
                            {shortUrl}
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="truncate max-w-[220px] md:max-w-md inline-block text-slate-200">
                          {link.originalUrl}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-white font-semibold">
                        {link.clicks ?? 0}
                      </td>
                      <td className="px-5 py-4 text-slate-200">
                        {link.lastClickedAt ? (
                          new Date(link.lastClickedAt).toLocaleString()
                        ) : (
                          <span className="text-slate-500">Never</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/code/${link.shortId}`}
                            className="text-sm rounded-lg border border-purple-500/60 text-purple-300 bg-purple-500/10 px-3 py-1.5 hover:border-purple-400 hover:text-purple-200 hover:bg-purple-500/20 transition-all font-medium"
                          >
                            Stats
                          </Link>
                          <button
                            onClick={() => handleDelete(link.shortId)}
                            className="text-sm rounded-lg border border-red-500/60 px-3 py-1.5 text-red-300 hover:bg-red-500/15 hover:border-red-400 transition-all font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function HeaderCell({ label, column, sortBy, sortDir, onClick, align }) {
  const active = sortBy === column;
  const arrow = !active ? "⇅" : sortDir === "asc" ? "↑" : "↓";

  return (
    <th
      className={`px-5 py-4 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onClick(column)}
        className={`inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide hover:text-emerald-300 transition-colors ${
          active ? "text-emerald-400" : "text-slate-300"
        }`}
      >
        <span>{label}</span>
        <span className="text-xs">{arrow}</span>
      </button>
    </th>
  );
}
