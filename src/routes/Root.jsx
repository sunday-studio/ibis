import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { MotionConfig, motion } from 'framer-motion';

import { Key } from 'ts-key-enum';

import { Sidebar } from '../components/Sidebar';
import { appState } from '../store/app-state';

const Open = {
  Open: 'open',
  Closed: 'closed',
};

const SIDEBAR_WIDTH = 300;

const Root = observer(() => {
  useHotkeys(`${Key.Meta}+s`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+s`, () => appState.toggleSidebarOpenState());

  return (
    <MotionConfig
      transition={{
        ease: [0.165, 0.84, 0.44, 1],
        duration: 0.3,
      }}
    >
      <div className="page-container">
        <div className="two-column-container">
          <motion.div
            initial={false}
            animate={{
              display: appState.sidebarIsOpen ? 'flex' : 'none',
              width: appState.sidebarIsOpen ? SIDEBAR_WIDTH : 0,
            }}
            className="sidebar-container"
          >
            <motion.div
              animate={appState.sidebarIsOpen}
              variants={{
                [Open.Open]: {
                  opacity: 1,
                  transition: {
                    duration: 0.15,
                    delay: 0.2,
                  },
                },
                [Open.Closed]: {
                  opacity: 0,
                  transition: {
                    duration: 0.15,
                  },
                },
              }}
            >
              <Sidebar />
            </motion.div>
          </motion.div>
          <Outlet />
        </div>
      </div>
    </MotionConfig>
  );
});

export default Root;
