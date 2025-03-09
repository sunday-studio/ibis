import {
  BoltIcon,
  BookOpenIcon,
  CableIcon,
  CalendarDaysIcon,
  FeatherIcon,
  LaptopMinimalCheckIcon,
  ListTodoIcon,
  NotebookPenIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

import { Entries } from '@/components/Sidebar/Entries';

import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { RouteLink } from './RouteLink';

type TopLevelProducts = {
  name: string;
  icon: any;
  route: string;
};

const ProductNavigationItem = ({ product }: { product: TopLevelProducts }) => (
  <NavLink
    to={product.route}
    className={({ isActive }) => (isActive ? 'text-orange-500' : 'text-gray-600')}
  >
    <button className="flex h-10 w-10 items-center justify-center font-medium transition-all duration-300 cursor-pointer">
      {<product.icon size={18} strokeWidth={2} className="text-inherit" />}
    </button>
  </NavLink>
);

export const ProductNavigation = () => {
  const topRoutes: TopLevelProducts[] = [
    { name: 'Journal', icon: FeatherIcon, route: '/journal' },
    {
      name: 'Notes',
      icon: NotebookPenIcon,
      route: '/notes',
    },

    { name: 'Tasks', icon: ListTodoIcon, route: '/tasks' },
    { name: 'Networked thoughts', icon: CableIcon, route: '/thoughts' },
  ];

  const bottomRoutes: TopLevelProducts[] = [
    { name: 'Settings', icon: SettingsIcon, route: '/settings' },
    { name: 'Bin', icon: TrashIcon, route: '/bin' },
  ];

  return (
    <div className="h-full flex flex-col border-gray-200 px-2 pb-4 pt-2 ">
      <div className="flex items-center justify-center">
        <img src="/icon.png" alt="logo" className="w-10 h-10" />
      </div>
      <div className="flex flex-col gap-2 mt-8">
        {topRoutes.slice(0, -1).map((product, index) => (
          <ProductNavigationItem key={index} product={product} />
        ))}
      </div>
      <div className="flex-1" />

      <div className="flex flex-col gap-2 mt-8">
        {bottomRoutes.map((product, index) => (
          <ProductNavigationItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export const Sidebar = () => {
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
