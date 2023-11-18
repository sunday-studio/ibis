import { Fragment, useCallback, useMemo, useState } from 'react';

import { supabase } from '@/lib/auth/supabase';
import { ACCESS_TOKEN, USER_DATA } from '@/lib/constants';
import { syncAllEntriesToDisk, syncAllTodaysToDisk } from '@/lib/data-engine/syncing-helpers';
import { clearData } from '@/lib/storage';
import { appState } from '@/store/app-state';
import { entriesStore } from '@/store/entries';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { LogOut, MonitorDown, Palette, Tv2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserTileMenu = () => {
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const navigate = useNavigate();

  const logoutUser = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      clearData(ACCESS_TOKEN);
      clearData(USER_DATA);
      navigate('/auth');
      navigate(0);
    } catch (error) {
      console.log('error=>', error);
    }
  }, []);

  const syncToDevice = useCallback(async () => {
    // TODO: optimize to only sync items that have changed since last sync
    await syncAllTodaysToDisk();
    await syncAllEntriesToDisk();

    toast.success('All entries synced');
  }, [entriesStore]);

  const options = useMemo(() => {
    return [
      {
        title: 'Settings',
        action: () => navigate('/settings'),
        icon: <Tv2 size={16} />,
        disable: false,
        active: false,
      },

      {
        title: 'Dark Mode',
        action: () => appState.toggleTheme('light'),
        icon: <Palette size={16} />,
      },

      {
        title: 'Sync',
        action: () => syncToDevice(),
        icon: <MonitorDown size={16} />,
      },
      {
        title: isDoubleClicked ? 'Click again to logout' : 'Logout',
        action: () => (isDoubleClicked ? logoutUser() : setIsDoubleClicked(true)),
        icon: <LogOut size={16} />,
        active: isDoubleClicked,
      },
    ];
  }, [isDoubleClicked]);

  return (
    <Fragment>
      {options.map((option, index) => {
        return (
          <div
            className={clsx('option', {
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
    </Fragment>
  );
};

export const UserTile = () => {
  const user = appState?.session?.user;
  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <div className="usertile">
            <div className="user">
              <div className="user-avatar">
                <p className="favorit-font medium font">{user?.user_metadata?.name?.charAt(0)}</p>
              </div>

              <div className="user-info">
                <p className="name favorit-font medium-font">{user?.user_metadata?.name}</p>
                <p className="email">{user?.email}</p>
              </div>
            </div>
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="usertile-menu PopoverContent"
            sideOffset={5}
            alignOffset={-28}
            align="end"
          >
            <UserTileMenu />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
};
