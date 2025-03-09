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
        'bg-transparent px-0.5 hover:bg-neutral-100 outline-none overflow-hidden flex items-center rounded-lg dark:hover:bg-stone-700 z-2',
        className,
      )}
    >
      {children}
    </Button>
  );
};

export const MenuContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <Menu className={clsx('py-1', className)}>{children}</Menu>;
};

MenuContent.displayName = 'MenuContent';

interface DropdownMenuItemProps extends MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string[];
  disabled?: boolean;
  action?: () => void;
  isDestructive?: boolean;
}

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  children,
  icon,
  shortcut,
  disabled,
  action,
  className,
  isDestructive,
}) => {
  return (
    <MenuItem onAction={action} isDisabled={disabled} className="outline-none px-1">
      {({ isFocused }) => (
        <div
          className={clsx(
            'transition-all  rounded-lg outline-none overflow-hidden flex items-center px-2 py-1',
            {
              'cursor-pointer': !disabled,
              'opacity-50 hover:bg-transparent': disabled,
              'bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400':
                isFocused && isDestructive,
              'bg-neutral-100 dark:bg-stone-700': isFocused && !isDestructive,
              'hover:text-stone-800 dark:text-stone-300': !isFocused,
            },
            className,
          )}
        >
          {icon && (
            <span
              className={clsx('mr-2 ', {
                'text-red-500': isFocused && isDestructive,
                'text-stone-500': !isDestructive || !isFocused,
              })}
            >
              {icon}
            </span>
          )}
          <span className="inherit">{children}</span>
          {shortcut && (
            <span className="ml-auto font-mono">
              {shortcut.map((s) => (
                <kbd key={s} className="px-1 py-0.5">
                  {s}
                </kbd>
              ))}
            </span>
          )}
        </div>
      )}
    </MenuItem>
  );
};

const Content = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    withMenu?: boolean;
    handleClose?: () => void;
    className?: string;
  }
>(({ children, className, ...rest }, ref) => {
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
      <div
        className={clsx(
          'w-[230px] bg-white shadow-1 rounded-xl flex flex-col gap-1 dark:bg-stone-800 overflow-y-auto',
          className,
        )}
      >
        {children}
      </div>
    </Popover>
  );
});

Content.displayName = 'Content';

export const DropdownMenuSeparator = () => {
  return <Separator className="w-full dark:border-stone-700 border-stone-200" />;
};

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  MenuContent,
  Content,
});

export const useDropdownMenuToggle = () => {
  const state = useSnapshot(menuState);

  const toggle = () => {
    menuState.setIsOpen(!state.isOpen);
  };

  return { isOpen: state.isOpen, toggle, setIsOpen: menuState.setIsOpen };
};
