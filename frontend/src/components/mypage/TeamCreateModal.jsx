import { useState } from "react";
import Modal from "./Modal";
import { teamPartOptions } from "./constants";

const TeamCreateModal = ({
  isOpen,
  onClose,
  onCreate,
  isCreating = false,
  createError = "",
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    role: teamPartOptions[0].value,
  });

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      return;
    }

    const result = await onCreate(form);

    if (result?.isSuccess) {
      setForm({
        name: "",
        description: "",
        role: teamPartOptions[0].value,
      });
    }
  };

  return (
    <Modal title="팀 추가" onClose={onClose} maxWidth="max-w-xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">팀명</span>
          <input
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="팀 이름을 입력하세요"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">팀 소개</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="팀 소개를 입력하세요"
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">본인 역할</span>
          <select
            value={form.role}
            onChange={(event) => handleChange("role", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]"
          >
            {teamPartOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {createError ? <p className="text-sm font-semibold text-rose-500">{createError}</p> : null}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-xl bg-[#336DFE] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#2458E6] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isCreating ? "생성 중..." : "팀 추가"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamCreateModal;
