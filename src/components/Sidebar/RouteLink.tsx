export const RouteLink = ({
  onClick,
  title,
  icon: Icon,
  shortcutKey,
}: {
  onClick: () => void;
  title: string;
  icon?: any;
  shortcutKey?: string;
}) => {
  return (
    <div
      className="flex items-center cursor-pointer transition-all duration-300 px-2 py-0.5 rounded-xl gap-3 hover:bg-neutral-200 hover:dark:bg-stone-800"
      onClick={onClick}
    >
      <div className="flex justify-center items-center">
        {Icon && <Icon className="text-stone-600 dark:text-stone-200" size={16} strokeWidth={2} />}
      </div>
      <p className="font-medium text-stone-800 dark:text-stone-200">{title}</p>

      {shortcutKey && (
        <div className="ml-auto px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 invisible opacity-0 transition-[visibility,opacity] duration-200 uppercase text-stone-700 dark:text-stone-200 group-hover:visible group-hover:opacity-100">
          {shortcutKey}
        </div>
      )}
    </div>
  );
};
