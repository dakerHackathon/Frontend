const InboxSection = ({ unreadCount = 3 }) => {
  return (
    <section className="rounded-2xl border border-blue-200 bg-slate-100 p-6 shadow-[0_8px_16px_rgba(30,64,175,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
              <path
                d="M5 7.5C5 6.7 5.7 6 6.5 6H17.5C18.3 6 19 6.7 19 7.5V16.5C19 17.3 18.3 18 17.5 18H6.5C5.7 18 5 17.3 5 16.5V7.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="M8 10.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-black leading-none text-slate-900">내 쪽지함</h3>
            <p className="mt-1 text-base font-semibold text-slate-500">확인하지 않은 쪽지 {unreadCount}통</p>
          </div>
        </div>

        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow">
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <path
              d="M8 5.5L12.5 10L8 14.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default InboxSection;