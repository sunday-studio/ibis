import { FC } from 'react';
import {
  Button,
  Menu,
  Popover,
  MenuTrigger,
  MenuItem,
  Separator,
  MenuItemProps,
} from 'react-aria-components';

const DropdownMenuRoot = ({ children }: { children: React.ReactNode }) => {
  return <MenuTrigger>{children}</MenuTrigger>;
};

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <MenuTrigger>
      <Button>{children}</Button>
    </MenuTrigger>
  );
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <Menu className="w-[250px] p-1 shadow-md border border-neutral-50 ring-1 ring-neutral-200 rounded-lg flex flex-col gap-1">
        {children}
      </Menu>
    </Popover>
  );
};

interface DropdownMenuItemProps extends MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  action?: () => void;
}

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  children,
  icon,
  shortcut,
  disabled,
  action,
}) => {
  return (
    <MenuItem
      onAction={action}
      isDisabled={disabled}
      className={`
        transition-all
        rounded-md
        hover:ring-1 hover:ring-neutral-200 hover:bg-neutral-100 outline-none overflow-hidden flex items-center px-2 py-1.5 
        ${disabled ? 'opacity-50 hover:ring-transparent hover:bg-transparent' : 'cursor-pointer'}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {shortcut && <span className="ml-auto text-gray-800 font-light text-xs">{shortcut}</span>}
    </MenuItem>
  );
};

export const DropdownMenuSeparator = () => {
  return <Separator />;
};

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Content: Content,
});
