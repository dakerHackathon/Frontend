const Modal = ({ title, onClose, children, maxWidth = "max-w-2xl" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
    <div className={`w-full ${maxWidth} rounded-2xl bg-white p-5 shadow-2xl`}>
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
        >
          닫기
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
