import clsx from 'clsx';
import { FC } from 'react';
import {
  Button,
  Menu,
  Popover,
  MenuTrigger,
  MenuItem,
  Separator,
  MenuItemProps,
  MenuTriggerProps,
} from 'react-aria-components';
import { proxy, useSnapshot } from 'valtio';

export const menuState = proxy({
  isOpen: false,
  onOpenChange: (_: boolean) => {},
  setOnOpenChange: (onOpenChange: (state: boolean) => void) => {
    menuState.onOpenChange = onOpenChange;
  },
  setIsOpen: (isOpen: boolean) => {
    menuState.isOpen = isOpen;
  },
});

interface DropdownMenuRootProps extends MenuTriggerProps {
  children: React.ReactNode;
}

const DropdownMenuRoot: FC<DropdownMenuRootProps> = ({
  children,
  onOpenChange = () => {},
  isOpen = false,
  ...rest
}) => {
  const state = useSnapshot(menuState);
  state.setOnOpenChange(onOpenChange);
  state.setIsOpen(isOpen);

  return <MenuTrigger {...rest}>{children}</MenuTrigger>;
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  children,
  className,
  ...rest
}) => {
  const state = useSnapshot(menuState);

  return (
    <Button
      {...rest}
      onPress={() => {
        state.setIsOpen(!state.isOpen);
      }}
      className={clsx(
        'bg-transparent hover:ring-1 hover:ring-neutral-200 hover:bg-neutral-100 outline-none overflow-hidden flex items-center p-1 rounded-md',
        className,
      )}
    >
      {children}
    </Button>
  );
};

export const Content = ({
  children,
  withMenu = true,
  ...rest
}: {
  children: React.ReactNode;
  withMenu?: boolean;
  handleClose?: () => void;
}) => {
  const state = useSnapshot(menuState);

  return (
    <Popover
      {...rest}
      shouldCloseOnInteractOutside={() => {
        state.onOpenChange(false);
        menuState.setIsOpen(false);
        return true;
      }}
    >
      {withMenu && (
        <Menu className="w-[250px] bg-white p-1 shadow-1 rounded-lg flex flex-col gap-1">
          {children}
        </Menu>
      )}

      {!withMenu && children}
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

export const useDropdownMenuToggle = () => {
  const state = useSnapshot(menuState);

  const toggle = () => {
    menuState.setIsOpen(!state.isOpen);
  };

  return { isOpen: state.isOpen, toggle, setIsOpen: menuState.setIsOpen };
};
