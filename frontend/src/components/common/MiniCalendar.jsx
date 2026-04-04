import { useMemo, useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const CALENDAR_CELL_COUNT = 42;

const getMonthStartDate = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const addMonths = (date, months) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

const isSameDate = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const buildCalendar = (baseDate, today) => {
  const monthStartDate = getMonthStartDate(baseDate);
  const firstVisibleDate = addDays(monthStartDate, -monthStartDate.getDay());

  return Array.from({ length: CALENDAR_CELL_COUNT }, (_, index) => {
    const cellDate = addDays(firstVisibleDate, index);

    return {
      key: `${cellDate.getFullYear()}-${cellDate.getMonth()}-${cellDate.getDate()}`,
      date: cellDate.getDate(),
      muted: cellDate.getMonth() !== monthStartDate.getMonth(),
      isToday: isSameDate(cellDate, today),
    };
  });
};

const MiniCalendar = () => {
  const [today] = useState(() => new Date());
  const [currentDate, setCurrentDate] = useState(getMonthStartDate(today));
  const yearLabel = `${currentDate.getFullYear()}년`;
  const monthLabel = `${currentDate.getMonth() + 1}월`;
  const calendarDays = useMemo(() => buildCalendar(currentDate, today), [currentDate, today]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.10)] transition duration-200 hover:border-[#C9D7FF] hover:shadow-[0_22px_46px_rgba(51,109,254,0.12)]">
      <div className="flex items-center justify-between bg-[#336DFE] px-6 py-5 text-white">
        <button
          type="button"
          aria-label="previous month"
          onClick={() => setCurrentDate((prevDate) => addMonths(prevDate, -1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-base transition hover:bg-white/10"
        >
          &lt;
        </button>
        <div className="text-center leading-none">
          <p className="text-xs font-bold text-white/80">{yearLabel}</p>
          <p className="mt-1 text-[1.35rem] font-black">{monthLabel}</p>
        </div>
        <button
          type="button"
          aria-label="next month"
          onClick={() => setCurrentDate((prevDate) => addMonths(prevDate, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-base transition hover:bg-white/10"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-3 px-5 py-5 text-center">
        {DAYS.map((day, index) => (
          <span key={`${day}-${index}`} className="text-sm font-medium text-slate-400">
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
