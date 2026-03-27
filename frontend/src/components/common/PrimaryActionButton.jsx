const PrimaryActionButton = ({ children, type = "button", onClick, fullWidth = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-[#336DFE] px-5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#2458E6] hover:shadow-[0_14px_30px_rgba(51,109,254,0.25)] ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default PrimaryActionButton;
