import { FC, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

import { Folder as FolderType } from '@/services/db/types';

const EmptyState = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full px-2">
      <p className="text-sm font-medium text-gray-500 pb-2 italic">{text}</p>
    </div>
  );
};

interface FolderProps extends Pick<FolderType, 'name'> {
  emptyStateText?: string;
  items: any[] | undefined;
  renderItem: (item: any) => React.ReactNode;
  defaultOpen?: boolean;
}

export const Folder: FC<FolderProps> = ({
  name,
  emptyStateText,
  items,
  renderItem,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const showEmptyState = items?.length === 0;

  return (
    <button
      className="text-start rounded-xl cursor-pointer flex items-start gap-2 flex-col"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-3 w-full py-1 px-2 rounded-xl hover:bg-neutral-200 hover:dark:bg-stone-800">
        <FolderOpen size={16} strokeWidth={2.5} className="text-stone-500 dark:text-stone-200" />
        <p className="font-medium text-md text-stone-800 dark:text-stone-200">{name}</p>
      </div>
      <AnimatePresence initial={defaultOpen}>
        {isOpen && (
          <>
            {!showEmptyState ? (
              <motion.div
                initial={{ height: 0 }}
                key={name}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                className="overflow-hidden flex flex-col justify-end w-full gap-0.5"
              >
                {items?.map((item) => (
                  <motion.li className="list-none" key={item.id}>
                    {renderItem(item)}
                  </motion.li>
                ))}
              </motion.div>
            ) : (
              <EmptyState text={emptyStateText || 'No items in this folder'} />
            )}
          </>
        )}
      </AnimatePresence>
    </button>
  );
};
