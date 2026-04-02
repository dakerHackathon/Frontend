import { useState } from "react";
import { createPortal } from "react-dom";

const NewMessageModal = ({
  isOpen,
  onClose,
  onSend,
  initialReceiver = "",
  initialSubject = "",
}) => {
  const [receiver, setReceiver] = useState(initialReceiver);
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 2. 부모에게 받은 전송 함수를 실행합니다. (데이터 전달)
    if (onSend) {
      console.log("전송 데이터:", { receiver, subject, content });
      const success = await onSend(receiver, subject, content);

      // 전송 성공 시에만 모달을 닫고 상태를 비우고 싶다면 아래와 같이 처리합니다.
      if (success) {
        alert("전송이 완료되었습니다.");
        onClose();
        setReceiver("");
        setSubject("");
        setContent("");
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/45 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-[#E9EDF5] bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between border-b border-[#E9EDF5] pb-3">
          <h3 className="text-lg font-bold text-slate-900">새 메시지 작성</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            title="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="message-receiver"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              받는 사람
            </label>
            <input
              id="message-receiver"
              value={receiver}
              onChange={(event) => setReceiver(event.target.value)}
              placeholder="받는 사람 이메일 또는 이름"
              className="h-11 w-full rounded-lg border border-[#DCE3EF] px-3 text-sm outline-none focus:border-[#336DFE]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message-subject"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              제목
            </label>
            <input
              id="message-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="제목을 입력하세요"
              className="h-11 w-full rounded-lg border border-[#DCE3EF] px-3 text-sm outline-none focus:border-[#336DFE]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message-content"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              내용
            </label>
            <textarea
              id="message-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="메시지 내용을 입력하세요"
              className="h-44 w-full resize-none rounded-lg border border-[#DCE3EF] px-3 py-2 text-sm outline-none focus:border-[#336DFE]"
              required
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#DCE3EF] px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#336DFE] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2558D6]"
          >
            보내기
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default NewMessageModal;
