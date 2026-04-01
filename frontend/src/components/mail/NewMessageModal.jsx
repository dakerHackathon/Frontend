import React, { useState } from "react";

const NewMessageModal = ({ isOpen, onClose }) => {
  // 입력 필드 상태 관리
  const [formData, setFormData] = useState({
    receiver: "",
    subject: "",
    content: "",
  });

  if (!isOpen) return null;

  // [추가] 보내기 클릭 시 실행될 함수
  const handleSend = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 1. 전송 완료 알림
    alert("전송이 완료되었습니다!");

    // 2. 입력란 비우기 (다음에 열 때 깨끗하도록)
    setFormData({ receiver: "", subject: "", content: "" });

    // 3. 부모가 내려준 닫기 함수 실행
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold text-[#2F3645]">
          새 메시지 작성
        </h2>

        {/* onSubmit 연결 */}
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#656D7E]">
              받는 사람
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[#E4E9F2] p-3 outline-none focus:border-[#336DFE]"
              value={formData.receiver}
              onChange={(e) =>
                setFormData({ ...formData, receiver: e.target.value })
              }
              placeholder="사용자명 또는 팀명"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#656D7E]">
              제목
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[#E4E9F2] p-3 outline-none focus:border-[#336DFE]"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#656D7E]">
              내용
            </label>
            <textarea
              rows="5"
              className="w-full rounded-xl border border-[#E4E9F2] p-3 outline-none focus:border-[#336DFE] resize-none"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-6 py-2.5 font-bold text-[#99A2B4] hover:bg-[#F8F9FB]"
            >
              취소
            </button>
            <button
              type="submit" // form의 onSubmit(handleSend)을 트리거함
              className="rounded-xl bg-[#336DFE] px-6 py-2.5 font-bold text-white shadow-md hover:bg-[#2856D1]"
            >
              보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMessageModal;
