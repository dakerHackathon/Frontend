const StatIcon = ({ type }) => {
  if (type === "wins") return <span aria-hidden>🏆</span>;
  if (type === "join") return <span aria-hidden>🎯</span>;
  if (type === "bookmark") return <span aria-hidden>🔖</span>;
  return <span aria-hidden>📊</span>;
};

const ActivityTemperatureCard = ({ temperature, stats }) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
      <div className="space-y-4">
        <div className="rounded-xl bg-blue-600 px-4 py-3 text-white">
          <p className="text-xs">활동 온도</p>
          <p className="text-3xl font-black">{temperature.toFixed(1)}℃</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 p-3 text-center">
              <p className="mb-1 flex items-center justify-center gap-1 text-xs text-slate-500">
                <StatIcon type={item.icon} />
                {item.label}
              </p>
              <p className="text-lg font-black text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ActivityTemperatureCard;