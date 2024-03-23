// @ts-nocheck
import { Fragment, useState } from 'react';
import { useMemo } from 'react';

import * as ContextMenu from '@radix-ui/react-context-menu';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import format from 'date-fns/format';
import { motion, useIsPresent } from 'framer-motion';
import {
  BadgeInfo,
  Columns,
  Copy,
  CornerUpRight,
  MoreHorizontal,
  Package,
  Pin,
  PinOff,
  Trash2,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';

import { truncate } from '@/lib/utils';

import { Entry, entriesStore } from '../../store/entries';
import { FolderMenu } from './FolderMenu';

type SidebarEntry = {
  selectEntry: (entry: Entry) => void;
  entry: Entry;
  activeEntry?: Entry | null;
};

export const SidebarEntry = observer(({ entry, activeEntry, selectEntry }: SidebarEntry) => {
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              selectEntry(entry);
            }}
          >
            <p className="entry-title">{truncate(entry.title) || 'Untitled'}</p>
            <Popover.Trigger asChild>
              <div
                className="icon more-options"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal strokeWidth={2.5} size={18} color="var(--text-primary)" />
              </div>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content className="popover-content popover-container" sideOffset={5}>
                <EntryActionOptions entry={entry} />
              </Popover.Content>
            </Popover.Portal>
          </motion.div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content
            className="popover-content popover-container"
            sideOffset={5}
            align="end"
          >
            <EntryActionOptions entry={entry} />
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </Popover.Root>
  );
});

const EntryActionOptions = observer(({ entry }: { entry: Entry; onDelete: () => void }) => {
  const { pinnedEntriesId } = entriesStore;
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const isPinned = pinnedEntriesId.includes(entry.id!);
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  const options = useMemo(() => {
    return [
      {
        title: isDoubleClicked ? 'Click again to delete' : 'Delete',
        action: () =>
          isDoubleClicked ? entriesStore.deleteEntry(entry.id) : setIsDoubleClicked(true),
        icon: <Trash2 size={16} />,
        disabled: false,
        active: isDoubleClicked,
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
        title: 'Move to',
        action: () => setShowFolderMenu(true),
        icon: <CornerUpRight size={16} />,
      },

      {
        title: 'Archive',
        action: () => toast('Note removed'),
        icon: <Package size={16} />,
        disabled: true,
      },

      {
        title: 'Open in split view',
        action: () => {},
        icon: <Columns size={16} />,
        disabled: true,
      },

      {
        title: 'Info',
        action: () => {},
        icon: <BadgeInfo size={16} />,
        disabled: true,
      },
    ];
  }, [pinnedEntriesId, isDoubleClicked]);

  if (showFolderMenu) {
    return <FolderMenu entryId={entry.id} onFolderSelect={() => setShowFolderMenu(false)} />;
  }

  return (
    <Fragment>
      <div
        style={{
          padding: 6,
        }}
      >
        {options.map((option, index) => {
          return (
            <div
              className={clsx('option', {
                option__disabled: option.disabled,
                option__active: option.active,
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
      </div>
    </Fragment>
  );
});
