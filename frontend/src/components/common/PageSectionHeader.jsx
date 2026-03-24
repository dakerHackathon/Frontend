const PageSectionHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
};

export default PageSectionHeader;
