const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-blue-600">
    <path
      d="M7 4.5H17C17.6 4.5 18 4.9 18 5.5V19.5L12 15.7L6 19.5V5.5C6 4.9 6.4 4.5 7 4.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const SavedHackathonsSection = ({ savedHackathons }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white pt-4 pb-5 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
      <h2 className="px-4 text-lg font-bold">저장한 해커톤</h2>
      <div className="mt-3 max-h-[220px] space-y-2 overflow-y-auto px-4 pb-3">
        {savedHackathons.map((saved) => (
          <div key={saved.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="text-sm font-semibold">{saved.title}</p>
              <p className="text-xs text-slate-500">{saved.org}</p>
            </div>
            <BookmarkIcon />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavedHackathonsSection;