import { useCallback, useEffect, useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { Reorder, useMotionValue } from 'framer-motion';
import { BadgePlus, DoorOpen, PanelRightOpen, Trash2Icon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { appState } from '../../store/app-state';
import { entriesStore } from '../../store/entries';
import { SidebarEntrySection } from './SidebarEntrySection';
import { ThemeToggle } from './ThemeToggle';

const RouteLink = ({ onClick, title, icon: Icon }) => {
  return (
    <div className="route" onClick={onClick}>
      <div className="icon">{Icon && <Icon color="#6b7280" size={16} strokeWidth={2.5} />}</div>
      <p className="route-text">{title}</p>
    </div>
  );
};

function useScrollTop() {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = (event) => {
    setScrollTop(event.target.scrollTop);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return [scrollTop, { ref: scrollContainerRef }];
}

export const Sidebar = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    entriesStore.load();
  }, []);

  function goToPage(route) {
    entriesStore.removeActiveEntry();
    navigate(route);
  }

  const [scrollTop, scrollProps] = useScrollTop();

  return (
    <>
      <div className="sidebar">
        <div
          className="sidebar-toggle"
          role="button"
          onClick={() => appState.toggleSidebarOpenState()}
        >
          <PanelRightOpen size={18} />
        </div>

        <div className="section header-section">
          <RouteLink
            title="Today"
            icon={DoorOpen}
            onClick={() => {
              goToPage('/today');
            }}
          />
          <RouteLink title="Trash" icon={Trash2Icon} onClick={() => goToPage('/trash')} />
          <RouteLink
            title="New Entry"
            icon={BadgePlus}
            onClick={() => {
              const entryId = entriesStore.addNewEntry();
              navigate(`/entry/${entryId}`);
            }}
          />
        </div>

        <div
          className={clsx('sidebar-entries', {
            'sidebar-entries__withborder': scrollTop > 50,
          })}
          {...scrollProps}
        >
          {Boolean(entriesStore.pinnedEntriesId.length) && (
            <SidebarEntrySection
              entries={entriesStore.pinnedEntries}
              sectionTitle="Private"
              actions={{
                newEntry: false,
                newFolder: false,
              }}
            />
          )}
          <SidebarEntrySection entries={entriesStore.privateEntries} sectionTitle="Private" />
        </div>

        <div className="sidebar-footer">
          <p className="version favorit-font">version {APP_VERSION} ✨</p>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
});
