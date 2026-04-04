const Footer = () => {
  return (
    <footer className="w-full bg-[#336DFE] px-8 py-16 text-white lg:px-20">
      <div className="mx-auto flex max-w-[1640px] items-end justify-between gap-4 sm:gap-6 lg:gap-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 whitespace-nowrap text-[11px] opacity-90 sm:gap-5 sm:text-xs lg:gap-8 lg:text-sm">
          <span>이용약관</span>
          <span>제작자</span>
          <span>버전 정보</span>
        </div>
        <div className="shrink-0 whitespace-nowrap text-xl tracking-tighter sm:text-4xl lg:text-xl">
          © 2026 Blooming. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
