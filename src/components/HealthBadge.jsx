import { useEffect, useState } from "react";
import { api } from "../api";

export default function HealthBadge() {
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [uptime, setUptime] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHealth() {
      try {
        const res = await api.get("/healthz");
        if (!isMounted) return;
        setStatus("ok");
        setUptime(Math.floor(res.data.uptimeSeconds ?? res.data.uptime ?? 0));
      } catch (e) {
        if (!isMounted) return;
        setStatus("error");
      }
    }

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // refresh every 30s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const label =
    status === "loading"
      ? "Checking..."
      : status === "ok"
      ? "API healthy"
      : "API offline";

  const color =
    status === "loading"
      ? "bg-yellow-500"
      : status === "ok"
      ? "bg-emerald-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
      {status === "ok" && uptime != null && (
        <span className="text-slate-500">
          • Uptime: {Math.floor(uptime / 60)} min
        </span>
      )}
    </div>
  );
}
