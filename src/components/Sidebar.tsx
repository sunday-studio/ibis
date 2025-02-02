import { useTopLevelFolders } from '@/services/db/folders';
import { NavLink } from 'react-router';
import { IoFileTrayFullOutline } from 'react-icons/io5';
import { ReactNode } from 'react';
import { LiaFeatherSolid } from 'react-icons/lia';
import { Tooltip } from './Tooltip';
import { TooltipTrigger } from 'react-aria-components';
import { Trash2Icon, FeatherIcon, ListTodoIcon, CableIcon, NotebookPenIcon } from 'lucide-react';

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
    <div className="h-full flex flex-col border-r border-gray-200 px-2 gap-3 py-4">
      {topLevelProducts.slice(0, -1).map((product, index) => (
        <NavLink
          to={product.route}
          key={index}
          className={({ isActive }) =>
            isActive ? 'bg-gray-200 rounded-xl' : 'bg-transparent hover:bg-gray-200 rounded-xl'
          }
        >
          <TooltipTrigger>
            <button
              key={product.name}
              className="w-10 h-10 flex items-center justify-center p-2 cursor-pointer hover:bg-gray-200 rounded-xl transition-all duration-300 hover:border-gray-300 border border-transparent"
            >
              {product.icon}
            </button>
            <Tooltip>{product.name}</Tooltip>
          </TooltipTrigger>
        </NavLink>
      ))}
      <div className="flex-1" />
      <NavLink
        to={topLevelProducts[topLevelProducts.length - 1].route}
        className={({ isActive }) =>
          isActive ? 'bg-gray-200 rounded-xl' : 'bg-transparent hover:bg-gray-200 rounded-xl'
        }
      >
        <TooltipTrigger>
          <button
            key={topLevelProducts[topLevelProducts.length - 1].name}
            className="w-10 h-10 flex items-center justify-center p-2 cursor-pointer hover:bg-gray-200 rounded-xl transition-all duration-300 hover:border-gray-300 border border-transparent"
          >
            {topLevelProducts[topLevelProducts.length - 1].icon}
          </button>
          <Tooltip>{topLevelProducts[topLevelProducts.length - 1].name}</Tooltip>
        </TooltipTrigger>
      </NavLink>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <div className="flex h-full">
      <ProductNavigation />
      {/* {topLevelFolders?.map((folder) => (
        <p key={folder.folder_id}>{folder.folder_name}</p
        >
      ))}
      <Button onPress={handleShow}>Create Folder</Button>
      <CreateFolderModal isOpen={isModalOpen} onClose={handleHide} onSubmit={handleHide} /> */}
    </div>
  );
};
