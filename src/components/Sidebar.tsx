import { NavLink, useLocation } from 'react-router';
import { ReactNode } from 'react';
import { Tooltip } from './Tooltip';
import { Trash2Icon, FeatherIcon, ListTodoIcon, CableIcon, NotebookPenIcon } from 'lucide-react';
import { NotesSidebarMenu } from '@/features/notes/NotesSidebarMenu';
import { TasksSidebarMenu } from '@/features/tasks/TasksSidebarMenu';
import { ThoughtsSidebarMenu } from '@/features/thought/ThoughtsSidebarMenu';
import { JournalSidebarMenu } from '@/features/journal/JournalSidebarMenu';

type TopLevelProducts = {
  name: string;
  icon: ReactNode;
  route: string;
};

const ProductNavigation = () => {
  const topLevelProducts: TopLevelProducts[] = [
    { name: 'Journal', icon: <FeatherIcon />, route: '/journal' },
    {
      name: 'Notes',
      icon: <NotebookPenIcon />,
      route: '/notes',
    },
    { name: 'Tasks', icon: <ListTodoIcon />, route: '/tasks' },
    { name: 'Networked thoughts', icon: <CableIcon />, route: '/thoughts' },
    { name: 'Bin', icon: <Trash2Icon />, route: '/bin' },
  ];
  return (
    <div className="h-full flex flex-col border-r border-gray-200 px-2 gap-3 pb-4 pt-2">
      {topLevelProducts.slice(0, -1).map((product, index) => (
        <NavLink
          key={index}
          to={product.route}
          className={({ isActive }) =>
            isActive ? 'bg-gray-200 rounded-xl' : 'bg-transparent hover:bg-gray-200 rounded-xl'
          }
        >
          <button className="w-10 h-10 flex items-center justify-center p-2 cursor-pointer hover:bg-gray-200 rounded-xl transition-all duration-300 hover:border-gray-300 border border-transparent">
            {product.icon}
          </button>
        </NavLink>
      ))}
      <div className="flex-1" />
      <Tooltip
        content={topLevelProducts[topLevelProducts.length - 1].name}
        trigger={
          <button
            key={topLevelProducts[topLevelProducts.length - 1].name}
            className="w-10 h-10 flex items-center justify-center p-2 cursor-pointer hover:bg-gray-200 rounded-xl transition-all duration-300 hover:border-gray-300 border border-transparent"
          >
            {topLevelProducts[topLevelProducts.length - 1].icon}
          </button>
        }
      />
    </div>
  );
};

export const Sidebar = () => {
  const pathName = useLocation().pathname;

  const sidebarMenus = {
    '/journal': <JournalSidebarMenu />,
    '/notes': <NotesSidebarMenu />,
    '/tasks': <TasksSidebarMenu />,
    '/thoughts': <ThoughtsSidebarMenu />,
  };

  return (
    <div className="flex h-full">
      <ProductNavigation />
      <div className="p-2">{sidebarMenus[pathName as keyof typeof sidebarMenus]}</div>
    </div>
  );
};
