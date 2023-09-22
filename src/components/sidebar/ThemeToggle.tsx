import * as Popover from '@radix-ui/react-popover';
import { MoonStar, Orbit, Sun } from 'lucide-react';

import { appState } from '../../store/app-state';

export const ThemeToggle = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className="theme-toggle">
          <p className="">{appState.theme}</p>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="theme-menu PopoverContent" sideOffset={5}>
          <div className="theme-menu-options">
            <div className="option" onClick={() => appState.toggleTheme('light')}>
              <div className="option-icon">
                <Sun size={16} />
              </div>
              <p>Light</p>
            </div>

            <div className="option" onClick={() => appState.toggleTheme('night')}>
              <div className="option-icon">
                <MoonStar size={16} />
              </div>
              <p>Night</p>
            </div>

            <div className="option" onClick={() => appState.toggleTheme('system')}>
              <div className="option-icon">
                <Orbit size={16} />
              </div>
              <p>System</p>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
