import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useOnClickOutside } from 'usehooks-ts';

import { entriesStore } from '@/store/entries';
import { tagsState } from '@/store/tags-state';

import { TagSelector } from '../tag-selector/TagSelector';

export const TagEditor = observer(() => {
  const entryStore = entriesStore;
  const { activeEntry } = entryStore;
  const [showTags, setShowTags] = useState(true);
  const tagsRef = useRef(null);

  const tags = useMemo(() => {
    return activeEntry?.tags!.map((t) => toJS(tagsState.tagsMap[t])).filter(Boolean) ?? [];
  }, [activeEntry?.tags, tagsState.tagsMap]);

  console.log({ tags });

  const onTagSelectorBlur = () => {
    setShowTags(true);
  };

  const hasTags = tags.length > 0 && showTags;

  useOnClickOutside(tagsRef, onTagSelectorBlur);

  return (
    <div className="tags">
      {hasTags ? (
        <div onClick={() => setShowTags(false)} className="tags-container">
          {tags?.map((tag: any) => {
            return (
              <div key={tag.value} className="tag">
                <p>{tag.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <TagSelector
          // @ts-ignore
          onTagSelect={(tags: string[]) => {
            entriesStore.updateActiveEntryTags(tags);
          }}
          tags={tags}
          containerRef={tagsRef}
        />
      )}
    </div>
  );
});
