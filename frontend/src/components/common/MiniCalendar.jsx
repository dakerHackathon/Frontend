import { useMemo, useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const buildCalendar = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const days = [];
  const firstWeekday = firstDay.getDay();

  for (let index = firstWeekday - 1; index >= 0; index -= 1) {
    days.push({
      key: `prev-${index}`,
      date: prevLastDay.getDate() - index,
      muted: true,
    });
  }

  for (let date = 1; date <= lastDay.getDate(); date += 1) {
    days.push({
      key: `current-${date}`,
      date,
      muted: false,
      isToday: year === 2026 && month === 2 && date === 24,
    });
  }

  const remainder = (7 - (days.length % 7)) % 7;

  for (let date = 1; date <= remainder; date += 1) {
    days.push({
      key: `next-${date}`,
      date,
      muted: true,
    });
  }

  return days;
};

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const monthLabel = `${currentDate.getMonth() + 1}월`;
  const calendarDays = useMemo(() => buildCalendar(currentDate), [currentDate]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.10)] transition duration-200 hover:border-[#C9D7FF] hover:shadow-[0_22px_46px_rgba(51,109,254,0.12)]">
      <div className="flex items-center justify-between bg-[#336DFE] px-6 py-5 text-white">
        <button
          type="button"
          aria-label="previous month"
          onClick={() =>
            setCurrentDate(
              (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
            )
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-base transition hover:bg-white/10"
        >
          &lt;
        </button>
        <span className="text-[1.5rem] font-black">{monthLabel}</span>
        <button
          type="button"
          aria-label="next month"
          onClick={() =>
            setCurrentDate(
              (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
            )
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-base transition hover:bg-white/10"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-3 px-5 py-5 text-center">
        {DAYS.map((day) => (
          <span key={day} className="text-sm font-medium text-slate-400">
            {day}
          </span>
        ))}

        {calendarDays.map((day, index) => {
          const isSunday = index % 7 === 0;
          const isSaturday = index % 7 === 6;

          return (
            <span
              key={day.key}
              className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition duration-150 hover:bg-[#EEF3FF] ${
                day.isToday
                  ? "bg-[#EAF0FF] text-[#336DFE]"
                  : day.muted
                    ? "text-slate-300"
                    : isSunday
                      ? "text-[#EB3B3B]"
                      : isSaturday
                        ? "text-[#336DFE]"
                        : "text-slate-900"
              }`}
            >
              {day.date}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
