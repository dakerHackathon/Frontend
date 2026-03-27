import { useState } from "react";
import Modal from "./Modal";

const TeamMembersModal = ({ team, onClose, currentUserEmail }) => {
  const [activeMenuMemberId, setActiveMenuMemberId] = useState(null);

  if (!team) return null;

  const toggleMenu = (memberId) => {
    setActiveMenuMemberId((prev) => (prev === memberId ? null : memberId));
  };

  return (
    <Modal title={`${team.name} 팀원`} onClose={onClose} maxWidth="max-w-xl">
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
                aria-label="멤버 메뉴 열기"
                title="멤버 메뉴"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <circle cx="4" cy="10" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="16" cy="10" r="1.5" />
                </svg>
              </button>
              {activeMenuMemberId === member.id && (
                <div className="absolute right-3 top-11 z-10 w-40 space-y-1 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
                  {team.role === "팀장" ? (
                    <>
                      <button type="button" className="block w-full whitespace-nowrap rounded px-2 py-1 text-left text-rose-500 hover:bg-rose-50">팀 내보내기</button>
                      <button type="button" className="block w-full whitespace-nowrap rounded px-2 py-1 text-left hover:bg-slate-50">쪽지 보내기</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="block w-full whitespace-nowrap rounded px-2 py-1 text-left hover:bg-slate-50">쪽지 보내기</button>
                      {member.email === currentUserEmail ? (
                        <button type="button" className="block w-full whitespace-nowrap rounded px-2 py-1 text-left text-rose-500 hover:bg-rose-50">팀 나가기</button>
                      ) : null}
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
