export default function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-white uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm
        ${error ? "border-red-500" : "border-slate-700"}`}
      />
      {error && (
        <p className="text-sm text-red-300 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
