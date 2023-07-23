// @ts-nocheck
import { Fragment } from 'react';
import { useMemo } from 'react';

import { truncate } from '@/lib/utils';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import format from 'date-fns/format';
import { motion, useIsPresent } from 'framer-motion';
import {
  BadgeInfo,
  Columns,
  Copy,
  MoreHorizontal,
  Package,
  Pin,
  PinOff, // SquareStack,
  Trash2,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';

import { Entry, entriesStore } from '../store/entries';

// import { useAppStore } from './AppContext';

export const SidebarEntry = observer(({ entry, activeEntry, onDelete }) => {
  const isActive = entry?.id === activeEntry?.id;
  const isPresent = useIsPresent();

  const animations = {
    style: {
      position: isPresent ? 'static' : 'absolute',
    },
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { type: 'linear', duration: 0.1 },
  };

  return (
    <Popover.Root key={entry.id}>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <motion.div
            {...animations}
            className={`entry ${isActive ? 'active-entry' : ''}`}
            onClick={() => entriesStore.selectEntry(entry)}
          >
            {/* <div className="icon">
              <Text size={16} strokeWidth={2.5} color={isActive ? '#fc521f' : '#6b7280'} />
            </div> */}
            <p className="entry-title">{truncate(entry.title) || 'Untitled'}</p>
            <Popover.Trigger asChild>
              <div
                className="icon more-options"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal
                  strokeWidth={2.5}
                  size={18}
                  color={isActive ? '#fc521f' : '#6b7280'}
                />
              </div>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content className="PopoverContent" sideOffset={5}>
                <MoreOptions entry={entry} onDelete={onDelete} />
              </Popover.Content>
            </Popover.Portal>
          </motion.div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="PopoverContent" sideOffset={5} align="end">
            <MoreOptions entry={entry} onDelete={onDelete} />
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </Popover.Root>
  );
});

const MoreOptions = observer(({ entry, onDelete }: { entry: Entry; onDelete: () => void }) => {
  const { pinnedEntriesId } = entriesStore;

  const isPinned = pinnedEntriesId.includes(entry.id!);

  const options = useMemo(() => {
    return [
      {
        title: 'Delete',
        action: () => onDelete(),
        icon: <Trash2 size={16} />,
        disabled: false,
      },

      {
        title: 'Duplicate',
        action: () => entriesStore.duplicateEntry(entry),
        icon: <Copy size={16} />,
      },

      {
        title: isPinned ? 'Unpin' : 'Pin',
        action: () =>
          entriesStore.updatePinned({
            id: entry.id,
            type: isPinned ? 'REMOVE' : 'ADD',
          }),
        icon: isPinned ? <PinOff size={16} /> : <Pin size={16} />,
      },

      {
        title: 'Open in split view',
        action: () => {},
        icon: <Columns size={16} />,
        disabled: true,
      },

      {
        title: 'Archive',
        action: () => toast('Note removed'),
        icon: <Package size={16} />,
        disabled: true,
      },

      {
        title: 'Info',
        action: () => {},
        icon: <BadgeInfo size={16} />,
        disabled: true,
      },
    ];
  }, [pinnedEntriesId]);

  return (
    <Fragment>
      {options.map((option, index) => {
        return (
          <div
            className={clsx('option', {
              option__disabled: option.disabled,
            })}
            onClick={(e) => {
              option.action();
              e.stopPropagation();
            }}
            key={index}
          >
            <div className="option-icon">{option.icon}</div>
            <p>{option.title}</p>
          </div>
        );
      })}

      <div className="hr-divider" />
      <div className="entry-details">
        <p>Created on: {format(new Date(entry.createdAt), 'dd, MMMM yyy')}</p>
        {entry.updatedAt && (
          <p>Last edited on: {format(new Date(entry.createdAt), 'dd, MMM yy, h:m a')} </p>
        )}
      </div>
    </Fragment>
  );
});
