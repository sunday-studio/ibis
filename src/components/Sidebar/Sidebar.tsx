import {
  BoltIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  LaptopMinimalCheckIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { Entries } from '@/components/Sidebar/Entries';

import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { RouteLink } from './RouteLink';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full pb-2" data-tauri-drag-region>
      <div className="w-full flex flex-col h-full py-4" data-tauri-drag-region>
        <div className="flex flex-col px-4">
          <RouteLink onClick={() => {}} title="Journal" icon={CalendarDaysIcon} shortcutKey="⌘N" />
          <RouteLink onClick={() => {}} title="Notes" icon={BookOpenIcon} shortcutKey="⌘N" />
          <RouteLink
            onClick={() => {}}
            title="Tasks"
            icon={LaptopMinimalCheckIcon}
            shortcutKey="⌘N"
          />
          <RouteLink onClick={() => {}} title="Search" icon={SearchIcon} shortcutKey="⌘N" />
        </div>

        <Entries />

        <div className="flex flex-col mt-auto px-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="unstyled"
              className="p-2 m-0 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 ring-2 ring-stone-200 dark:ring-stone-700 ring-inset"
            >
              <PlusIcon size={16} />
            </Button>

            <div className="flex items-center gap-1">
              <Tooltip
                trigger={
                  <Button
                    variant="unstyled"
                    className="p-2 m-0 rounded-xl hover:bg-stone-200 hover:dark:bg-stone-600"
                    onPress={() => {
                      navigate('/trash');
                    }}
                  >
                    <TrashIcon
                      className="text-stone-600 dark:text-stone-400"
                      size={16}
                      strokeWidth={2}
                    />
                  </Button>
                }
                content="Open bin"
              />
              <Tooltip
                trigger={
                  <Button
                    variant="unstyled"
                    className="p-2 m-0 rounded-xl hover:bg-stone-200 hover:dark:bg-stone-600"
                  >
                    <BoltIcon
                      className="text-stone-600 dark:text-stone-400"
                      size={16}
                      strokeWidth={2}
                    />
                  </Button>
                }
                content="Open settings"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
