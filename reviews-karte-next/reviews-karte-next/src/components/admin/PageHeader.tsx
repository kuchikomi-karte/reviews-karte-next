type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone-400">
          Admin
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
