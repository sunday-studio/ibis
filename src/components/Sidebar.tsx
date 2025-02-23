import { NavLink, useLocation } from 'react-router';
import {
  TrashIcon,
  FeatherIcon,
  ListTodoIcon,
  CableIcon,
  NotebookPenIcon,
  SettingsIcon,
} from 'lucide-react';
import { NotesSidebarMenu } from '@/features/notes/NotesSidebarMenu';
import { TasksSidebarMenu } from '@/features/tasks/TasksSidebarMenu';
import { ThoughtsSidebarMenu } from '@/features/thought/ThoughtsSidebarMenu';
import { JournalSidebarMenu } from '@/features/journal/JournalSidebarMenu';

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
  const pathName = useLocation().pathname;

  const sidebarMenus = {
    journal: <JournalSidebarMenu />,
    notes: <NotesSidebarMenu />,
    tasks: <TasksSidebarMenu />,
    thoughts: <ThoughtsSidebarMenu />,
  };

  const currentPath = Object.keys(sidebarMenus).find((path) => pathName.includes(path));
  const currentSidebarMenu = currentPath
    ? sidebarMenus[currentPath as keyof typeof sidebarMenus]
    : null;

  return (
    <div className="flex h-full" data-tauri-drag-region>
      <div className="w-full h-full" data-tauri-drag-region>
        {/* {currentSidebarMenu} */}
        <NotesSidebarMenu />
      </div>
    </div>
  );
};
