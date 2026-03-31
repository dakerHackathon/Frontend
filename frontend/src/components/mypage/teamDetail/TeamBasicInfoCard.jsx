import { useEffect, useState } from "react";
import PrimaryActionButton from "../../common/PrimaryActionButton";
import { baseInputClass, pageCardClass } from "./shared.jsx";

const TeamBasicInfoCard = ({
  isLeader,
  teamForm,
  onSave,
  saveNotice,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(teamForm.name);
  const [draftDescription, setDraftDescription] = useState(teamForm.description);

  useEffect(() => {
    if (!isEditing) {
      setDraftName(teamForm.name);
      setDraftDescription(teamForm.description);
    }
  }, [isEditing, teamForm.description, teamForm.name]);

  const handleCancel = () => {
    setDraftName(teamForm.name);
    setDraftDescription(teamForm.description);
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave({
      name: draftName,
      description: draftDescription,
    });
    setIsEditing(false);
  };

  return (
    <div className={pageCardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">팀 기본 정보</h2>
          <p className="mt-1 text-sm text-slate-500">
            팀명과 소개를 확인하고 필요한 경우 바로 수정할 수 있습니다.
          </p>
        </div>
        {saveNotice ? (
          <span className="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-bold text-[#2458E6]">
            {saveNotice}
          </span>
        ) : null}
      </div>

      {isEditing ? (
        <>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">팀명</span>
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className={baseInputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">팀 소개</span>
              <textarea
                rows={4}
                value={draftDescription}
                onChange={(event) => setDraftDescription(event.target.value)}
                className={`${baseInputClass} min-h-[120px] resize-none`}
              />
            </label>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              취소
            </button>
            <PrimaryActionButton onClick={handleSave}>저장</PrimaryActionButton>
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">팀명</p>
              <p className="mt-2 text-xl font-black text-slate-950">{teamForm.name}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">팀 소개</p>
              <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                {teamForm.description}
              </p>
            </div>
          </div>

          {isLeader ? (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-2xl border border-[#C9D7FF] px-4 py-3 text-sm font-bold text-[#2458E6] transition hover:bg-[#EEF3FF]"
              >
                수정
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default TeamBasicInfoCard;
