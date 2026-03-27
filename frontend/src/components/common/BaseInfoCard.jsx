const BaseInfoCard = ({ children, className = "", ...props }) => {
  return (
    <article
      className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-[#C9D7FF] hover:shadow-[0_24px_50px_rgba(51,109,254,0.12)] ${className}`}
      {...props}
    >
      {children}
    </article>
  );
};

export default BaseInfoCard;
