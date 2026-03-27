const ProfileSection = ({ profile, onEdit }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 pt-3 pb-5 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <img src={profile.avatar} alt="프로필" className="h-24 w-24 rounded-full object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <p className="mt-1 text-sm text-slate-600">{profile.intro}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            <a href={profile.github} className="rounded-full border px-2 py-1">GitHub</a>
            <a href={profile.portfolio} className="rounded-full border px-2 py-1">Portfolio</a>
            {profile.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                #{skill}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="h-fit rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          프로필 수정
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;