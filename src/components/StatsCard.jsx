export default function StatsCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-current/10 bg-white/8 px-6 py-8 text-center backdrop-blur">
      <p className="text-gradient-primary text-4xl font-extrabold">{value}</p>
      <p className="mt-2 text-sm opacity-80">{label}</p>
    </div>
  );
}
