import Modal from "./Modal";

const ProfileEditModal = ({
  isOpen,
  editForm,
  setEditForm,
  skillQuery,
  setSkillQuery,
  filteredSkills,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="프로필 수정" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <label className="block">
          <span className="mb-1 block font-medium">닉네임</span>
          <input
            value={editForm.name}
            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">이메일 (수정 불가)</span>
          <input
            value={editForm.email}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">자기 소개</span>
          <textarea
            rows={3}
            value={editForm.intro}
            onChange={(e) => setEditForm((prev) => ({ ...prev, intro: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">GitHub 링크</span>
          <input
            value={editForm.github}
            onChange={(e) => setEditForm((prev) => ({ ...prev, github: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">Portfolio 링크</span>
          <input
            value={editForm.portfolio}
            onChange={(e) => setEditForm((prev) => ({ ...prev, portfolio: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div>
          <span className="mb-1 block font-medium">스킬 추가</span>
          <input
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            placeholder="스킬 검색"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {skillQuery && (
            <div className="mt-2 max-h-28 overflow-y-auto rounded-lg border border-slate-200">
              {filteredSkills.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">검색 결과가 없습니다.</p>
              ) : (
                filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setEditForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
                      setSkillQuery("");
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    {skill}
                  </button>
                ))
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {editForm.skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() =>
                  setEditForm((prev) => ({
                    ...prev,
                    skills: prev.skills.filter((entry) => entry !== skill),
                  }))
                }
                className="group rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
              >
                #{skill}
                <span className="ml-1 hidden group-hover:inline">x</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
