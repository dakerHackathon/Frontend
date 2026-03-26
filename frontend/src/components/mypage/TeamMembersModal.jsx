import { useState } from "react";
import Modal from "./Modal";

const TeamMembersModal = ({ team, onClose }) => {
  const [activeMenuMemberId, setActiveMenuMemberId] = useState(null);

  if (!team) return null;

  const toggleMenu = (memberId) => {
    setActiveMenuMemberId((prev) => (prev === memberId ? null : memberId));
  };

  return (
    <Modal title={`${team.name} 팀원`} onClose={onClose}>
      <div className="space-y-2">
        {team.members.map((member) => (
          <div key={member.id} className="relative flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-slate-500">{member.email}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => toggleMenu(member.id)}
                className="rounded-md border border-slate-200 px-2 py-1 text-sm"
              >
                ...
              </button>
              {activeMenuMemberId === member.id && (
                <div className="absolute right-3 top-11 z-10 w-28 space-y-1 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
                  {team.role === "팀장" ? (
                    <>
                      <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-slate-50">팀 내보내기</button>
                      <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-slate-50">쪽지 보내기</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-slate-50">쪽지 보내기</button>
                      <button type="button" className="block w-full rounded px-2 py-1 text-left text-rose-500 hover:bg-rose-50">팀 나가기</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default TeamMembersModal;