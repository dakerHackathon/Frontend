const Footer = () => {
  return (
    <footer className="w-full bg-[#336DFE] py-16 px-20 flex justify-between items-end text-white font-bold">
      <div className="flex gap-8 text-sm opacity-90">
        <span className="cursor-pointer hover:underline">이용약관</span>
        <span className="cursor-pointer hover:underline">개인정보처리방침</span>
        <span className="cursor-pointer hover:underline">정기결제약관</span>
        <span className="cursor-pointer hover:underline">서비스소개서</span>
      </div>
      <div className="text-5xl tracking-tighter">#336DFE</div>
    </footer>
  );
};

export default Footer;
