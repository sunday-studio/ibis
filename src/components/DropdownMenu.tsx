import { FC, forwardRef } from 'react';

import clsx from 'clsx';
import {
  Button,
  Menu,
  MenuItem,
  MenuItemProps,
  MenuTrigger,
  MenuTriggerProps,
  Popover,
  Separator,
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
        'bg-transparent hover:ring-1 hover:ring-neutral-200 hover:bg-neutral-100 outline-none overflow-hidden flex items-center rounded-lg dark:hover:bg-stone-700 z-2 px-1 py-0.5',
        className,
      )}
    >
      {children}
    </Button>
  );
};

export const Content = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    withMenu?: boolean;
    handleClose?: () => void;
    className?: string;
  }
>(({ children, withMenu = true, className, ...rest }, ref) => {
  const state = useSnapshot(menuState);

  return (
    <Popover
      {...rest}
      ref={ref}
      shouldCloseOnInteractOutside={() => {
        state.onOpenChange(false);
        menuState.setIsOpen(false);
        return true;
      }}
    >
      {withMenu && (
        <Menu
          className={clsx(
            'w-[250px] bg-white p-2 shadow-1 rounded-xl flex flex-col gap-1 dark:bg-stone-800 overflow-y-auto',
            className,
          )}
        >
          {children}
        </Menu>
      )}

      {!withMenu && children}
    </Popover>
  );
});

Content.displayName = 'Content';

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
  className,
}) => {
  return (
    <MenuItem
      onAction={action}
      isDisabled={disabled}
      className={clsx(
        'transition-all rounded-lg hover:ring-1 hover:ring-neutral-200 hover:bg-neutral-100 outline-none overflow-hidden flex items-center px-2 py-1.5 dark:hover:bg-stone-700',
        disabled ? 'opacity-50 hover:ring-transparent hover:bg-transparent' : 'cursor-pointer',
        className,
      )}
    >
      {icon && <span className="mr-2 text-stone-500">{icon}</span>}
      <span className="text-stone-900 dark:text-stone-300">{children}</span>
      {shortcut && (
        <span className="ml-auto text-stone-900 dark:text-stone-300 font-light text-xs">
          {shortcut}
        </span>
      )}
    </MenuItem>
  );
};

export const DropdownMenuSeparator = () => {
  return <Separator className="w-full border-neutral-200 dark:border-stone-700 border-b" />;
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
